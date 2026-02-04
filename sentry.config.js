// Sentry configuration for error monitoring
// See: https://docs.sentry.io/platforms/javascript/guides/astro/

/**
 * Sentry integration for Awesome IIUM
 *
 * Environment Variables Required:
 * - SENTRY_DSN: Your Sentry project DSN (optional, errors logged if not set)
 * - SENTRY_AUTH_TOKEN: For uploading source maps (CI/CD only)
 *
 * Free tier for open source: https://sentry.io/pricing/
 */

export const sentryConfig = {
	// Sentry Data Source Name - get from your Sentry project
	// Leave empty to disable Sentry (errors will still be logged to console)
	dsn: import.meta.env.PUBLIC_SENTRY_DSN || '',

	// Environment (development, staging, production)
	environment: import.meta.env.NODE_ENV || 'production',

	// Sample rate for performance monitoring (0.0 to 1.0)
	// 0.1 = 10% of transactions are sent (reduces quota usage)
	tracesSampleRate: import.meta.env.NODE_ENV === 'production' ? 0.1 : 1.0,

	// Send session replay for error debugging (requires additional quota)
	replaysOnErrorSampleRate: 0.1, // 10% of error sessions
	replaysSessionSampleRate: 0, // Don't record normal sessions

	// Ignore common non-critical errors
	ignoreErrors: [
		// Browser extensions
		'top.GLOBALS',
		'chrome-extension://',
		'moz-extension://',
		// Network errors (already handled with fallbacks)
		'NetworkError',
		'Failed to fetch',
		'Load failed',
		// Rate limiting (expected behavior)
		'Rate limit exceeded',
		// Aladhan API (may be rate limited)
		'api.aladhan.com',
	],

	// Only send errors for our domain
	allowUrls: [
		/^https?:\/\/(.+\.)?iiumstudent\.github\.io$/,
		/^https?:\/\/localhost(:\d+)?$/,
	],

	// Release version for tracking (uses git commit SHA in production)
	release: import.meta.env.SENTRY_RELEASE || 'development',

	// Enable debug mode in development
	debug: import.meta.env.NODE_ENV === 'development',

	// Automatically integrate with Astro components
	integrations: [],

	// Before sending events, you can modify or drop them
	beforeSend(event, hint) {
		// Don't send events if DSN is not configured
		if (!import.meta.env.PUBLIC_SENTRY_DSN) {
			console.error('[Sentry Not Configured]', hint.originalException || event);
			return null;
		}

		// Log errors to console in development for easier debugging
		if (import.meta.env.NODE_ENV === 'development') {
			console.error('[Sentry]', hint.originalException || event);
		}

		return event;
	},
};

export default sentryConfig;
