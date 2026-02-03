// src/utils/github.ts

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

async function fetchAndCache<T>(
	url: string,
	cache: Cache<T>,
): Promise<T | null> {
	const now = Date.now();
	if (cache.data && cache.lastFetched && now - cache.lastFetched < TTL) {
		return cache.data;
	}

	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Failed to fetch: ${response.statusText}`);
		}
		const data = await response.json();
		cache.data = data;
		cache.lastFetched = now;
		return data;
	} catch (error) {
		console.error(`Error fetching from ${url}:`, error);
		// If fetch fails, but we have stale data, return it to avoid breaking the UI
		return cache.data || null;
	}
}

export async function getCachedContributors(perPage = 12) {
	const url = `https://api.github.com/repos/iiumstudent/Awesome-IIUM/contributors?per_page=${perPage}`;
	return fetchAndCache(url, contributorCache);
}

export async function getCachedCommits(perPage = 20) {
	const url = `https://api.github.com/repos/iiumstudent/Awesome-IIUM/commits?per_page=${perPage}`;
	return fetchAndCache(url, commitsCache);
}

export async function getCachedPulls(perPage = 2) {
	const url = `https://api.github.com/repos/iiumstudent/Awesome-IIUM/pulls?state=all&per_page=${perPage}`;
	return fetchAndCache(url, pullsCache);
}
