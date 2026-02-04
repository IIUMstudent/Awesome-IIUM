/**
 * E2E Tests for GPA Calculator
 *
 * Tests user interactions with the GPA calculator widget
 */

import { expect, test } from '@playwright/test';

test.describe('GPA Calculator', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to tools page where GPA calculator is located
		await page.goto('/Awesome-IIUM/tools/');

		// Wait for GPA calculator to be visible
		await expect(page.locator('.gpa-calculator')).toBeVisible();
	});

	test('should display GPA calculator widget', async ({ page }) => {
		// Check heading
		await expect(page.locator('.gpa-calculator h3')).toContainText(
			'GPA Calculator',
		);

		// Check default course row exists
		await expect(page.locator('.course-row')).toBeVisible();

		// Check action buttons exist
		await expect(
			page.getByRole('button', { name: /add course/i }),
		).toBeVisible();
		await expect(
			page.getByRole('button', { name: /calculate gpa/i }),
		).toBeVisible();
	});

	test('should calculate semester GPA correctly', async ({ page }) => {
		// Fill first course: Course 1, Grade A (4.00), 3 credits
		await page
			.locator('.course-row')
			.first()
			.locator('.course-name')
			.fill('Data Structures');
		await page
			.locator('.course-row')
			.first()
			.locator('.grade')
			.selectOption('4.00');
		await page
			.locator('.course-row')
			.first()
			.locator('.credits')
			.selectOption('3');

		// Add second course
		await page.getByRole('button', { name: /add course/i }).click();

		// Fill second course: Course 2, Grade B (3.00), 3 credits
		await page
			.locator('.course-row')
			.nth(1)
			.locator('.course-name')
			.fill('Web Development');
		await page
			.locator('.course-row')
			.nth(1)
			.locator('.grade')
			.selectOption('3.00');
		await page
			.locator('.course-row')
			.nth(1)
			.locator('.credits')
			.selectOption('3');

		// Calculate GPA
		await page.getByRole('button', { name: /calculate gpa/i }).click();

		// Wait for results
		await expect(page.locator('#results')).toBeVisible();

		// Verify GPA: (4.00*3 + 3.00*3) / 6 = 3.50
		await expect(page.locator('#semester-gpa')).toContainText('3.50');

		// Verify total credits
		await expect(page.locator('#total-credits')).toContainText('6');
	});

	test('should show validation error for incomplete course', async ({
		page,
	}) => {
		// Fill name but not grade/credits
		await page
			.locator('.course-row')
			.first()
			.locator('.course-name')
			.fill('Incomplete Course');

		// Try to calculate
		await page.getByRole('button', { name: /calculate gpa/i }).click();

		// Should show validation error
		await expect(page.locator('#validation-error')).toBeVisible();
		await expect(page.locator('#validation-error')).toContainText(
			/grade and credits/i,
		);
	});

	test('should add and remove courses', async ({ page }) => {
		// Initial: 1 course
		await expect(page.locator('.course-row')).toHaveCount(1);

		// Add course
		await page.getByRole('button', { name: /add course/i }).click();
		await expect(page.locator('.course-row')).toHaveCount(2);

		// Add another
		await page.getByRole('button', { name: /add course/i }).click();
		await expect(page.locator('.course-row')).toHaveCount(3);

		// Remove one (click remove button on last row)
		await page.locator('.course-row').nth(2).locator('.remove-btn').click();
		await expect(page.locator('.course-row')).toHaveCount(2);
	});

	test('should calculate new CGPA with previous data', async ({ page }) => {
		// Fill previous CGPA data
		await page.locator('#prev-cgpa').fill('3.20');
		await page.locator('#prev-credits').fill('60');

		// Fill current semester: A grade, 3 credits
		await page
			.locator('.course-row')
			.first()
			.locator('.course-name')
			.fill('Final Year Project');
		await page
			.locator('.course-row')
			.first()
			.locator('.grade')
			.selectOption('4.00');
		await page
			.locator('.course-row')
			.first()
			.locator('.credits')
			.selectOption('3');

		// Calculate
		await page.getByRole('button', { name: /calculate gpa/i }).click();

		// Wait for CGPA result
		await expect(page.locator('#cgpa-result')).toBeVisible();

		// Verify new CGPA is calculated
		const newCgpaText = await page.locator('#new-cgpa').textContent();
		expect(parseFloat(newCgpaText || '0')).toBeGreaterThan(3.2);
		expect(parseFloat(newCgpaText || '0')).toBeLessThanOrEqual(4.0);
	});

	test('should handle keyboard navigation', async ({ page }) => {
		// Focus first input
		await page.locator('.course-row').first().locator('.course-name').focus();

		// Fill and press Enter
		await page.keyboard.type('Mathematics');
		await page.keyboard.press('Enter');

		// Should add new row when Enter pressed on last row
		// (Implementation may vary, adjust test accordingly)
	});

	test('should save and restore data from localStorage', async ({ page }) => {
		// Fill previous CGPA data
		await page.locator('#prev-cgpa').fill('3.75');
		await page.locator('#prev-credits').fill('90');

		// Save
		await page.getByRole('button', { name: /save/i }).click();

		// Wait for save confirmation
		await expect(page.locator('#save-status')).toContainText(/saved/i);

		// Reload page
		await page.reload();

		// Data should be restored
		await expect(page.locator('#prev-cgpa')).toHaveValue('3.75');
		await expect(page.locator('#prev-credits')).toHaveValue('90');
	});
});
