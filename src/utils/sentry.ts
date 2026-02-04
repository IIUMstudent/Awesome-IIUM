// src/utils/sentry.ts

/**
 * Sentry Error Tracking Utilities
 *
 * Provides client-side error monitoring for production environments.
 * Free tier for open source projects: https://sentry.io/pricing/
 */

import * as Sentry from '@sentry/astro';

interface SentryConfig {
	dsn?: string;
	environment?: string;
	enabled?: boolean;
}

/**
 * Initialize Sentry error tracking (client-side only)
 */
export function initSentry(config: SentryConfig = {}) {
	const {
		dsn = import.meta.env.PUBLIC_SENTRY_DSN,
		environment = import.meta.env.PUBLIC_ENV || 'production',
		enabled = import.meta.env.PROD && !!dsn,
	} = config;

	// Only enable Sentry in production with valid DSN
	if (!enabled || !dsn) {
		console.info('Sentry error tracking disabled (no DSN configured)');
		return;
	}

	Sentry.init({
		dsn,
		environment,

		// Performance Monitoring
		tracesSampleRate: 0.1, // 10% of transactions

		// Session Replay for debugging
		replaysSessionSampleRate: 0.1, // 10% of sessions
		replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

		// Integrations
		integrations: [
			Sentry.replayIntegration(),
			Sentry.browserTracingIntegration(),
		],

		// Filter out known issues
		beforeSend(event, hint) {
			// Ignore GitHub API rate limit errors (already handled gracefully)
			const error = hint.originalException;
			if (error && typeof error === 'object' && 'message' in error) {
				const message = String(error.message);
				if (message.includes('rate limit') || message.includes('Rate limit')) {
					return null; // Don't send to Sentry
				}
			}

			// Ignore timeout errors (network issues)
			if (error && typeof error === 'object' && 'name' in error) {
				if (error.name === 'AbortError' || error.name === 'TimeoutError') {
					return null;
				}
			}

			return event;
		},

		// Debugging (only in development)
		debug: !import.meta.env.PROD,
	});

	console.info('Sentry error tracking initialized');
}

/**
 * Capture error manually
 */
export function captureError(error: Error, context?: Record<string, unknown>) {
	if (!import.meta.env.PROD) {
		console.error('Error:', error, context);
		return;
	}

	Sentry.captureException(error, {
		extra: context,
	});
}

/**
 * Capture message for non-error tracking
 */
export function captureMessage(
	message: string,
	level: 'debug' | 'info' | 'warning' | 'error' = 'info',
) {
	if (!import.meta.env.PROD) {
		console[level === 'warning' ? 'warn' : level](message);
		return;
	}

	Sentry.captureMessage(message, level);
}

/**
 * Set user context (optional)
 */
export function setUser(
	user: { id?: string; username?: string; email?: string } | null,
) {
	Sentry.setUser(user);
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(message: string, data?: Record<string, unknown>) {
	Sentry.addBreadcrumb({
		message,
		data,
		level: 'info',
	});
}

/**
 * Error boundary wrapper for async functions
 */
export async function withErrorBoundary<T>(
	fn: () => Promise<T>,
	fallback: T,
	context?: string,
): Promise<T> {
	try {
		return await fn();
	} catch (error) {
		console.error(`Error in ${context || 'async operation'}:`, error);

		if (import.meta.env.PROD && error instanceof Error) {
			captureError(error, {
				context,
				boundary: 'withErrorBoundary',
			});
		}

		return fallback;
	}
}

/**
 * Sync error boundary wrapper
 */
export function withErrorBoundarySync<T>(
	fn: () => T,
	fallback: T,
	context?: string,
): T {
	try {
		return fn();
	} catch (error) {
		console.error(`Error in ${context || 'operation'}:`, error);

		if (import.meta.env.PROD && error instanceof Error) {
			captureError(error, {
				context,
				boundary: 'withErrorBoundarySync',
			});
		}

		return fallback;
	}
}
