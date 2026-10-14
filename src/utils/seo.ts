/**
 * Search engine and link preview helpers.
 *
 * Used by astro.config.mjs (sitemap, site-wide structured data) and by
 * src/routeMiddleware.ts (per-page tags). Kept free of Astro imports so the
 * config and the unit tests can load it.
 */

export const SITE = {
	name: 'Awesome IIUM',
	url: 'https://iiumstudent.github.io/Awesome-IIUM/',
	base: '/Awesome-IIUM',
	description:
		"A student-made guide to the International Islamic University Malaysia (IIUM, UIAM): i-Ma'luum, course registration, kulliyyahs, mahallahs, fees and campus life in Gombak, Kuantan and Pagoh.",
	image: 'https://iiumstudent.github.io/Awesome-IIUM/og.png',
	imageAlt: 'Awesome IIUM: resources, tools and guides for the IIUM community',
	repo: 'https://github.com/iiumstudent/Awesome-IIUM',
} as const;

/** Site locales. `root` is English, served without a path prefix. */
export const LOCALES = {
	root: { label: 'English', lang: 'en' },
	ar: { label: 'العربية', lang: 'ar', dir: 'rtl' },
	ja: { label: '日本語', lang: 'ja' },
	ms: { label: 'Bahasa Melayu', lang: 'ms' },
	zh: { label: '中文', lang: 'zh-CN' },
} as const;

export type LocaleKey = keyof typeof LOCALES;

/** Open Graph wants `language_TERRITORY`, not a BCP 47 tag. */
const OG_LOCALES: Record<string, string> = {
	en: 'en_US',
	ar: 'ar_AR',
	ja: 'ja_JP',
	ms: 'ms_MY',
	'zh-CN': 'zh_CN',
};

export function ogLocale(lang: string): string {
	return OG_LOCALES[lang] ?? lang.replace('-', '_');
}

/** The university the guide is about, for structured data. */
export const IIUM = {
	'@type': 'CollegeOrUniversity',
	name: 'International Islamic University Malaysia',
	alternateName: [
		'IIUM',
		'UIA',
		'UIAM',
		'Universiti Islam Antarabangsa Malaysia',
	],
	url: 'https://www.iium.edu.my/',
	sameAs: [
		'https://en.wikipedia.org/wiki/International_Islamic_University_Malaysia',
	],
} as const;

/** Site-wide structured data: who publishes the site and what it is about. */
export function websiteJsonLd() {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		'@id': `${SITE.url}#website`,
		name: SITE.name,
		alternateName: [
			'Awesome-IIUM',
			'IIUM student guide',
			'UIA student guide',
			'Panduan pelajar UIAM',
		],
		url: SITE.url,
		description: SITE.description,
		inLanguage: Object.values(LOCALES).map(({ lang }) => lang),
		about: IIUM,
		audience: {
			'@type': 'EducationalAudience',
			educationalRole: 'student',
		},
		keywords:
			"IIUM, UIA, UIAM, International Islamic University Malaysia, Universiti Islam Antarabangsa Malaysia, i-Ma'luum, i-Ta'leem, kulliyyah, mahallah, Gombak, Kuantan, Pagoh",
		license: 'https://creativecommons.org/publicdomain/zero/1.0/',
		publisher: {
			'@type': 'Organization',
			name: 'IIUMstudent',
			url: 'https://github.com/iiumstudent',
			logo: `${SITE.url}logo.png`,
		},
	};
}

/**
 * Remove the decorative emoji many page titles start with, so search results
 * and link previews read "Kulliyyah of Medicine (KOM)", not "🏥 Kulliyyah...".
 */
export function cleanTitle(title: string): string {
	return title.replace(/^(?:\p{Extended_Pictographic}|\uFE0F|\u200D|\s)+/u, '');
}

/**
 * Turn a content file path into the slug Astro gives it, e.g.
 * `categories/campus-life/Social Media/FacebookGroups.md` →
 * `categories/campus-life/social-media/facebookgroups`.
 * Mirrors github-slugger, which Astro uses, for the characters our file
 * names contain.
 */
export function slugFromFilePath(path: string): string {
	const slug = path
		.replace(/\.mdx?$/, '')
		.split('/')
		.map((segment) =>
			segment
				.toLowerCase()
				.trim()
				.replace(/[^\p{L}\p{N}\s_-]/gu, '')
				.replace(/\s/g, '-'),
		)
		.join('/');
	return slug === 'index' ? '' : slug.replace(/\/index$/, '');
}

/** Slug of a page within its locale, e.g. `ms/tools` → `tools`, `ms` → ``. */
export function stripLocale(id: string, locale: string | undefined): string {
	if (!locale) return id;
	if (id === locale) return '';
	return id.startsWith(`${locale}/`) ? id.slice(locale.length + 1) : id;
}

/** Content id of a page in a locale, e.g. (`tools`, `ms`) → `ms/tools`. */
export function localizedId(slug: string, locale: string): string {
	if (locale === 'root') return slug;
	return slug ? `${locale}/${slug}` : locale;
}

/** Absolute URL of a content id. */
export function pageUrl(id: string): string {
	return id ? `${SITE.url}${id}/` : SITE.url;
}

/**
 * Starlight renders a copy of every English page under each locale that has
 * no translation of it. Those copies are English text at a translated URL, so
 * they stay out of the sitemap and point their canonical at the English page.
 *
 * Returns whether a sitemap URL is the English original or a real translation.
 */
export function isIndexableUrl(
	url: string,
	translatedIds: Set<string>,
): boolean {
	const path = new URL(url).pathname
		.replace(new RegExp(`^${SITE.base}/?`), '')
		.replace(/\/$/, '');
	const [first = ''] = path.split('/');
	if (!(first in LOCALES) || first === 'root') return true;
	return translatedIds.has(path);
}

export interface Crumb {
	name: string;
	url: string;
}

/**
 * Breadcrumbs for a page from the pages above it that exist, e.g.
 * `categories/academics/kict` → Home › Academics › KICT. Path segments
 * without a page of their own (like `categories`) are skipped.
 */
export function breadcrumbs(
	slug: string,
	locale: string,
	titles: Map<string, string>,
): Crumb[] {
	const crumbs: Crumb[] = [
		{ name: SITE.name, url: pageUrl(localizedId('', locale)) },
	];
	const segments = slug.split('/').filter(Boolean);
	for (let i = 1; i <= segments.length; i++) {
		const id = localizedId(segments.slice(0, i).join('/'), locale);
		const name = titles.get(id);
		if (name) crumbs.push({ name, url: pageUrl(id) });
	}
	return crumbs;
}
