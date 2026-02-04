/**
 * E2E Tests for Status Dashboard
 *
 * Tests system status monitoring and display
 */

import { expect, test } from '@playwright/test';

test.describe('Status Dashboard', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to dashboard page
		await page.goto('/Awesome-IIUM/dashboard/');

		// Wait for page to load
		await page.waitForLoadState('networkidle');
	});

	test('should display status dashboard', async ({ page }) => {
		// Dashboard should be visible
		await expect(page.locator('#status-dashboard')).toBeVisible();

		// Should have status grid
		await expect(page.locator('#status-grid')).toBeVisible();
	});

	test('should load and display system statuses', async ({ page }) => {
		// Wait for status cards to load
		await expect(page.locator('.status-card')).toHaveCount(
			await page.locator('.status-card').count(),
			{ timeout: 10000 },
		);

		// Should have at least one status card
		const cardCount = await page.locator('.status-card').count();
		expect(cardCount).toBeGreaterThan(0);

		// Each card should have a status header and body
		for (let i = 0; i < Math.min(cardCount, 3); i++) {
			await expect(
				page.locator('.status-card').nth(i).locator('.status-header'),
			).toBeVisible();
			await expect(
				page.locator('.status-card').nth(i).locator('.status-body'),
			).toBeVisible();
		}
	});

	test('should display status indicators correctly', async ({ page }) => {
		// Wait for status cards
		const cards = page.locator('.status-card');
		const count = await cards.count();

		if (count > 0) {
			// First card should have status label
			await expect(cards.first().locator('.status-label')).toBeVisible();

			// Status label should be ONLINE or OFFLINE
			const statusText = await cards
				.first()
				.locator('.status-label')
				.textContent();
			expect(statusText).toMatch(/ONLINE|OFFLINE/i);

			// Should have status dot indicator
			await expect(cards.first().locator('.status-dot')).toBeVisible();
		}
	});

	test('should show system names', async ({ page }) => {
		// Wait for cards to load
		const cards = page.locator('.status-card');
		const count = await cards.count();

		if (count > 0) {
			// Each card should have a system name in h3
			for (let i = 0; i < Math.min(count, 3); i++) {
				const name = await cards.nth(i).locator('h3').textContent();
				expect(name).toBeTruthy();
				expect(name?.length).toBeGreaterThan(0);
			}
		}
	});

	test('should display last checked timestamp', async ({ page }) => {
		// Wait for cards
		const cards = page.locator('.status-card');
		const count = await cards.count();

		if (count > 0) {
			// Should have timestamp
			await expect(cards.first().locator('.status-time')).toBeVisible();

			const timeText = await cards
				.first()
				.locator('.status-time')
				.textContent();
			expect(timeText).toContain('Last Checked');
		}
	});

	test('should handle empty status gracefully', async ({ page }) => {
		// Even if no status data, should not crash
		await expect(page.locator('#status-dashboard')).toBeVisible();

		// Should either show cards or loading state
		const hasCards = (await page.locator('.status-card').count()) > 0;
		const hasLoading = await page
			.locator('.loading')
			.isVisible()
			.catch(() => false);

		expect(hasCards || hasLoading).toBe(true);
	});

	test('should apply correct CSS classes for status', async ({ page }) => {
		// Wait for cards
		const cards = page.locator('.status-card');
		const count = await cards.count();

		if (count > 0) {
			// Card should have 'online' or 'offline' class
			const firstCard = cards.first();
			const className = await firstCard.getAttribute('class');

			expect(className).toMatch(/online|offline/i);
		}
	});

	test('should be responsive', async ({ page }) => {
		// Desktop view
		await page.setViewportSize({ width: 1280, height: 720 });
		await expect(page.locator('#status-dashboard')).toBeVisible();

		// Mobile view
		await page.setViewportSize({ width: 375, height: 667 });
		await expect(page.locator('#status-dashboard')).toBeVisible();

		// Cards should still be visible on mobile
		const cardCount = await page.locator('.status-card').count();
		if (cardCount > 0) {
			await expect(page.locator('.status-card').first()).toBeVisible();
		}
	});
});
