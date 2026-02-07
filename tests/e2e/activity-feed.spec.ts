import { expect, test } from '@playwright/test';

test.describe('Activity Feed Performance', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to dashboard page
		await page.goto('/Awesome-IIUM/dashboard/');

		// Wait for page to load
		await page.waitForLoadState('networkidle');
	});

	test('should have explicit width and height attributes on avatar images to prevent CLS', async ({
		page,
	}) => {
		// Wait for activity feed to load
		const activityList = page.locator('.activity-list');
		await expect(activityList).toBeVisible();

		// Check all avatar images in the feed
		const avatars = activityList.locator('.avatar');
		const count = await avatars.count();

		expect(count).toBeGreaterThan(0);

		for (let i = 0; i < count; i++) {
			const avatar = avatars.nth(i);

			// Check for width attribute
			const width = await avatar.getAttribute('width');
			expect(width, `Avatar ${i} should have width attribute`).toBe('32');

			// Check for height attribute
			const height = await avatar.getAttribute('height');
			expect(height, `Avatar ${i} should have height attribute`).toBe('32');
		}
	});
});
