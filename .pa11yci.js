/**
 * Pa11y-ci configuration for accessibility testing
 *
 * Supports both CI and local development environments
 * Uses JavaScript config to enable conditional browser paths
 */

// Determine Chrome/Chromium executable path based on environment
const getChromiumPath = () => {
	// In CI, use system-installed chromium-browser
	if (process.env.CI) {
		return '/usr/bin/chromium-browser';
	}

	// Locally, let puppeteer auto-detect (works with Chrome/Chromium in PATH)
	// Or use PUPPETEER_EXECUTABLE_PATH if set
	return process.env.PUPPETEER_EXECUTABLE_PATH || undefined;
};

const chromiumPath = getChromiumPath();

module.exports = {
	defaults: {
		timeout: 10000,
		wait: 1000,
		chromeLaunchConfig: {
			// Only set executablePath if we have a specific path
			...(chromiumPath && { executablePath: chromiumPath }),
			args: [
				'--no-sandbox',
				'--disable-setuid-sandbox',
				'--disable-dev-shm-usage',
			],
		},
		standard: 'WCAG2AA',
		runners: ['axe'],
		reporters: ['cli'],
		ignore: [
			'color-contrast', // Color contrast checked separately in other tools
		],
	},
	urls: [
		'http://localhost:4321/Awesome-IIUM/',
		'http://localhost:4321/Awesome-IIUM/tools/',
		'http://localhost:4321/Awesome-IIUM/dashboard/',
		'http://localhost:4321/Awesome-IIUM/about/contributing/',
		'http://localhost:4321/Awesome-IIUM/categories/academics/',
	],
};
