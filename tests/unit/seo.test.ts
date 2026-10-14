/**
 * Unit tests for search engine helpers (src/utils/seo.ts)
 */

import { describe, expect, it } from 'vitest';
import {
	breadcrumbs,
	cleanTitle,
	isIndexableUrl,
	localizedId,
	ogLocale,
	pageUrl,
	slugFromFilePath,
	stripLocale,
	websiteJsonLd,
} from '../../src/utils/seo';

describe('cleanTitle', () => {
	it('drops leading emoji, including variation selectors', () => {
		expect(cleanTitle('🏥 Kulliyyah of Medicine (KOM)')).toBe(
			'Kulliyyah of Medicine (KOM)',
		);
		expect(cleanTitle('⚖️ Ahmad Ibrahim Kulliyyah of Laws (AIKOL)')).toBe(
			'Ahmad Ibrahim Kulliyyah of Laws (AIKOL)',
		);
	});

	it('leaves titles without emoji, and leading digits, alone', () => {
		expect(cleanTitle('Admissions')).toBe('Admissions');
		expect(cleanTitle('2026 Academic Calendar')).toBe('2026 Academic Calendar');
	});
});

describe('slugFromFilePath', () => {
	it('matches the slugs Astro gives content files', () => {
		expect(slugFromFilePath('ms/index.md')).toBe('ms');
		expect(slugFromFilePath('index.mdx')).toBe('');
		expect(
			slugFromFilePath('categories/campus-life/Social Media/FacebookGroups.md'),
		).toBe('categories/campus-life/social-media/facebookgroups');
		expect(
			slugFromFilePath('categories/academics/Pre-reg gombak-kuantan.md'),
		).toBe('categories/academics/pre-reg-gombak-kuantan');
	});
});

describe('locale ids', () => {
	it('strips and adds locale prefixes', () => {
		expect(stripLocale('ms', 'ms')).toBe('');
		expect(stripLocale('ms/tools', 'ms')).toBe('tools');
		expect(stripLocale('tools', undefined)).toBe('tools');
		expect(localizedId('', 'ms')).toBe('ms');
		expect(localizedId('tools', 'ms')).toBe('ms/tools');
		expect(localizedId('tools', 'root')).toBe('tools');
	});

	it('builds absolute page URLs', () => {
		expect(pageUrl('')).toBe('https://iiumstudent.github.io/Awesome-IIUM/');
		expect(pageUrl('ms/tools')).toBe(
			'https://iiumstudent.github.io/Awesome-IIUM/ms/tools/',
		);
	});

	it('maps languages to Open Graph locales', () => {
		expect(ogLocale('ms')).toBe('ms_MY');
		expect(ogLocale('zh-CN')).toBe('zh_CN');
		expect(ogLocale('xx-YY')).toBe('xx_YY');
	});
});

describe('isIndexableUrl', () => {
	const translated = new Set(['ms', 'ar']);
	const url = (path: string) =>
		`https://iiumstudent.github.io/Awesome-IIUM/${path}`;

	it('keeps English pages and real translations', () => {
		expect(isIndexableUrl(url(''), translated)).toBe(true);
		expect(isIndexableUrl(url('categories/admissions/'), translated)).toBe(
			true,
		);
		expect(isIndexableUrl(url('ms/'), translated)).toBe(true);
	});

	it('drops English copies served under a locale', () => {
		expect(isIndexableUrl(url('ms/categories/admissions/'), translated)).toBe(
			false,
		);
		expect(isIndexableUrl(url('ja/'), translated)).toBe(false);
	});
});

describe('breadcrumbs', () => {
	const titles = new Map([
		['', 'Awesome IIUM'],
		['categories/academics', 'Academics'],
		['categories/academics/kict', 'Kulliyyah of ICT (KICT)'],
	]);

	it('lists the pages above, skipping folders without a page', () => {
		expect(breadcrumbs('categories/academics/kict', 'root', titles)).toEqual([
			{ name: 'Awesome IIUM', url: pageUrl('') },
			{ name: 'Academics', url: pageUrl('categories/academics') },
			{
				name: 'Kulliyyah of ICT (KICT)',
				url: pageUrl('categories/academics/kict'),
			},
		]);
	});
});

describe('websiteJsonLd', () => {
	it('says the site is about IIUM under all its names', () => {
		const data = websiteJsonLd();
		expect(data['@type']).toBe('WebSite');
		expect(data.about.name).toBe('International Islamic University Malaysia');
		expect(data.about.alternateName).toEqual(
			expect.arrayContaining(['IIUM', 'UIA', 'UIAM']),
		);
	});
});
