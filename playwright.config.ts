import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Testing Configuration
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
	// Test directory
	testDir: './tests/e2e',

	// Run tests in files in parallel
	fullyParallel: true,

	// Fail the build on CI if you accidentally left test.only in the source code
	forbidOnly: !!process.env.CI,

	// Retry on CI only
	retries: process.env.CI ? 2 : 0,

	// Opt out of parallel tests on CI
	workers: process.env.CI ? 1 : undefined,

	// Reporter to use
	reporter: process.env.CI ? 'github' : 'html',

	// Shared settings for all the projects below
	use: {
		// Base URL for navigation
		baseURL: process.env.BASE_URL || 'http://localhost:4321',

		// Collect trace when retrying the failed test
		trace: 'on-first-retry',

		// Screenshot on failure
		screenshot: 'only-on-failure',
	},

	// Configure projects for major browsers
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],

	// Run your local dev server before starting the tests
	webServer: process.env.CI
		? undefined
		: {
				command: 'pnpm run preview -- --host 0.0.0.0 --port 4321',
				url: 'http://localhost:4321/Awesome-IIUM/',
				reuseExistingServer: true,
				timeout: 180000, // 3 minutes to start server
			},
});
