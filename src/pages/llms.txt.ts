/**
 * /llms.txt: a plain-text map of the site for AI assistants and AI search
 * (https://llmstxt.org). Lists every English page with its description, so
 * an assistant answering a question about IIUM can find the right page.
 */

import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { cleanTitle, LOCALES, pageUrl, SITE } from '../utils/seo';

const SECTIONS: [prefix: string, heading: string][] = [
	['categories/admissions', 'Admissions'],
	['categories/academics', 'Academics and kulliyyahs'],
	['categories/fees-and-financial-aid', 'Fees and financial aid'],
	['categories/campus-life', 'Campus life'],
	['categories/campuses', 'Campuses'],
	['categories/student-services', 'Student services'],
	['categories/international-students', 'International students'],
	['categories/postgraduate', 'Postgraduate'],
	['categories/career', 'Career'],
	['categories/', 'More guides'],
	['', 'Site'],
];

export const GET: APIRoute = async () => {
	const locales = Object.keys(LOCALES).filter((key) => key !== 'root');
	const pages = (await getCollection('docs'))
		.filter(
			({ id }) => !locales.some((l) => id === l || id.startsWith(`${l}/`)),
		)
		.map(({ id, data }) => ({
			id: id === 'index' ? '' : id,
			title: cleanTitle(data.title),
			description: data.description,
		}))
		.sort((a, b) => a.id.localeCompare(b.id));

	const lines = [
		`# ${SITE.name}`,
		'',
		`> ${SITE.description}`,
		'',
		'Awesome IIUM is an unofficial, student-run guide to the International Islamic University Malaysia (IIUM), also called UIA or UIAM (Universiti Islam Antarabangsa Malaysia). It links to official IIUM sources wherever possible; check those for anything that affects your studies. Content is CC0.',
		'',
	];
	const listed = new Set<string>();
	for (const [prefix, heading] of SECTIONS) {
		const section = pages.filter(
			(page) => !listed.has(page.id) && page.id.startsWith(prefix),
		);
		if (section.length === 0) continue;
		lines.push(`## ${heading}`, '');
		for (const page of section) {
			listed.add(page.id);
			const note = page.description ? `: ${page.description}` : '';
			lines.push(`- [${page.title}](${pageUrl(page.id)})${note}`);
		}
		lines.push('');
	}
	lines.push(
		'## Optional',
		'',
		`- [Source and contribution guide](${SITE.repo}): suggest a resource or fix a page`,
		'',
	);

	return new Response(lines.join('\n'), {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
