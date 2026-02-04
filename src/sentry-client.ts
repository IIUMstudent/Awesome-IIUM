// Client-side Sentry initialization
// This file is loaded in the browser to capture client-side errors

import * as Sentry from '@sentry/astro';

// Only initialize Sentry if DSN is configured
const sentryDsn = import.meta.env.PUBLIC_SENTRY_DSN;

if (sentryDsn) {
	Sentry.init({
		dsn: sentryDsn,
		environment: import.meta.env.MODE || 'production',

		// Performance Monitoring
		tracesSampleRate: 0.1, // 10% of transactions

		// Session Replay
		replaysSessionSampleRate: 0.1, // 10% of sessions
		replaysOnErrorSampleRate: 1.0, // 100% of error sessions

		// Integrations
		integrations: [
			Sentry.replayIntegration({
				maskAllText: false,
				blockAllMedia: false,
			}),
			Sentry.browserTracingIntegration(),
		],

		// Filter out non-critical errors
		beforeSend(event, hint) {
			const error = hint.originalException;

			// Ignore GitHub API rate limit errors (handled gracefully)
			if (
				error &&
				typeof error === 'object' &&
				'message' in error &&
				typeof error.message === 'string'
			) {
				if (
					error.message.includes('rate limit') ||
					error.message.includes('Rate limit')
				) {
					return null;
				}
			}

			// Ignore abort/timeout errors (network issues)
			if (error && typeof error === 'object' && 'name' in error) {
				if (error.name === 'AbortError' || error.name === 'TimeoutError') {
					return null;
				}
			}

			// Ignore browser extension errors
			if (
				event.exception?.values?.[0]?.stacktrace?.frames?.some(
					(frame) =>
						frame.filename?.includes('chrome-extension://') ||
						frame.filename?.includes('moz-extension://'),
				)
			) {
				return null;
			}

			return event;
		},

		// Debug mode in development
		debug: import.meta.env.MODE === 'development',
	});

	console.info('✅ Sentry error tracking initialized');
} else {
	console.info('ℹ️  Sentry disabled (no PUBLIC_SENTRY_DSN configured)');
}
