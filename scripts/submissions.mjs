#!/usr/bin/env node
/**
 * Turns "Resource Suggestion" issues into site content.
 *
 *   node scripts/submissions.mjs check   # validate the issue, print a comment
 *   node scripts/submissions.mjs apply   # add the resource to the right page
 *
 * Both read the issue from $GITHUB_EVENT_PATH (or a JSON file given as the
 * next argument). Used by .github/workflows/submissions.yml.
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

export const DOCS_DIR = 'src/content/docs';

const ACADEMICS = `${DOCS_DIR}/categories/academics`;
const CAMPUS_LIFE = `${DOCS_DIR}/categories/campus-life`;

/** Issue form "Category" option -> page the resource is added to. */
export const CATEGORY_FILES = {
	'Academics - General': `${ACADEMICS}/General.mdx`,
	'Campus Life': `${CAMPUS_LIFE}/index.md`,
	'Campus Life - Clubs & Societies': `${CAMPUS_LIFE}/Club.md`,
	'Campus Life - Mahallah (Residential)': `${CAMPUS_LIFE}/Mahallah.md`,
	'Campus Life - Apps & Software': `${CAMPUS_LIFE}/Software.md`,
	'Career & Internships': `${DOCS_DIR}/categories/career/index.md`,
	Developers: `${DOCS_DIR}/categories/developers/index.md`,
};

const KULLIYYAHS = [
	'AIKOL',
	'KAED',
	'KAHS',
	'KENMS',
	'KICT',
	'KIRKHS',
	'KLM',
	'KOD',
	'KOE',
	'KOED',
	'KOM',
	'KON',
	'KOP',
	'KOS',
];

export const SECTION_HEADING = '## 📥 Community Submissions';

/** Parses a GitHub issue form body ("### Label\n\nvalue") into an object. */
export function parseIssueForm(body) {
	const fields = {};
	const parts = (body ?? '').replace(/\r\n/g, '\n').split(/^### /m);
	for (const part of parts.slice(1)) {
		const newline = part.indexOf('\n');
		const label = (newline === -1 ? part : part.slice(0, newline)).trim();
		const value = newline === -1 ? '' : part.slice(newline + 1).trim();
		fields[label] = value === '_No response_' ? '' : value;
	}
	return fields;
}

export function toSubmission(fields) {
	return {
		name: fields['Resource Name'] ?? '',
		url: fields['Resource URL'] ?? '',
		category: fields.Category ?? '',
		campus: fields.Campus ?? '',
		description: fields.Description ?? '',
	};
}

/** Page for a category option, or null if it can't be placed automatically. */
export function targetFile(category) {
	if (CATEGORY_FILES[category]) return CATEGORY_FILES[category];
	const code = category.match(/^Academics - ([A-Z]+)\b/)?.[1];
	if (code && KULLIYYAHS.includes(code)) return `${ACADEMICS}/${code}/index.md`;
	if (category.startsWith('Academics')) return `${ACADEMICS}/index.md`;
	return null;
}

/**
 * False for hosts no public resource lives on: localhost, single-label and
 * internal names, IP literals in private, loopback and link-local ranges,
 * and IPv6 literals. Keeps the link check from probing the runner's network.
 */
export function isPublicHost(hostname) {
	const host = hostname.toLowerCase();
	if (!host.includes('.') || host.startsWith('[')) return false;
	if (/(^|\.)(localhost|local|internal|lan|home)$/.test(host)) return false;
	const ip = host.match(/^(\d+)\.(\d+)\.\d+\.\d+$/);
	if (!ip) return true;
	const [a, b] = [Number(ip[1]), Number(ip[2])];
	return !(
		a === 0 ||
		a === 10 ||
		a === 127 ||
		a >= 224 ||
		(a === 100 && b >= 64 && b <= 127) ||
		(a === 169 && b === 254) ||
		(a === 172 && b >= 16 && b <= 31) ||
		(a === 192 && b === 168)
	);
}

/** The URL if it's an http(s) link to a public host, else null. */
export function parseUrl(raw) {
	try {
		const url = new URL(raw.trim());
		const web = url.protocol === 'https:' || url.protocol === 'http:';
		return web && isPublicHost(url.hostname) ? url : null;
	} catch {
		return null;
	}
}

/** Comparable form of a URL: no scheme, www., query, hash or trailing slash. */
export function normalizeUrl(raw) {
	const url = parseUrl(raw);
	if (!url) return raw.trim().toLowerCase();
	const host = url.hostname.toLowerCase().replace(/^www\./, '');
	const path = decodeURI(url.pathname).replace(/\/+$/, '').toLowerCase();
	return `${host}${path}`;
}

export function listContentFiles(dir = DOCS_DIR) {
	const files = [];
	for (const entry of readdirSync(dir)) {
		const path = join(dir, entry);
		if (statSync(path).isDirectory()) files.push(...listContentFiles(path));
		else if (/\.mdx?$/.test(entry)) files.push(path);
	}
	return files;
}

export function extractUrls(text) {
	return text.match(/https?:\/\/[^\s)\]>"'`|]+/g) ?? [];
}

/** Content files that already link to the same place as `url`. */
export function findDuplicates(url, files = listContentFiles()) {
	const wanted = normalizeUrl(url);
	return files.filter((file) =>
		extractUrls(readFileSync(file, 'utf8')).some(
			(found) => normalizeUrl(found) === wanted,
		),
	);
}

/** Single line of plain text, safe in both Markdown and MDX. */
export function cleanText(text, maxLength = 200) {
	let clean = text
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // markdown links -> text
		.replace(/[<>{}[\]`*_|#\\]/g, '') // markup that could break the page
		.replace(/\s+/g, ' ')
		.trim();
	if (clean.length > maxLength) {
		clean = `${clean.slice(0, maxLength - 1).replace(/\s+\S*$/, '')}…`;
	}
	return clean;
}

/** First paragraph of the description, without bullet lists or headings. */
export function summarize(description) {
	const paragraph =
		description
			.split(/\n\s*\n/)
			.map((p) => p.trim())
			.find((p) => p && !/^([-*#]|\d+\.)\s/.test(p)) ?? '';
	const sentence = cleanText(paragraph);
	return sentence && !/[.!?…]$/.test(sentence) ? `${sentence}.` : sentence;
}

export function formatEntry({ name, url, campus, description }) {
	const where =
		campus && campus !== 'All campuses' ? ` _(${cleanText(campus, 20)})_` : '';
	const summary = summarize(description);
	return `- [${cleanText(name, 80)}](${parseUrl(url).href})${summary ? ` - ${summary}` : ''}${where}`;
}

/**
 * Adds `entry` to the page's Community Submissions section (creating it at
 * the end of the page if needed) and bumps `lastUpdated` in the frontmatter.
 */
export function insertEntry(content, entry, today) {
	let text = content.replace(/\s*$/, '\n');
	const lines = text.split('\n');
	const start = lines.findIndex((line) => line.trim() === SECTION_HEADING);
	if (start === -1) {
		text = `${text}\n${SECTION_HEADING}\n\n${entry}\n`;
	} else {
		let end = lines.findIndex((line, i) => i > start && /^#{1,2} /.test(line));
		if (end === -1) end = lines.length;
		while (end > start + 1 && lines[end - 1].trim() === '') end--;
		lines.splice(end, 0, ...(end === start + 1 ? ['', entry] : [entry]));
		text = lines.join('\n');
	}
	return text.replace(
		/^(---\n(?:(?!---\n)[\s\S])*?\nlastUpdated:[ \t]*)\S+/,
		(_match, prefix) => `${prefix}${today}`,
	);
}

export function validate(submission, files) {
	const problems = [];
	const warnings = [];
	if (!cleanText(submission.name)) problems.push('The resource name is empty.');
	if (!parseUrl(submission.url)) {
		problems.push(
			'The URL must be a full `http://` or `https://` link to a public website (e.g. `https://example.com`).',
		);
	}
	const file = targetFile(submission.category);
	if (!file) {
		problems.push(
			`The category "${cleanText(submission.category, 60)}" can't be placed automatically; a maintainer will add it by hand.`,
		);
	}
	if (parseUrl(submission.url)) {
		const duplicates = findDuplicates(submission.url, files);
		if (duplicates.length) {
			problems.push(
				`This link is already listed in ${duplicates.map((f) => `\`${f}\``).join(', ')}.`,
			);
		}
	}
	if (!summarize(submission.description)) {
		warnings.push('There is no description, so only the name will be shown.');
	}
	return { file, problems, warnings };
}

/**
 * Any HTTP response below 500 counts as up, matching the status check.
 * Redirects aren't followed, so a public URL can't bounce the check to a
 * private address; a redirect response already shows the site is up.
 */
export async function isReachable(raw, timeoutMs = 15000) {
	const url = parseUrl(raw);
	if (!url) return false;
	for (const method of ['HEAD', 'GET']) {
		try {
			const response = await fetch(url, {
				method,
				redirect: 'manual',
				signal: AbortSignal.timeout(timeoutMs),
				headers: { 'user-agent': 'Mozilla/5.0 (Awesome-IIUM link check)' },
			});
			if (response.status < 500) return true;
		} catch {
			// try the next method
		}
	}
	return false;
}

function readIssue(eventPath) {
	const event = JSON.parse(readFileSync(eventPath, 'utf8'));
	return event.issue ?? event;
}

async function main() {
	const [command, eventPath = process.env.GITHUB_EVENT_PATH] =
		process.argv.slice(2);
	if (!eventPath || !['check', 'apply'].includes(command)) {
		console.error('Usage: submissions.mjs <check|apply> [event.json]');
		process.exit(2);
	}
	const submission = toSubmission(parseIssueForm(readIssue(eventPath).body));
	const files = listContentFiles();
	const { file, problems, warnings } = validate(submission, files);

	if (command === 'check') {
		if (parseUrl(submission.url) && !(await isReachable(submission.url))) {
			warnings.push(
				'The link did not respond from GitHub. Please make sure it works.',
			);
		}
		const lines = ['<!-- submission-check -->'];
		if (problems.length) {
			lines.push(
				'### ⚠️ This suggestion needs changes',
				'',
				...problems.map((p) => `- ${p}`),
				'',
				'Edit the issue to fix this and it will be checked again.',
			);
		} else {
			lines.push(
				'### ✅ Ready to add',
				'',
				`It will be added to \`${file}\` as:`,
				'',
				'```markdown',
				formatEntry(submission),
				'```',
				'',
				'A maintainer can publish it by adding the **`approved`** label. The site updates automatically.',
			);
		}
		if (warnings.length) lines.push('', ...warnings.map((w) => `> ${w}`));
		console.log(lines.join('\n'));
		const output = process.env.GITHUB_OUTPUT;
		if (output) {
			writeFileSync(output, `ok=${problems.length === 0}\n`, { flag: 'a' });
		}
		return;
	}

	if (problems.length) {
		console.error(problems.join('\n'));
		process.exit(1);
	}
	const today = new Date().toISOString().slice(0, 10);
	writeFileSync(
		file,
		insertEntry(readFileSync(file, 'utf8'), formatEntry(submission), today),
	);
	console.log(file);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
	await main();
}
