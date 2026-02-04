import { getViteConfig } from 'astro/config';
import { defineConfig } from 'vitest/config';

/**
 * Vitest configuration for Awesome IIUM project
 *
 * Uses Astro's Vite config to ensure consistency with the build process.
 * Tests are written using Vitest and can test both utility functions and
 * Astro components.
 *
 * @see https://vitest.dev/config/
 * @see https://docs.astro.build/en/guides/testing/
 */
export default defineConfig(
	getViteConfig({
		test: {
			// Test environment
			environment: 'happy-dom', // Lightweight DOM implementation (faster than jsdom)

			// Globals (optional - can use import { describe, it, expect } instead)
			globals: true,

			// Coverage configuration
			coverage: {
				provider: 'v8', // Built-in coverage provider
				reporter: ['text', 'json', 'html', 'lcov'],
				include: ['src/**/*.{ts,tsx,astro,js,jsx}'],
				exclude: [
					'src/content/**', // Content files
					'src/assets/**', // Static assets
					'**/*.config.*', // Config files
					'**/*.d.ts', // Type definitions
					'**/types.ts', // Type files
					'dist/**', // Build output
					'node_modules/**',
				],
				// Target 70%+ coverage on critical paths
				thresholds: {
					lines: 70,
					functions: 70,
					branches: 60,
					statements: 70,
				},
			},

			// Test file patterns
			include: ['tests/**/*.{test,spec}.{ts,tsx,js,jsx}'],
			exclude: ['tests/e2e/**'], // Exclude E2E tests (run with Playwright)

			// Setup files (if needed)
			// setupFiles: ['./tests/setup.ts'],

			// Timeout configuration
			testTimeout: 10000, // 10s for unit tests
			hookTimeout: 10000,

			// Reporter configuration
			reporters: ['verbose'],

			// Mock configuration
			mockReset: true, // Reset mocks between tests
			clearMocks: true,
			restoreMocks: true,
		},
	}),
);
