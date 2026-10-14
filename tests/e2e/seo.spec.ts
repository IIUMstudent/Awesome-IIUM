/**
 * E2E Tests for search engine and link preview tags
 *
 * Checks the built pages carry their own title, description and canonical URL
 * (src/routeMiddleware.ts), and that untranslated copies credit the English page.
 */

import { expect, test } from '@playwright/test';

const SITE = 'https://iiumstudent.github.io/Awesome-IIUM/';

test.describe('SEO tags', () => {
	test('home page has its own title and structured data about IIUM', async ({
		page,
	}) => {
		await page.goto('/Awesome-IIUM/');
		await expect(page).toHaveTitle(/IIUM \(UIA Malaysia\)/);
		await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
			'href',
			SITE,
		);
		await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
			'content',
			'website',
		);
		const jsonLd = await page
			.locator('script[type="application/ld+json"]')
			.allTextContents();
		expect(jsonLd.join()).toContain(
			'International Islamic University Malaysia',
		);
	});

	test('each page describes itself, without the leading emoji', async ({
		page,
	}) => {
		await page.goto('/Awesome-IIUM/categories/academics/kom/');
		await expect(page).toHaveTitle(
			'Kulliyyah of Medicine (KOM) | Awesome IIUM',
		);
		const description = page.locator('meta[name="description"]');
		await expect(description).toHaveAttribute(
			'content',
			/Kulliyyah of Medicine/,
		);
		await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
			'content',
			`${SITE}categories/academics/kom/`,
		);
		const breadcrumbs = await page
			.locator('script[type="application/ld+json"]')
			.allTextContents();
		expect(breadcrumbs.join()).toContain('BreadcrumbList');
	});

	test('untranslated copies point search engines at the English page', async ({
		page,
	}) => {
		await page.goto('/Awesome-IIUM/ms/categories/admissions/');
		await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
			'href',
			`${SITE}categories/admissions/`,
		);
		await expect(page.locator('link[hreflang]')).toHaveCount(0);
	});

	test('translated home pages link to each other', async ({ page }) => {
		await page.goto('/Awesome-IIUM/ms/');
		await expect(page.locator('link[hreflang="ms"]')).toHaveAttribute(
			'href',
			`${SITE}ms/`,
		);
		await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute(
			'href',
			SITE,
		);
	});

	test('sitemap lists only English pages and real translations', async ({
		request,
	}) => {
		const sitemap = await (
			await request.get('/Awesome-IIUM/sitemap-0.xml')
		).text();
		expect(sitemap).toContain(`<loc>${SITE}categories/admissions/</loc>`);
		expect(sitemap).toContain(`<loc>${SITE}ms/</loc>`);
		expect(sitemap).not.toContain(`<loc>${SITE}ms/categories/`);
	});

	test('llms.txt lists the guide for AI assistants', async ({ request }) => {
		const response = await request.get('/Awesome-IIUM/llms.txt');
		expect(response.ok()).toBe(true);
		const text = await response.text();
		expect(text).toMatch(/^# Awesome IIUM/);
		expect(text).toContain(`${SITE}categories/admissions/`);
	});
});
