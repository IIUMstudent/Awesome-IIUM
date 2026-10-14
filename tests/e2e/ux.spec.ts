import { expect, test } from '@playwright/test';
import { mockAladhan } from './fixtures/aladhan';

test.describe('UX Improvements', () => {
	test('Prayer Times component should show loading state when switching campus', async ({
		page,
	}) => {
		// 1. Go to the page where the component is
		await page.goto('/Awesome-IIUM/tools/');

		// 2. Locate the grid and selector
		const grid = page.locator('#prayer-grid');
		const selector = page.locator('#campus-selector');

		// 3. Delay the API response by 1 second to make loading state observable
		await mockAladhan(page, 1000);

		// 4. Trigger the fetch by changing the campus
		// Select a different campus (e.g., 'kuantan')
		// Ensure we pick something different from default 'gombak'
		await selector.selectOption('kuantan');

		// 5. Verify the loading state appears immediately
		await expect(grid).toHaveClass(/is-loading/);
		await expect(grid).toHaveAttribute('aria-busy', 'true');

		// 6. Wait for the loading state to disappear (fetch completes)
		await expect(grid).not.toHaveClass(/is-loading/);
		await expect(grid).not.toHaveAttribute('aria-busy', 'true');
	});

	test('Offline notice only shows while offline', async ({ page, context }) => {
		await page.goto('/Awesome-IIUM/');
		const notice = page.locator('#offline-indicator');
		await expect(notice).toHaveCount(0);

		await context.setOffline(true);
		await expect(notice).toBeVisible();

		await context.setOffline(false);
		await expect(notice).toHaveCount(0);
	});
});
