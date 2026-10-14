/**
 * Per-page search engine and link preview tags.
 *
 * Starlight already writes the description, Open Graph title and canonical
 * URL from each page's frontmatter. This adds what it leaves out:
 * - titles without the decorative leading emoji;
 * - English pages Starlight copies into untranslated locales point their
 *   canonical at the English original, so they don't compete with it;
 * - hreflang links only for translations that exist;
 * - Open Graph locales in the form Facebook and LinkedIn expect;
 * - WebPage and BreadcrumbList structured data;
 * - noindex on the 404 page.
 *
 * Helpers and site-wide values live in src/utils/seo.ts.
 */

import { getCollection } from 'astro:content';
import type { StarlightRouteData } from '@astrojs/starlight/route-data';
import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import {
	breadcrumbs,
	cleanTitle,
	IIUM,
	LOCALES,
	localizedId,
	ogLocale,
	pageUrl,
	SITE,
	stripLocale,
} from './utils/seo';

type Head = StarlightRouteData['head'];

let titlesById: Promise<Map<string, string>> | undefined;

/** Clean title of every page, keyed by content id (`''` is the home page). */
function getTitles() {
	titlesById ??= getCollection('docs').then(
		(entries) =>
			new Map(
				entries.map(({ id, data }) => [
					id === 'index' ? '' : id,
					cleanTitle(data.title),
				]),
			),
	);
	return titlesById;
}

/** Set a `<meta>` tag, replacing one with the same name or property. */
function setMeta(
	head: Head,
	key: 'name' | 'property',
	value: string,
	content: string,
) {
	const existing = head.find(
		({ tag, attrs }) => tag === 'meta' && attrs?.[key] === value,
	);
	if (existing) {
		existing.attrs = { ...existing.attrs, content };
	} else {
		head.push({ tag: 'meta', attrs: { [key]: value, content }, content: '' });
	}
}

function setCanonical(head: Head, href: string) {
	const link = head.find(
		({ tag, attrs }) => tag === 'link' && attrs?.rel === 'canonical',
	);
	if (link) link.attrs = { ...link.attrs, href };
	setMeta(head, 'property', 'og:url', href);
}

export const onRequest = defineRouteMiddleware(async (context) => {
	const route = context.locals.starlightRoute;
	const { head, entry } = route;
	const locale = route.locale ?? 'root';

	const titles = await getTitles();
	// Route and entry ids are normalised: the home page is `''`.
	const slug = route.isFallback
		? entry.id
		: stripLocale(route.id, route.locale);
	const title = cleanTitle(entry.data.title);

	// Pages can set their own <title> in frontmatter `head`; keep it if so.
	const ownTitle = entry.data.head.some(({ tag }) => tag === 'title');
	if (!ownTitle) {
		const titleTag = head.find(({ tag }) => tag === 'title');
		if (titleTag) titleTag.content = `${title} | ${route.siteTitle}`;
	}
	setMeta(head, 'property', 'og:title', title);

	// Translations that exist for this page, including itself.
	const translations = Object.entries(LOCALES).filter(([key]) =>
		titles.has(localizedId(slug, key)),
	);

	for (let i = head.length - 1; i >= 0; i--) {
		const { tag, attrs } = head[i];
		if (tag === 'link' && attrs?.rel === 'alternate' && attrs.hreflang) {
			head.splice(i, 1);
		}
	}

	if (route.id === '404') {
		setMeta(head, 'name', 'robots', 'noindex');
		return;
	}

	if (route.isFallback) {
		// English text at a translated URL: credit the English page.
		setCanonical(head, pageUrl(slug));
		setMeta(head, 'property', 'og:locale', ogLocale(LOCALES.root.lang));
		return;
	}

	if (translations.length > 1) {
		for (const [key, { lang }] of translations) {
			head.push({
				tag: 'link',
				attrs: {
					rel: 'alternate',
					hreflang: lang,
					href: pageUrl(localizedId(slug, key)),
				},
				content: '',
			});
		}
		head.push({
			tag: 'link',
			attrs: { rel: 'alternate', hreflang: 'x-default', href: pageUrl(slug) },
			content: '',
		});
	}

	setMeta(head, 'property', 'og:locale', ogLocale(route.lang));
	if (!slug) setMeta(head, 'property', 'og:type', 'website');
	for (const [key, { lang }] of translations) {
		if (key === locale) continue;
		head.push({
			tag: 'meta',
			attrs: { property: 'og:locale:alternate', content: ogLocale(lang) },
			content: '',
		});
	}

	const url = pageUrl(route.id);
	const graph: Record<string, unknown>[] = [
		{
			'@type': 'WebPage',
			'@id': url,
			url,
			name: title,
			description: entry.data.description ?? SITE.description,
			inLanguage: route.lang,
			isPartOf: { '@id': `${SITE.url}#website` },
			about: IIUM,
			...(entry.data.lastUpdated instanceof Date && {
				dateModified: entry.data.lastUpdated.toISOString().slice(0, 10),
			}),
		},
	];
	if (slug) {
		graph.push({
			'@type': 'BreadcrumbList',
			itemListElement: breadcrumbs(slug, locale, titles).map((crumb, i) => ({
				'@type': 'ListItem',
				position: i + 1,
				name: crumb.name,
				item: crumb.url,
			})),
		});
	}
	head.push({
		tag: 'script',
		attrs: { type: 'application/ld+json' },
		content: JSON.stringify({
			'@context': 'https://schema.org',
			'@graph': graph,
		}),
	});
});
