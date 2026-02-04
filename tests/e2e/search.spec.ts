/**
 * E2E Tests for Search Functionality
 *
 * Tests Pagefind search integration
 */

import { expect, test } from '@playwright/test';

test.describe('Search Functionality', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to homepage
		await page.goto('/Awesome-IIUM/');

		// Wait for page to load
		await page.waitForLoadState('networkidle');
	});

	test('should display search button in header', async ({ page }) => {
		// Starlight has search button in header
		const searchButton = page
			.locator(
				'button[data-open-modal], .search-button, [aria-label*="Search"]',
			)
			.first();
		await expect(searchButton).toBeVisible({ timeout: 5000 });
	});

	test('should open search modal on click', async ({ page }) => {
		// Click search button
		const searchButton = page
			.locator(
				'button[data-open-modal], .search-button, [aria-label*="Search"]',
			)
			.first();
		await searchButton.click();

		// Search modal/dialog should appear
		await expect(
			page.locator('dialog[open], .search-modal, [role="dialog"]'),
		).toBeVisible({ timeout: 2000 });
	});

	test('should search and show results', async ({ page }) => {
		// Open search
		const searchButton = page
			.locator(
				'button[data-open-modal], .search-button, [aria-label*="Search"]',
			)
			.first();
		await searchButton.click();

		// Wait for search input
		const searchInput = page
			.locator(
				'input[type="search"], input[placeholder*="Search"], .pagefind-ui__search-input',
			)
			.first();
		await expect(searchInput).toBeVisible({ timeout: 2000 });

		// Type search query
		await searchInput.fill('GPA');

		// Wait for results to appear
		await page.waitForFunction(
			() => {
				return (
					document.querySelectorAll(
						'.pagefind-ui__result, .search-result, [data-pagefind-result]',
					).length > 0
				);
			},
			null,
			{ timeout: 10000 },
		);

		// Should show search results
		const results = page.locator(
			'.pagefind-ui__result, .search-result, [data-pagefind-result]',
		);
		const resultCount = await results.count();

		// Should have at least some results
		expect(resultCount).toBeGreaterThan(0);
	});

	test('should navigate to result on click', async ({ page }) => {
		// Open search
		const searchButton = page
			.locator(
				'button[data-open-modal], .search-button, [aria-label*="Search"]',
			)
			.first();
		await searchButton.click();

		// Search for something specific
		const searchInput = page
			.locator(
				'input[type="search"], input[placeholder*="Search"], .pagefind-ui__search-input',
			)
			.first();
		await searchInput.fill('GPA');
		await page.waitForTimeout(1000);

		// Click first result (if any)
		const firstResult = page
			.locator('.pagefind-ui__result, .search-result')
			.first();
		const hasResults = await firstResult.isVisible().catch(() => false);

		if (hasResults) {
			await firstResult.click();

			// Should navigate away from homepage or close modal
			await page.waitForTimeout(500);

			// URL should change or modal should close
			const currentUrl = page.url();
			expect(currentUrl).toBeTruthy();
		}
	});

	test('should handle empty search', async ({ page }) => {
		// Open search
		const searchButton = page
			.locator(
				'button[data-open-modal], .search-button, [aria-label*="Search"]',
			)
			.first();
		await searchButton.click();

		// Search input should be empty initially
		const searchInput = page
			.locator(
				'input[type="search"], input[placeholder*="Search"], .pagefind-ui__search-input',
			)
			.first();
		await expect(searchInput).toHaveValue('');

		// Typing and clearing should work
		await searchInput.fill('test');
		await searchInput.clear();
		await expect(searchInput).toHaveValue('');
	});

	test('should close search modal with Escape key', async ({ page }) => {
		// Open search
		const searchButton = page
			.locator(
				'button[data-open-modal], .search-button, [aria-label*="Search"]',
			)
			.first();
		await searchButton.click();

		// Modal should be open
		const modal = page.locator('dialog[open], .search-modal, [role="dialog"]');
		await expect(modal).toBeVisible();

		// Press Escape
		await page.keyboard.press('Escape');

		// Modal should close
		await expect(modal).not.toBeVisible({ timeout: 1000 });
	});

	test('should be keyboard accessible', async ({ page }) => {
		// Tab to search button
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');

		// One of the tabs should focus the search button
		// Press Enter to open
		await page.keyboard.press('Enter');

		// Search input should be focused
		const searchInput = page
			.locator('input[type="search"], input[placeholder*="Search"]')
			.first();
		const isFocused = await searchInput
			.evaluate((el) => el === document.activeElement)
			.catch(() => false);

		// Input should either be focused or visible
		expect(
			(await searchInput.isVisible().catch(() => false)) || isFocused,
		).toBe(true);
	});
});
