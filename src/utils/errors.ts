// src/utils/errors.ts

/**
 * Centralized error handling utilities
 * Provides standardized error messages, retry logic, and Sentry integration
 */

import { captureError as sentryCaptureError } from './sentry';

/**
 * Error categories for better error handling
 */
export enum ErrorCategory {
	NETWORK = 'network',
	API = 'api',
	VALIDATION = 'validation',
	TIMEOUT = 'timeout',
	RATE_LIMIT = 'rate_limit',
	UNKNOWN = 'unknown',
}

/**
 * Standard error response for components
 */
export interface ErrorResponse {
	category: ErrorCategory;
	message: string;
	userMessage: string;
	canRetry: boolean;
	error?: Error;
}

/**
 * User-friendly error messages mapped to error categories
 */
const USER_MESSAGES: Record<ErrorCategory, string> = {
	[ErrorCategory.NETWORK]:
		'Unable to connect. Please check your internet connection and try again.',
	[ErrorCategory.API]:
		'Unable to load data at this time. Please try refreshing the page.',
	[ErrorCategory.VALIDATION]:
		'Invalid data received. Please contact support if this persists.',
	[ErrorCategory.TIMEOUT]: 'Request timed out. Please try again.',
	[ErrorCategory.RATE_LIMIT]:
		'Too many requests. Please wait a moment and try again.',
	[ErrorCategory.UNKNOWN]: 'Something went wrong. Please try again later.',
};

/**
 * Categorize error based on type and message
 */
export function categorizeError(error: unknown): ErrorCategory {
	if (!(error instanceof Error)) {
		return ErrorCategory.UNKNOWN;
	}

	const message = error.message.toLowerCase();
	const name = error.name.toLowerCase();

	if (
		name === 'aborterror' ||
		name === 'timeouterror' ||
		message.includes('timeout')
	) {
		return ErrorCategory.TIMEOUT;
	}

	if (message.includes('rate limit')) {
		return ErrorCategory.RATE_LIMIT;
	}

	if (message.includes('network') || message.includes('fetch')) {
		return ErrorCategory.NETWORK;
	}

	if (message.includes('http') || message.includes('status')) {
		return ErrorCategory.API;
	}

	if (message.includes('validation') || message.includes('invalid')) {
		return ErrorCategory.VALIDATION;
	}

	return ErrorCategory.UNKNOWN;
}

/**
 * Create standardized error response
 */
export function createErrorResponse(
	error: unknown,
	_context?: string,
): ErrorResponse {
	const errorObj = error instanceof Error ? error : new Error(String(error));
	const category = categorizeError(errorObj);

	// Determine if retry is possible
	const canRetry = [
		ErrorCategory.NETWORK,
		ErrorCategory.TIMEOUT,
		ErrorCategory.API,
		ErrorCategory.RATE_LIMIT,
	].includes(category);

	return {
		category,
		message: errorObj.message,
		userMessage: USER_MESSAGES[category],
		canRetry,
		error: errorObj,
	};
}

/**
 * Handle error with logging and Sentry capture
 */
export function handleError(
	error: unknown,
	context?: string,
	additionalData?: Record<string, unknown>,
): ErrorResponse {
	const errorResponse = createErrorResponse(error, context);

	// Log to console in development
	if (!import.meta.env.PROD) {
		console.error(`Error in ${context || 'application'}:`, {
			category: errorResponse.category,
			message: errorResponse.message,
			...additionalData,
		});
	}

	// Capture in Sentry (production only, filters applied in sentry.ts)
	if (import.meta.env.PROD && errorResponse.error) {
		sentryCaptureError(errorResponse.error, {
			context,
			category: errorResponse.category,
			...additionalData,
		});
	}

	return errorResponse;
}

/**
 * Async error boundary with retry logic
 */
export async function withRetry<T>(
	fn: () => Promise<T>,
	options: {
		maxRetries?: number;
		baseDelay?: number;
		fallback?: T;
		context?: string;
		onError?: (error: ErrorResponse, attempt: number) => void;
	} = {},
): Promise<T> {
	const {
		maxRetries = 3,
		baseDelay = 1000,
		fallback,
		context = 'async operation',
		onError,
	} = options;

	let lastError: ErrorResponse | null = null;

	for (let attempt = 0; attempt < maxRetries; attempt++) {
		try {
			return await fn();
		} catch (error) {
			lastError = handleError(error, context, {
				attempt: attempt + 1,
				maxRetries,
			});

			// Call error handler if provided
			if (onError) {
				onError(lastError, attempt + 1);
			}

			// Don't retry if error is not retriable
			if (!lastError.canRetry) {
				break;
			}

			// Exponential backoff
			if (attempt < maxRetries - 1) {
				const delay = baseDelay * 2 ** attempt;
				await new Promise((resolve) => setTimeout(resolve, delay));
			}
		}
	}

	// All retries failed
	if (fallback !== undefined) {
		return fallback;
	}

	throw lastError?.error || new Error('Operation failed after retries');
}

/**
 * Synchronous error boundary
 */
export function tryCatch<T>(
	fn: () => T,
	options: {
		fallback?: T;
		context?: string;
		onError?: (error: ErrorResponse) => void;
	} = {},
): T {
	const { fallback, context = 'operation', onError } = options;

	try {
		return fn();
	} catch (error) {
		const errorResponse = handleError(error, context);

		if (onError) {
			onError(errorResponse);
		}

		if (fallback !== undefined) {
			return fallback;
		}

		throw errorResponse.error;
	}
}

/**
 * Format error for display in components
 */
export function formatErrorMessage(
	error: ErrorResponse,
	includeRetry = true,
): string {
	let message = error.userMessage;

	if (includeRetry && error.canRetry) {
		message += ' Click to retry.';
	}

	return message;
}

/**
 * Create error element for Astro components (SSG-friendly)
 */
export function createErrorMarkup(
	error: ErrorResponse,
	options: {
		showDetails?: boolean;
		includeRetry?: boolean;
	} = {},
): string {
	const { showDetails = false, includeRetry = true } = options;

	const message = formatErrorMessage(error, includeRetry);
	const details =
		showDetails && !import.meta.env.PROD
			? `<p class="error-details">${error.message}</p>`
			: '';

	return `
		<div class="error-message" role="alert" aria-live="polite">
			<p class="error-text">${message}</p>
			${details}
		</div>
	`;
}

/**
 * Check if value is an error response
 */
export function isErrorResponse(value: unknown): value is ErrorResponse {
	return (
		typeof value === 'object' &&
		value !== null &&
		'category' in value &&
		'userMessage' in value
	);
}

/**
 * API-specific error handler for fetch operations
 */
export async function fetchWithErrorHandling<T>(
	url: string,
	options: RequestInit & {
		timeout?: number;
		fallback?: T;
		context?: string;
	} = {},
): Promise<T> {
	const {
		timeout = 5000,
		fallback,
		context = 'API fetch',
		...fetchOptions
	} = options;

	return withRetry(
		async () => {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), timeout);

			try {
				const response = await fetch(url, {
					...fetchOptions,
					signal: controller.signal,
				});

				clearTimeout(timeoutId);

				if (!response.ok) {
					throw new Error(`HTTP ${response.status}: ${response.statusText}`);
				}

				return await response.json();
			} catch (error) {
				clearTimeout(timeoutId);
				throw error;
			}
		},
		{
			fallback,
			context: `${context} (${url})`,
		},
	);
}
