#!/usr/bin/env node
/**
 * Monthly content report, posted as a single GitHub issue by
 * .github/workflows/content-report.yml:
 *
 * - Stale pages: not reviewed (frontmatter `lastUpdated`, else last git
 *   commit) within `staleAfterDays`.
 * - New IIUM sites: *.iium.edu.my sites linked from official pages
 *   (scripts/discovery.json seeds) that the guide doesn't mention yet.
 * - Brand toolkit changes: files IIUM added to or removed from its brand
 *   toolkit page since DESIGN.md was last checked against it.
 *
 *   node scripts/content-report.mjs > report.md
 */

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { extractUrls, listContentFiles } from './submissions.mjs';

const DAY = 24 * 60 * 60 * 1000;

export function loadConfig(path = 'scripts/discovery.json') {
	return JSON.parse(readFileSync(path, 'utf8'));
}

/** Date a page was last reviewed, from frontmatter or git history. */
export function reviewedDate(content, file) {
	const frontmatter = content.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
	const value = frontmatter.match(/^lastUpdated:\s*['"]?([\d-]+)/m)?.[1];
	if (value && !Number.isNaN(Date.parse(value))) {
		return { date: new Date(value), source: 'lastUpdated' };
	}
	try {
		const date = execFileSync(
			'git',
			['log', '-1', '--format=%cI', '--', file],
			{
				encoding: 'utf8',
			},
		).trim();
		if (date) return { date: new Date(date), source: 'last edit' };
	} catch {
		// not a git checkout
	}
	return null;
}

export function findStalePages(files, now, staleAfterDays, readDate) {
	const stale = [];
	for (const file of files) {
		const reviewed = readDate(file);
		const age = reviewed ? Math.floor((now - reviewed.date) / DAY) : Infinity;
		if (age > staleAfterDays) stale.push({ file, age, ...reviewed });
	}
	return stale.sort((a, b) => b.age - a.age);
}

/** First year of the current academic session (sessions start in September). */
export function currentSessionStart(now) {
	const date = new Date(now);
	return date.getUTCMonth() >= 8
		? date.getUTCFullYear()
		: date.getUTCFullYear() - 1;
}

/** Pages that mention academic sessions (e.g. 2023/2024) that have ended. */
export function findPastSessions(files, now, read) {
	const sessionStart = currentSessionStart(now);
	const pages = [];
	for (const file of files) {
		const sessions = new Set();
		for (const [session, start, end] of read(file).matchAll(
			/\b(20\d\d)\s?\/\s?(20\d\d)\b/g,
		)) {
			if (Number(end) === Number(start) + 1 && Number(start) < sessionStart) {
				sessions.add(session.replace(/\s/g, ''));
			}
		}
		if (sessions.size) pages.push({ file, sessions: [...sessions].sort() });
	}
	return pages;
}

/**
 * Groups a URL into the "site" it belongs to: the hostname, plus the first
 * path segment on hosts that serve many sites (centre.iium.edu.my/ccsc).
 * Returns null for non-IIUM URLs.
 */
export function siteKey(raw, multiSiteHosts = []) {
	let url;
	try {
		url = new URL(raw);
	} catch {
		return null;
	}
	const host = url.hostname.toLowerCase().replace(/^www\./, '');
	if (host !== 'iium.edu.my' && !host.endsWith('.iium.edu.my')) return null;
	if (!multiSiteHosts.includes(host)) return host;
	const segment = url.pathname.split('/').filter(Boolean)[0]?.toLowerCase();
	return segment ? `${host}/${segment}` : host;
}

/** Absolute links in an HTML page or sitemap. */
export function extractLinks(body, baseUrl) {
	const links = new Set();
	const patterns = [/href\s*=\s*["']([^"'#]+)/gi, /<loc>\s*([^<\s]+)/gi];
	for (const pattern of patterns) {
		for (const match of body.matchAll(pattern)) {
			try {
				links.add(new URL(match[1].trim(), baseUrl).href);
			} catch {
				// not a URL
			}
		}
	}
	return [...links];
}

export function knownSites(files, multiSiteHosts) {
	const known = new Set();
	for (const file of files) {
		for (const url of extractUrls(readFileSync(file, 'utf8'))) {
			const key = siteKey(url, multiSiteHosts);
			if (key) known.add(key);
		}
	}
	return known;
}

export async function discoverSites(config, known, fetchPage = fetchText) {
	const found = new Map();
	const failedSeeds = [];
	const ignore = new Set(config.ignore);
	for (const seed of config.seeds) {
		const body = await fetchPage(seed);
		if (body === null) {
			failedSeeds.push(seed);
			continue;
		}
		for (const link of extractLinks(body, seed)) {
			const key = siteKey(link, config.multiSiteHosts);
			if (!key || known.has(key) || ignore.has(key) || found.has(key)) continue;
			found.set(key, { key, link, seed });
		}
	}
	return {
		sites: [...found.values()].sort((a, b) => a.key.localeCompare(b.key)),
		failedSeeds,
	};
}

/**
 * Compares the files linked from IIUM's brand toolkit page with the ones
 * DESIGN.md was last checked against (discovery.json `brandToolkit.files`).
 */
export async function checkBrandToolkit(toolkit, fetchPage = fetchText) {
	if (!toolkit?.page) return { added: [], removed: [], failed: false };
	const body = await fetchPage(toolkit.page);
	if (body === null) {
		return { added: [], removed: [], failed: true, page: toolkit.page };
	}
	const linked = new Set(
		extractLinks(body, toolkit.page).filter((link) =>
			/\/wp-content\/uploads\/.+\.(pdf|zip|png|jpe?g|svg|ai|eps)$/i.test(link),
		),
	);
	const known = new Set(toolkit.files ?? []);
	return {
		added: [...linked].filter((link) => !known.has(link)).sort(),
		removed: [...known].filter((link) => !linked.has(link)).sort(),
		failed: false,
		page: toolkit.page,
	};
}

async function fetchText(url) {
	try {
		const response = await fetch(url, {
			redirect: 'follow',
			signal: AbortSignal.timeout(30000),
			headers: { 'user-agent': 'Mozilla/5.0 (Awesome-IIUM content report)' },
		});
		return response.ok ? await response.text() : null;
	} catch {
		return null;
	}
}

export function renderReport({
	stale,
	pastSessions = [],
	sites,
	failedSeeds,
	staleAfterDays,
	brand = { added: [], removed: [], failed: false },
}) {
	const repo = process.env.GITHUB_REPOSITORY ?? 'iiumstudent/Awesome-IIUM';
	const blob = `https://github.com/${repo}/blob/HEAD`;
	const pageLink = (file) =>
		`[${file.replace('src/content/docs/', '')}](${blob}/${file})`;
	const brandChanged = brand.added.length > 0 || brand.removed.length > 0;
	const nothingToDo =
		!stale.length && !pastSessions.length && !sites.length && !brandChanged;
	const lines = [
		nothingToDo
			? '<!-- content-report: nothing to do -->'
			: '<!-- content-report -->',
		'_This report is updated automatically every month. Work through what you can; anything you fix disappears from the next report._',
		'',
		`## 🕰️ Pages to review (${stale.length})`,
		'',
	];
	if (stale.length) {
		lines.push(
			`These pages haven't been reviewed in over ${staleAfterDays} days. Check the facts (names, links, dates) are still right, then set \`lastUpdated: YYYY-MM-DD\` in the page's frontmatter to today.`,
			'',
			'| Page | Last reviewed |',
			'| :--- | :--- |',
			...stale.map(
				({ file, date, source, age }) =>
					`| ${pageLink(file)} | ${date ? `${date.toISOString().slice(0, 10)} (${source}, ${age} days ago)` : 'never'} |`,
			),
		);
	} else {
		lines.push('Everything has been reviewed recently. 🎉');
	}
	if (pastSessions.length) {
		lines.push(
			'',
			`## 📆 Pages mentioning past semesters (${pastSessions.length})`,
			'',
			'These pages mention academic sessions that have ended. Replace dated details with a link to where the current information is published (see CONTENT_GUIDELINES.md, "Link, don\'t copy").',
			'',
			'| Page | Mentions |',
			'| :--- | :--- |',
			...pastSessions.map(
				({ file, sessions }) =>
					`| ${pageLink(file)} | ${sessions.join(', ')} |`,
			),
		);
	}
	lines.push('', `## 🔎 IIUM sites not in the guide yet (${sites.length})`, '');
	if (sites.length) {
		lines.push(
			'Official IIUM pages link to these sites, but the guide never mentions them. Add the useful ones to a page (or suggest them with the Resource Suggestion form), and add the rest to `ignore` in [`scripts/discovery.json`](' +
				`${blob}/scripts/discovery.json) so they stop showing up.`,
			'',
			'| Site | Example link | Found on |',
			'| :--- | :--- | :--- |',
			...sites.map(
				({ key, link, seed }) => `| \`${key}\` | <${link}> | <${seed}> |`,
			),
		);
	} else {
		lines.push('No new sites found.');
	}
	if (brandChanged) {
		lines.push(
			'',
			'## 🎨 IIUM brand toolkit changed',
			'',
			`IIUM changed the files on its [brand toolkit page](${brand.page}). The site's colours, fonts and logo rules follow that toolkit, so check whether [DESIGN.md](${blob}/DESIGN.md) still matches it (colour codes, fonts, rules about using the IIUM name and logo). Then record the current files in \`brandToolkit.files\` in [\`scripts/discovery.json\`](${blob}/scripts/discovery.json) so this section goes away.`,
			'',
			...brand.added.map((link) => `- 🆕 New: <${link}>`),
			...brand.removed.map(
				(link) => `- ❌ No longer linked (renamed or replaced?): <${link}>`,
			),
		);
	}
	if (brand.failed) {
		lines.push(
			'',
			`> ⚠️ Couldn't load the IIUM brand toolkit page <${brand.page}>. If this keeps happening, find its new address on the IIUM website and update \`brandToolkit.page\` in \`scripts/discovery.json\`.`,
		);
	}
	if (failedSeeds.length) {
		lines.push(
			'',
			`> ⚠️ Couldn't load ${failedSeeds.map((s) => `<${s}>`).join(', ')}. If this keeps happening, update \`seeds\` in \`scripts/discovery.json\`.`,
		);
	}
	return lines.join('\n');
}

async function main() {
	const config = loadConfig();
	const files = listContentFiles();
	const stale = findStalePages(
		files,
		Date.now(),
		config.staleAfterDays,
		(file) => reviewedDate(readFileSync(file, 'utf8'), file),
	);
	const pastSessions = findPastSessions(files, Date.now(), (file) =>
		readFileSync(file, 'utf8'),
	);
	const known = knownSites(files, config.multiSiteHosts);
	const { sites, failedSeeds } = await discoverSites(config, known);
	const brand = await checkBrandToolkit(config.brandToolkit);
	console.log(
		renderReport({
			stale,
			pastSessions,
			sites,
			failedSeeds,
			staleAfterDays: config.staleAfterDays,
			brand,
		}),
	);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
	await main();
}
