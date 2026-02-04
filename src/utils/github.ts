// src/utils/github.ts

/**
 * GitHub API utilities with error handling and rate limiting
 */

export interface Contributor {
	login: string;
	avatar_url: string;
	html_url: string;
	contributions: number;
}

export interface Commit {
	sha: string;
	commit: {
		author: {
			name: string;
			date: string;
		};
		message: string;
	};
	html_url: string;
	author: {
		login: string;
		avatar_url: string;
	};
}

export interface PullRequest {
	id: number;
	html_url: string;
	title: string;
	user: {
		login: string;
		avatar_url: string;
	};
	created_at: string;
}

interface Cache<T> {
	data: T | null;
	lastFetched: number | null;
}

interface RateLimitInfo {
	remaining: number;
	reset: number; // Unix timestamp
	limit: number;
}

const contributorCache: Cache<Contributor[]> = {
	data: null,
	lastFetched: null,
};

const commitsCache: Cache<Commit[]> = {
	data: null,
	lastFetched: null,
};

const pullsCache: Cache<PullRequest[]> = {
	data: null,
	lastFetched: null,
};

const TTL = 3600000; // 1 hour

// Fallback static data for when API is unavailable
const FALLBACK_CONTRIBUTORS: Contributor[] = [
	{
		login: 'IIUMstudent',
		avatar_url: 'https://github.com/ghost.png',
		html_url: 'https://github.com/IIUMstudent/Awesome-IIUM',
		contributions: 100,
	},
];

const FALLBACK_COMMITS: Commit[] = [
	{
		sha: '000000',
		commit: {
			author: {
				name: 'IIUM Community',
				date: new Date().toISOString(),
			},
			message: 'Building awesome resources for IIUM',
		},
		html_url: 'https://github.com/IIUMstudent/Awesome-IIUM',
		author: {
			login: 'IIUMstudent',
			avatar_url: 'https://github.com/ghost.png',
		},
	},
];

const FALLBACK_PULLS: PullRequest[] = [];

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check rate limit from response headers
 */
function getRateLimitInfo(response: Response): RateLimitInfo | null {
	const remaining = response.headers.get('x-ratelimit-remaining');
	const reset = response.headers.get('x-ratelimit-reset');
	const limit = response.headers.get('x-ratelimit-limit');

	if (remaining && reset && limit) {
		return {
			remaining: Number.parseInt(remaining, 10),
			reset: Number.parseInt(reset, 10),
			limit: Number.parseInt(limit, 10),
		};
	}

	return null;
}

/**
 * Fetch with timeout, retry logic, and exponential backoff
 */
async function fetchWithRetry<T>(
	url: string,
	options: {
		timeout?: number;
		maxRetries?: number;
		baseDelay?: number;
	} = {},
): Promise<{ data: T | null; rateLimitInfo: RateLimitInfo | null }> {
	const {
		timeout = 5000, // 5 seconds
		maxRetries = 3,
		baseDelay = 1000, // Start with 1 second
	} = options;

	let lastError: Error | null = null;
	let rateLimitInfo: RateLimitInfo | null = null;

	for (let attempt = 0; attempt < maxRetries; attempt++) {
		try {
			// Create AbortController for timeout
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), timeout);

			// Add GitHub token if available (for higher rate limits)
			const headers: HeadersInit = {};
			if (import.meta.env.GITHUB_TOKEN) {
				headers.Authorization = `token ${import.meta.env.GITHUB_TOKEN}`;
			}

			const response = await fetch(url, {
				signal: controller.signal,
				headers,
			});

			clearTimeout(timeoutId);

			// Extract rate limit info
			rateLimitInfo = getRateLimitInfo(response);

			// Check if we're rate limited
			if (response.status === 403 && rateLimitInfo?.remaining === 0) {
				const resetTime = rateLimitInfo.reset * 1000;
				const waitTime = resetTime - Date.now();

				console.warn(
					`GitHub API rate limit exceeded. Resets at ${new Date(resetTime).toISOString()}`,
				);

				// If reset is soon (< 5 minutes), wait; otherwise, throw
				if (waitTime > 0 && waitTime < 300000) {
					await sleep(waitTime + 1000);
					continue; // Retry after waiting
				}

				throw new Error(
					`Rate limit exceeded. Try again after ${new Date(resetTime).toLocaleString()}`,
				);
			}

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			const data = await response.json();
			return { data, rateLimitInfo };
		} catch (error) {
			lastError = error instanceof Error ? error : new Error(String(error));

			// Don't retry on abort (timeout)
			if (lastError.name === 'AbortError') {
				console.error(`Request timeout after ${timeout}ms: ${url}`);
				break;
			}

			// Exponential backoff: 1s, 2s, 4s
			if (attempt < maxRetries - 1) {
				const delay = baseDelay * 2 ** attempt;
				console.warn(
					`Retry ${attempt + 1}/${maxRetries} after ${delay}ms for ${url}`,
				);
				await sleep(delay);
			}
		}
	}

	// All retries failed - capture error in production
	if (lastError && import.meta.env.PROD) {
		try {
			const { captureError } = await import('./sentry');
			captureError(lastError, {
				url,
				context: 'GitHub API fetch',
				maxRetries,
				timeout,
			});
		} catch {
			// Sentry import failed, continue without logging
		}
	}

	console.error(
		`Failed to fetch ${url} after ${maxRetries} attempts:`,
		lastError,
	);
	return { data: null, rateLimitInfo };
}

/**
 * Fetch and cache with fallback data
 */
async function fetchAndCache<T>(
	url: string,
	cache: Cache<T>,
	fallbackData: T,
): Promise<T> {
	const now = Date.now();

	// Return cached data if still fresh
	if (cache.data && cache.lastFetched && now - cache.lastFetched < TTL) {
		return cache.data;
	}

	// Fetch new data
	const { data, rateLimitInfo } = await fetchWithRetry<T>(url);

	// Log rate limit warnings if getting low
	if (rateLimitInfo && rateLimitInfo.remaining < 10) {
		console.warn(
			`GitHub API rate limit low: ${rateLimitInfo.remaining}/${rateLimitInfo.limit}`,
		);
	}

	if (data) {
		cache.data = data;
		cache.lastFetched = now;
		return data;
	}

	// If fetch fails, return stale cache or fallback data
	if (cache.data) {
		console.warn('Using stale cached data due to fetch failure');
		return cache.data;
	}

	console.warn('Using fallback data due to fetch failure');
	return fallbackData;
}

export async function getCachedContributors(perPage = 12) {
	const url = `https://api.github.com/repos/iiumstudent/Awesome-IIUM/contributors?per_page=${perPage}`;
<<<<<<< HEAD
	return fetchAndCache(url, contributorCache);
=======
	return fetchAndCache(url, contributorCache, FALLBACK_CONTRIBUTORS);
>>>>>>> 1edf593 (feat(tests): add comprehensive E2E and unit tests for GPA calculator, prayer times, search functionality, and status dashboard)
}

export async function getCachedCommits(perPage = 20) {
	const url = `https://api.github.com/repos/iiumstudent/Awesome-IIUM/commits?per_page=${perPage}`;
	return fetchAndCache(url, commitsCache, FALLBACK_COMMITS);
}

export async function getCachedPulls(perPage = 2) {
	const url = `https://api.github.com/repos/iiumstudent/Awesome-IIUM/pulls?state=all&per_page=${perPage}`;
<<<<<<< HEAD
	return fetchAndCache(url, pullsCache);
=======
	return fetchAndCache(url, pullsCache, FALLBACK_PULLS);
	return fetchAndCache(url, pullsCache, FALLBACK_PULLS);