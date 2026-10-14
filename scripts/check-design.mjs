#!/usr/bin/env node
/**
 * Checks the code follows the design rules in DESIGN.md, so the site keeps one
 * look whoever (or whatever) edits it. Runs as part of `pnpm lint` and CI.
 *
 * - Colours are only defined in the theme (src/styles/custom.css). Everything
 *   else uses its tokens, e.g. var(--sl-color-accent), never #00918e.
 * - Fonts come from tokens too: font-family uses var(--...) or inherit.
 *
 * A line that really needs an exception can say so with a `design-ok` comment
 * explaining why.
 *
 *   node scripts/check-design.mjs
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

export const THEME_FILE = 'src/styles/custom.css';
const ROOTS = ['src', 'public'];
const EXTENSIONS = /\.(astro|css|js|mjs|ts|md|mdx)$/;

const NAMED_COLOURS =
	'white|black|red|green|blue|gray|grey|orange|yellow|purple|pink|brown|silver|gold';

const RULES = [
	{
		pattern: /(?<![&\w])#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})(?![\w-])/gi,
		message: (match) =>
			`colour ${match} is not a theme token; use a var(--...) from ${THEME_FILE} (see DESIGN.md)`,
	},
	{
		pattern: /\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch)\(\s*\d/gi,
		message: (match) =>
			`colour ${match.replace(/\s+/g, '')}...) is not a theme token; use a var(--...) from ${THEME_FILE} (see DESIGN.md)`,
	},
	{
		pattern: new RegExp(
			`\\b(?:color|background(?:-color)?|border(?:-[a-z]+)?(?:-color)?|outline(?:-color)?|fill|stroke)\\s*:[^;{}\\n]*?(?<![\\w-])(${NAMED_COLOURS})(?![\\w-])`,
			'gi',
		),
		message: (_match, name) =>
			`named colour "${name}" is not a theme token; use a var(--...) from ${THEME_FILE} (see DESIGN.md)`,
	},
	{
		pattern: /\bfont-family\s*:(?!\s*(?:var\(|inherit\b))[^;}\n]+/gi,
		message: () =>
			'font-family must use a font token, e.g. var(--aw-font-heading) or var(--__sl-font-mono) (see DESIGN.md)',
	},
];

/** Design rule violations in one file's text, as { line, message }. */
export function findDesignIssues(text) {
	const issues = [];
	text.split('\n').forEach((line, index) => {
		if (line.includes('design-ok')) return;
		for (const { pattern, message } of RULES) {
			for (const match of line.matchAll(pattern)) {
				issues.push({ line: index + 1, message: message(...match) });
			}
		}
	});
	return issues;
}

export function listDesignFiles(roots = ROOTS) {
	const files = [];
	const walk = (dir) => {
		for (const entry of readdirSync(dir)) {
			const path = join(dir, entry);
			if (statSync(path).isDirectory()) {
				if (path !== join('public', 'api')) walk(path);
			} else if (EXTENSIONS.test(entry) && path !== THEME_FILE) {
				files.push(path);
			}
		}
	};
	for (const root of roots) walk(root);
	return files.sort();
}

function main() {
	let count = 0;
	for (const file of listDesignFiles()) {
		for (const { line, message } of findDesignIssues(
			readFileSync(file, 'utf8'),
		)) {
			count++;
			console.log(
				process.env.GITHUB_ACTIONS
					? `::error file=${file},line=${line}::${message}`
					: `${file}:${line}  ${message}`,
			);
		}
	}
	if (count) {
		console.log(`\n${count} design issue(s). See DESIGN.md.`);
		process.exit(1);
	}
	console.log('Design check passed.');
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
	main();
}
