import { expect, test } from '@playwright/test';

test.describe('GPA Calculator Performance & Logic', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to the dashboard where the calculator is located
		// Note: baseURL includes /Awesome-IIUM/ if configured in playwright config,
		// but looking at config it defaults to localhost:4321.
		// The webServer command includes base path.
		// If baseURL is http://localhost:4321, we need to append /Awesome-IIUM/dashboard
		// But usually playwright baseURL is just the host.
		// Let's assume we need the full path relative to root if baseURL is root.
		// However, looking at playwright.config.ts: url: 'http://localhost:4321/Awesome-IIUM/'
		// If I use page.goto('/Awesome-IIUM/dashboard'), it should work.
		await page.goto('/Awesome-IIUM/tools');

		// Wait for the calculator to be visible
		await expect(page.locator('.gpa-calculator')).toBeVisible();
	});

	test('button state transitions optimization', async ({ page }) => {
		const container = page.locator('#courses-container');
		const addBtn = page.locator('#add-course');

		// Initial state: 1 row
		await expect(container.locator('.course-row')).toHaveCount(1);

		// First row remove button should be disabled
		const firstRowRemoveBtn = container
			.locator('.course-row')
			.first()
			.locator('.remove-btn');
		await expect(firstRowRemoveBtn).toBeDisabled();

		// Add 2nd row
		await addBtn.click();
		await expect(container.locator('.course-row')).toHaveCount(2);

		// Both remove buttons should be enabled
		await expect(firstRowRemoveBtn).toBeEnabled();
		const secondRowRemoveBtn = container
			.locator('.course-row')
			.nth(1)
			.locator('.remove-btn');
		await expect(secondRowRemoveBtn).toBeEnabled();

		// Remove 2nd row
		// Note: The logic has a timeout for animation (200ms) or direct removal.
		// Playwright waits for element to be detached? No, click resolves immediately.
		await secondRowRemoveBtn.click();

		// Wait for row to be removed
		await expect(container.locator('.course-row')).toHaveCount(1);

		// Remaining row (was first) should have disabled remove button
		await expect(firstRowRemoveBtn).toBeDisabled();
	});

	test('clear all functionality', async ({ page }) => {
		const container = page.locator('#courses-container');
		const addBtn = page.locator('#add-course');
		const clearBtn = page.locator('#clear-all');

		// Add a few rows
		await addBtn.click();
		await addBtn.click();
		await expect(container.locator('.course-row')).toHaveCount(3);

		// Click Clear All (first click changes text)
		await clearBtn.click();
		await expect(clearBtn).toHaveText(/Confirm/);

		// Click again to confirm
		await clearBtn.click();

		// Should reset to 1 row
		await expect(container.locator('.course-row')).toHaveCount(1);

		// The single row should have disabled remove button
		const firstRowRemoveBtn = container
			.locator('.course-row')
			.first()
			.locator('.remove-btn');
		await expect(firstRowRemoveBtn).toBeDisabled();
	});
});
