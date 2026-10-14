import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
	CATEGORY_FILES,
	cleanText,
	findDuplicates,
	formatEntry,
	insertEntry,
	isPublicHost,
	isReachable,
	normalizeUrl,
	parseIssueForm,
	SECTION_HEADING,
	targetFile,
	toSubmission,
	validate,
} from '../../scripts/submissions.mjs';

const issueBody = `### Resource Name

IIUM Course Planner

### Resource URL

https://planner.example.com/

### Category

Academics - KICT (ICT)

### Campus

Gombak

### Resource Type

Tool (utility/calculator)

### Description

Plan your timetable before pre-registration opens.

Key features:
- Clash detection

### Quality Checklist

- [X] The resource is currently accessible and working

### Additional Information

_No response_`;

describe('parseIssueForm', () => {
	it('reads each form field and treats "_No response_" as empty', () => {
		const fields = parseIssueForm(issueBody);
		expect(fields['Resource Name']).toBe('IIUM Course Planner');
		expect(fields.Category).toBe('Academics - KICT (ICT)');
		expect(fields['Additional Information']).toBe('');
	});
});

describe('targetFile', () => {
	it('maps every issue form category to a page that exists', () => {
		const categories = [
			...Object.keys(CATEGORY_FILES),
			...[
				'AIKOL',
				'KAED',
				'KAHS',
				'KENMS',
				'KICT',
				'KIRKHS',
				'KOD',
				'KOE',
				'KOED',
				'KOM',
				'KON',
				'KOP',
				'KOS',
				'KSTCL',
			].map((code) => `Academics - ${code} (Name)`),
		];
		for (const category of categories) {
			const file = targetFile(category);
			expect(file, category).toBeTruthy();
			expect(existsSync(file as string), file as string).toBe(true);
		}
	});

	it('places every option in the issue form on a page that exists', () => {
		const form = readFileSync(
			'.github/ISSUE_TEMPLATE/resource-request.yml',
			'utf8',
		);
		const options = form
			.split('id: category')[1]
			.split('validations:')[0]
			.match(/^ {8}- (.+)$/gm)
			?.map((line) => line.replace(/^ {8}- /, '').trim());
		expect(options?.length).toBeGreaterThan(20);
		for (const option of options ?? []) {
			const file = targetFile(option);
			expect(file, option).toBeTruthy();
			expect(existsSync(file as string), option).toBe(true);
		}
	});

	it('still places suggestions that use a former kulliyyah name', () => {
		expect(targetFile('Academics - KLM (Languages & Management)')).toBe(
			targetFile('Academics - KSTCL (Sustainable Tourism & Languages)'),
		);
	});

	it('sends retired academic options to the academics index', () => {
		expect(targetFile('Academics - Medical (KOM/KOD/KON/KOP/KAHS)')).toBe(
			'src/content/docs/categories/academics/index.md',
		);
		expect(targetFile('Something else')).toBeNull();
	});
});

describe('normalizeUrl', () => {
	it('ignores scheme, www, trailing slash, query and case', () => {
		expect(normalizeUrl('https://www.IIUM.edu.my/v2/?x=1')).toBe(
			normalizeUrl('http://iium.edu.my/v2'),
		);
	});
});

describe('formatEntry', () => {
	it('builds a list item from the first paragraph of the description', () => {
		const entry = formatEntry(toSubmission(parseIssueForm(issueBody)));
		expect(entry).toBe(
			'- [IIUM Course Planner](https://planner.example.com/) - Plan your timetable before pre-registration opens. _(Gombak)_',
		);
	});

	it('strips markup that could break Markdown or MDX', () => {
		expect(cleanText('Use <script>{x}</script> [here](http://a)')).toBe(
			'Use scriptx/script here',
		);
	});
});

describe('insertEntry', () => {
	const page = `---
title: Test
lastUpdated: 2025-01-30
---

## Links

- [A](https://a.example)
`;

	it('creates the submissions section and bumps lastUpdated', () => {
		const result = insertEntry(page, '- [B](https://b.example)', '2026-10-13');
		expect(result).toContain('lastUpdated: 2026-10-13');
		expect(
			result.endsWith(`${SECTION_HEADING}\n\n- [B](https://b.example)\n`),
		).toBe(true);
	});

	it('appends to an existing section before the next heading', () => {
		const once = insertEntry(page, '- [B](https://b.example)', '2026-10-13');
		const withNext = `${once}\n## Later\n\ntext\n`;
		const twice = insertEntry(
			withNext,
			'- [C](https://c.example)',
			'2026-10-14',
		);
		expect(twice).toContain(
			`${SECTION_HEADING}\n\n- [B](https://b.example)\n- [C](https://c.example)\n\n## Later`,
		);
	});
});

describe('validate', () => {
	it('flags links that are already on the site', () => {
		const files = ['src/content/docs/categories/official-sources.md'];
		expect(findDuplicates('https://imaluum.iium.edu.my', files)).toEqual(files);
		const { problems } = validate(
			{
				name: 'i-Maluum',
				url: 'https://imaluum.iium.edu.my/',
				category: 'Campus Life',
				campus: '',
				description: '',
			},
			files,
		);
		expect(problems.join()).toContain('already listed');
	});

	it('rejects non-http links', () => {
		const { problems } = validate(
			{
				name: 'x',
				url: 'javascript:alert(1)',
				category: 'Campus Life',
				campus: '',
				description: 'y',
			},
			[],
		);
		expect(problems.join()).toContain('http');
	});
});

describe('issue form', () => {
	it('only offers categories that map to a page', async () => {
		const { readFileSync } = await import('node:fs');
		const form = readFileSync(
			'.github/ISSUE_TEMPLATE/resource-request.yml',
			'utf8',
		);
		const block = form.split('id: category')[1].split('validations:')[0];
		const options = [...block.matchAll(/^\s+- (.+)$/gm)].map((m) => m[1]);
		expect(options.length).toBeGreaterThan(10);
		for (const option of options) {
			expect(targetFile(option), option).toBeTruthy();
		}
	});
});

describe('public hosts only', () => {
	it('rejects addresses on the runner network', async () => {
		for (const url of [
			'http://localhost:4321/',
			'http://127.0.0.1/',
			'http://2130706433/', // 127.0.0.1 in decimal
			'http://169.254.169.254/latest/meta-data/',
			'http://10.1.2.3/',
			'http://172.20.0.1/',
			'http://192.168.0.1/',
			'http://[::1]/',
			'http://intranet/',
			'http://printer.local/',
		]) {
			expect(isPublicHost(new URL(url).hostname), url).toBe(false);
			expect(await isReachable(url), url).toBe(false);
		}
	});

	it('accepts ordinary websites', () => {
		for (const host of ['iium.edu.my', 'github.com', '8.8.8.8', '172.32.0.1']) {
			expect(isPublicHost(host), host).toBe(true);
		}
	});
});
