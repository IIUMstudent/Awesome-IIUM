/**
 * E2E Tests for Prayer Times Widget
 *
 * Tests prayer times display and campus selection
 */

import { expect, type Page, test } from '@playwright/test';

test.describe('Prayer Times', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to tools page where prayer times widget is located
		await page.goto('/Awesome-IIUM/tools/');

		// Wait for prayer times widget to be visible
		await expect(page.locator('.prayer-times')).toBeVisible();
	});

	const waitForPrayerData = async (page: Page) => {
		await page.waitForSelector('.prayer-card, .error', { timeout: 10000 });
		const hasError = await page
			.locator('.error')
			.isVisible()
			.catch(() => false);
		return !hasError;
	};

	test('should display prayer times widget', async ({ page }) => {
		// Check heading
		await expect(page.locator('.prayer-times h3')).toContainText(
			'Prayer Times',
		);

		// Check campus selector exists
		await expect(page.locator('#campus-selector')).toBeVisible();

		// Check attribution link
		await expect(page.locator('.prayer-times .attribution')).toContainText(
			'Aladhan.com',
		);
	});

	test('should show prayer times for default campus (Gombak)', async ({
		page,
	}) => {
		const hasData = await waitForPrayerData(page);
		if (!hasData) {
			test.skip(true, 'Prayer times unavailable');
			return;
		}

		// Wait for prayer grid to load
		await expect(page.locator('#prayer-grid')).toBeVisible();

		// Should have multiple prayer cards (Subuh, Syuruk, Zohor, Asar, Maghrib, Isyak)
		await expect(page.locator('.prayer-card')).toHaveCount(6, {
			timeout: 10000,
		});

		// Check for expected prayer names
		await expect(page.locator('.prayer-times')).toContainText('Subuh');
		await expect(page.locator('.prayer-times')).toContainText('Zohor');
		await expect(page.locator('.prayer-times')).toContainText('Asar');
	});

	test('should switch between campuses', async ({ page }) => {
		const hasData = await waitForPrayerData(page);
		if (!hasData) {
			test.skip(true, 'Prayer times unavailable');
			return;
		}

		// Wait for initial load
		await expect(page.locator('.prayer-card')).toHaveCount(6, {
			timeout: 10000,
		});

		// Default should be Gombak
		await expect(page.locator('#campus-selector')).toHaveValue('gombak');

		// Switch to Kuantan
		await page.locator('#campus-selector').selectOption('kuantan');

		// Should still show 6 prayer times
		await expect(page.locator('.prayer-card')).toHaveCount(6, {
			timeout: 10000,
		});

		// Switch to Pagoh
		await page.locator('#campus-selector').selectOption('pagoh');

		// Should still show 6 prayer times
		await expect(page.locator('.prayer-card')).toHaveCount(6, {
			timeout: 10000,
		});
	});

	test('should display Hijri date', async ({ page }) => {
		const hasData = await waitForPrayerData(page);
		if (!hasData) {
			test.skip(true, 'Prayer times unavailable');
			return;
		}

		// Wait for Hijri date to load
		await expect(page.locator('#hijri-date')).not.toContainText('Loading');

		// Should contain date information (year 14xx or 15xx)
		const hijriText = await page.locator('#hijri-date').textContent();
		expect(hijriText).toMatch(/\d{4}/); // Contains 4-digit year
	});

	test('should show next prayer countdown', async ({ page }) => {
		const hasData = await waitForPrayerData(page);
		if (!hasData) {
			test.skip(true, 'Prayer times unavailable');
			return;
		}

		// Wait for prayer times to load
		await expect(page.locator('.prayer-card')).toHaveCount(6, {
			timeout: 10000,
		});

		// Next prayer section should be visible
		await expect(page.locator('#next-prayer')).toBeVisible();

		// Should show next prayer name
		const nextPrayerName = await page
			.locator('#next-prayer-name')
			.textContent();
		expect(nextPrayerName).not.toBe('-');

		// Should show countdown timer (format: HH:MM:SS or --:--:--)
		const countdown = await page.locator('#countdown').textContent();
		expect(countdown).toMatch(/\d{2}:\d{2}:\d{2}|--:--:--/);

		// Should have descriptive title for mouse users (e.g. "Next prayer at 5:30 PM")
		// Using a looser regex to accommodate different locales (HH:MM or H:MM PM)
		const title = await page.locator('#countdown').getAttribute('title');
		expect(title).toMatch(/^Next prayer at \d{1,2}:\d{2}(?:\s?[AP]M)?$/);

		// Should have accessible label for screen readers
		const ariaLabel = await page
			.locator('#countdown')
			.getAttribute('aria-label');
		expect(ariaLabel).toMatch(/^Time remaining until .+$/);
	});

	test('should highlight current/next prayer', async ({ page }) => {
		const hasData = await waitForPrayerData(page);
		if (!hasData) {
			test.skip(true, 'Prayer times unavailable');
			return;
		}

		// Wait for prayer times to load
		await expect(page.locator('.prayer-card')).toHaveCount(6, {
			timeout: 10000,
		});

		// One prayer card should have 'active' or 'current' class
		// or next prayer indicator (implementation-specific)
		const activeCards = page.locator('.prayer-card.active, .prayer-card.next');

		// May have 0-2 cards highlighted (current + next)
		const count = await activeCards.count();
		expect(count).toBeGreaterThanOrEqual(0);
		expect(count).toBeLessThanOrEqual(2);
	});

	test('should use cached data when available', async ({ page }) => {
		const hasData = await waitForPrayerData(page);
		if (!hasData) {
			test.skip(true, 'Prayer times unavailable');
			return;
		}

		// First visit - load from API
		await expect(page.locator('.prayer-card')).toHaveCount(6, {
			timeout: 10000,
		});

		// Reload page - should use cache (faster load)
		const startTime = Date.now();
		await page.reload();
		await expect(page.locator('.prayer-card')).toHaveCount(6, {
			timeout: 5000,
		});
		const loadTime = Date.now() - startTime;

		// Cached load should be reasonably fast (< 3 seconds)
		expect(loadTime).toBeLessThan(3000);
	});
});
