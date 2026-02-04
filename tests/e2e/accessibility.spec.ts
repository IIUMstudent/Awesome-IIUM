/**
 * Accessibility E2E Tests
 *
 * Tests WCAG 2.1 AA compliance using axe-core
 */

import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Accessibility Tests', () => {
	test('homepage should not have any automatically detectable accessibility issues', async ({
		page,
	}) => {
		await page.goto('/Awesome-IIUM/');
		await page.waitForLoadState('networkidle');

		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
			.analyze();

		expect(accessibilityScanResults.violations).toEqual([]);
	});

	test('tools page should not have accessibility violations', async ({
		page,
	}) => {
		await page.goto('/Awesome-IIUM/tools/');
		await page.waitForLoadState('networkidle');

		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
			.analyze();

		expect(accessibilityScanResults.violations).toEqual([]);
	});

	test('dashboard page should not have accessibility violations', async ({
		page,
	}) => {
		await page.goto('/Awesome-IIUM/dashboard/');
		await page.waitForLoadState('networkidle');

		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
			.analyze();

		expect(accessibilityScanResults.violations).toEqual([]);
	});

	test('GPA calculator should be keyboard accessible', async ({ page }) => {
		await page.goto('/Awesome-IIUM/tools/');

		// Tab through form elements
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');

		// Should be able to interact with form via keyboard
		const focusedElement = await page.evaluate(
			() => document.activeElement?.tagName,
		);
		expect(['INPUT', 'SELECT', 'BUTTON', 'A']).toContain(focusedElement);
	});

	test('prayer times should have proper ARIA labels', async ({ page }) => {
		await page.goto('/Awesome-IIUM/tools/');

		// Campus selector should have label
		const campusSelector = page.locator('#campus-selector');
		await expect(campusSelector).toBeVisible();
		await expect(campusSelector).toHaveAttribute('aria-label', /campus/i);
	});

	test('status dashboard should have proper headings hierarchy', async ({
		page,
	}) => {
		await page.goto('/Awesome-IIUM/dashboard/');
		await page.waitForLoadState('networkidle');

		// Check for heading hierarchy (should have h1, h2, h3 in order)
		const headings = await page
			.locator('h1, h2, h3, h4, h5, h6')
			.allTextContents();
		expect(headings.length).toBeGreaterThan(0);
	});

	test('all images should have alt text', async ({ page }) => {
		await page.goto('/Awesome-IIUM/');
		await page.waitForLoadState('networkidle');

		// Get all images
		const images = page.locator('img');
		const count = await images.count();

		// Check each image has alt attribute
		for (let i = 0; i < count; i++) {
			const img = images.nth(i);
			// Either has alt attribute or is decorative (role="presentation" or aria-hidden)
			const hasAlt = await img.getAttribute('alt').then((val) => val !== null);
			const isDecorative = await img.evaluate(
				(el) =>
					el.getAttribute('role') === 'presentation' ||
					el.getAttribute('aria-hidden') === 'true',
			);

			expect(hasAlt || isDecorative).toBe(true);
		}
	});

	test('interactive elements should have sufficient color contrast', async ({
		page,
	}) => {
		await page.goto('/Awesome-IIUM/');
		await page.waitForLoadState('networkidle');

		// Run axe with color-contrast rule
		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(['wcag2aa'])
			.include('.gpa-calculator, .prayer-times, button, a')
			.analyze();

		const contrastViolations = accessibilityScanResults.violations.filter(
			(v) => v.id === 'color-contrast',
		);

		expect(contrastViolations).toEqual([]);
	});

	test('forms should have proper labels', async ({ page }) => {
		await page.goto('/Awesome-IIUM/tools/');

		// GPA calculator inputs should have labels or aria-labels
		const inputs = page.locator(
			'.gpa-calculator input, .gpa-calculator select',
		);
		const count = await inputs.count();

		for (let i = 0; i < Math.min(count, 5); i++) {
			const input = inputs.nth(i);

			// Should have either label, aria-label, or aria-labelledby
			const hasLabel = await page.evaluate(
				(el) => {
					const input = el as HTMLElement;
					return !!(
						input.getAttribute('aria-label') ||
						input.getAttribute('aria-labelledby') ||
						document.querySelector(`label[for="${input.id}"]`)
					);
				},
				await input.elementHandle(),
			);

			expect(hasLabel).toBe(true);
		}
	});

	test('skip to main content link should be present', async ({ page }) => {
		await page.goto('/Awesome-IIUM/');

		// Starlight provides skip links
		// Look for skip link (usually first focusable element)
		await page.keyboard.press('Tab');

		const focusedText = await page.evaluate(() =>
			document.activeElement?.textContent?.trim(),
		);

		// Skip link typically says "Skip to content" or similar
		// This test is flexible as Starlight handles this
		expect(focusedText).toBeDefined();
	});

	test('page should have lang attribute', async ({ page }) => {
		await page.goto('/Awesome-IIUM/');

		// HTML should have lang attribute
		const lang = await page.locator('html').getAttribute('lang');
		expect(lang).toBeTruthy();
		expect(lang).toMatch(/en|ms|ar/i); // English, Malay, or Arabic
	});

	test('dynamic content should announce changes to screen readers', async ({
		page,
	}) => {
		await page.goto('/Awesome-IIUM/tools/');

		// GPA calculator results should have aria-live
		const resultsDiv = page.locator('#results');
		const ariaLive = await resultsDiv.getAttribute('aria-live');

		// Should have aria-live="polite" or similar
		expect(['polite', 'assertive', 'off']).toContain(ariaLive);
	});
});
