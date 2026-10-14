import { describe, expect, it } from 'vitest';
import {
	checkBrandToolkit,
	checkCoverage,
	currentSessionStart,
	discoverSites,
	extractLinks,
	findPastSessions,
	findStalePages,
	loadConfig,
	loadCoverage,
	renderReport,
	reviewedDate,
	siteKey,
} from '../../scripts/content-report.mjs';

const multi = ['centre.iium.edu.my', 'kulliyyah.iium.edu.my'];

describe('siteKey', () => {
	it('groups IIUM URLs by site', () => {
		expect(siteKey('https://www.iium.edu.my/v2/istac/', multi)).toBe(
			'iium.edu.my',
		);
		expect(siteKey('https://imaluum.iium.edu.my/home', multi)).toBe(
			'imaluum.iium.edu.my',
		);
		expect(siteKey('https://centre.iium.edu.my/CCSC/about', multi)).toBe(
			'centre.iium.edu.my/ccsc',
		);
		expect(siteKey('https://centre.iium.edu.my/', multi)).toBe(
			'centre.iium.edu.my',
		);
	});

	it('ignores non-IIUM and look-alike domains', () => {
		expect(siteKey('https://example.com', multi)).toBeNull();
		expect(siteKey('https://notiium.edu.my', multi)).toBeNull();
		expect(siteKey('mailto:x@iium.edu.my', multi)).toBeNull();
	});
});

describe('extractLinks', () => {
	it('reads hrefs and sitemap locations as absolute URLs', () => {
		const html = `<a href="/v2/library">x</a><a href='https://lib.iium.edu.my/#top'>y</a>
			<loc> https://centre.iium.edu.my/sdc </loc>`;
		expect(extractLinks(html, 'https://www.iium.edu.my/').sort()).toEqual([
			'https://centre.iium.edu.my/sdc',
			'https://lib.iium.edu.my/',
			'https://www.iium.edu.my/v2/library',
		]);
	});
});

describe('discoverSites', () => {
	it('reports unknown IIUM sites once and remembers failed seeds', async () => {
		const pages: Record<string, string> = {
			'https://seed.iium.edu.my/': `
				<a href="https://imaluum.iium.edu.my/">known</a>
				<a href="https://newportal.iium.edu.my/login">new</a>
				<a href="https://newportal.iium.edu.my/other">same site</a>
				<a href="https://centre.iium.edu.my/newcentre/">new centre</a>
				<a href="https://ignored.iium.edu.my/">ignored</a>
				<a href="https://google.com/">external</a>`,
		};
		const { sites, failedSeeds } = await discoverSites(
			{
				seeds: ['https://seed.iium.edu.my/', 'https://down.iium.edu.my/'],
				multiSiteHosts: multi,
				ignore: ['ignored.iium.edu.my', 'seed.iium.edu.my'],
			},
			new Set(['imaluum.iium.edu.my']),
			async (url: string) => pages[url] ?? null,
		);
		expect(sites.map((s: { key: string }) => s.key)).toEqual([
			'centre.iium.edu.my/newcentre',
			'newportal.iium.edu.my',
		]);
		expect(failedSeeds).toEqual(['https://down.iium.edu.my/']);
	});
});

describe('stale pages', () => {
	it('prefers the lastUpdated frontmatter date', () => {
		const reviewed = reviewedDate(
			'---\ntitle: x\nlastUpdated: 2025-01-30\n---\nbody',
			'nowhere.md',
		);
		expect(reviewed?.source).toBe('lastUpdated');
		expect(reviewed?.date.toISOString().slice(0, 10)).toBe('2025-01-30');
	});

	it('lists pages older than the threshold, oldest first', () => {
		const now = Date.parse('2026-10-13');
		const dates: Record<string, string> = {
			'fresh.md': '2026-10-01',
			'old.md': '2025-01-01',
			'older.md': '2024-01-01',
		};
		const stale = findStalePages(Object.keys(dates), now, 180, (file) => ({
			date: new Date(dates[file]),
			source: 'lastUpdated',
		}));
		expect(stale.map((s: { file: string }) => s.file)).toEqual([
			'older.md',
			'old.md',
		]);
	});
});

describe('report', () => {
	it('renders both sections and the shipped config is valid', () => {
		const config = loadConfig();
		expect(config.seeds.length).toBeGreaterThan(0);
		const report = renderReport({
			stale: [],
			sites: [],
			failedSeeds: [],
			staleAfterDays: config.staleAfterDays,
		});
		expect(report).toContain('Pages to review (0)');
		expect(report).toContain('IIUM sites not in the guide yet (0)');
	});
});

describe('past sessions', () => {
	it('treats September as the start of a new session', () => {
		expect(currentSessionStart(Date.parse('2026-10-13'))).toBe(2026);
		expect(currentSessionStart(Date.parse('2026-08-31'))).toBe(2025);
	});

	it('flags only sessions that have ended', () => {
		const text: Record<string, string> = {
			'old.md': 'Semester 2, 2023/2024 and 2025 / 2026',
			'current.md': 'Session 2026/2027 dates',
			'other.md': 'Founded 2020/2030, phone 2019/2024',
		};
		expect(
			findPastSessions(
				Object.keys(text),
				Date.parse('2026-10-13'),
				(f: string) => text[f],
			),
		).toEqual([{ file: 'old.md', sessions: ['2023/2024', '2025/2026'] }]);
	});

	it('marks an empty report so the workflow can close the issue', () => {
		const empty = renderReport({
			stale: [],
			sites: [],
			failedSeeds: [],
			staleAfterDays: 180,
		});
		expect(empty).toContain('nothing to do');
		const busy = renderReport({
			stale: [],
			pastSessions: [{ file: 'a.md', sessions: ['2023/2024'] }],
			sites: [],
			failedSeeds: [],
			staleAfterDays: 180,
		});
		expect(busy).not.toContain('nothing to do');
		expect(busy).toContain('past semesters (1)');
	});
});

describe('coverage', () => {
	it('lists only pages that exist', () => {
		const { missingPages } = checkCoverage(loadCoverage());
		expect(missingPages).toEqual([]);
	});

	it('reports topics without pages as gaps', () => {
		const { gaps, missingPages } = checkCoverage(
			{
				topics: [
					{ topic: 'Covered', pages: ['a.md'] },
					{ topic: 'Food', pages: [] },
					{ topic: 'Renamed', pages: ['gone.md'] },
				],
			},
			(page: string) => !page.endsWith('gone.md'),
		);
		expect(gaps).toEqual(['Food']);
		expect(missingPages).toEqual([{ topic: 'Renamed', page: 'gone.md' }]);
		const report = renderReport({
			stale: [],
			sites: [],
			failedSeeds: [],
			staleAfterDays: 180,
			gaps,
		});
		expect(report).not.toContain('nothing to do');
		expect(report).toContain('Topics not covered yet (1)');
		expect(report).toContain('- Food');
	});
});

describe('brand toolkit', () => {
	const toolkit = {
		page: 'https://office.iium.edu.my/ocap/official-iium-2/',
		files: [
			'https://office.iium.edu.my/ocap/wp-content/uploads/sites/2/2025/07/Corporate-Colours-of-IIUM.pdf',
			'https://office.iium.edu.my/ocap/wp-content/uploads/sites/2/2025/07/Old.pdf',
		],
	};
	const page = `
		<a href="/ocap/wp-content/uploads/sites/2/2025/07/Corporate-Colours-of-IIUM.pdf">Colours</a>
		<a href="https://office.iium.edu.my/ocap/wp-content/uploads/sites/2/2027/01/Brand-Toolkit-V3.pdf">New</a>
		<a href="https://office.iium.edu.my/ocap/contact/">Contact</a>`;

	it('lists toolkit files added and removed since DESIGN.md was checked', async () => {
		expect(await checkBrandToolkit(toolkit, async () => page)).toEqual({
			added: [
				'https://office.iium.edu.my/ocap/wp-content/uploads/sites/2/2027/01/Brand-Toolkit-V3.pdf',
			],
			removed: [
				'https://office.iium.edu.my/ocap/wp-content/uploads/sites/2/2025/07/Old.pdf',
			],
			failed: false,
			page: toolkit.page,
		});
	});

	it('reports a page it could not load without asking for a review', async () => {
		const brand = await checkBrandToolkit(toolkit, async () => null);
		expect(brand.failed).toBe(true);
		const report = renderReport({
			stale: [],
			sites: [],
			failedSeeds: [],
			staleAfterDays: 180,
			brand,
		});
		expect(report).toContain('nothing to do');
		expect(report).toContain("Couldn't load the IIUM brand toolkit page");
	});

	it('asks for a DESIGN.md review when the toolkit changed', async () => {
		const report = renderReport({
			stale: [],
			sites: [],
			failedSeeds: [],
			staleAfterDays: 180,
			brand: await checkBrandToolkit(toolkit, async () => page),
		});
		expect(report).not.toContain('nothing to do');
		expect(report).toContain('IIUM brand toolkit changed');
		expect(report).toContain('Brand-Toolkit-V3.pdf');
		expect(report).toContain('Old.pdf');
	});
});
