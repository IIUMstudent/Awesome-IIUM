/**
 * Aladhan API Client
 *
 * Provides prayer times data from Aladhan.com API
 * with caching and error handling
 */

export interface Campus {
	name: string;
	city: string;
	lat: number;
	lng: number;
}

export interface PrayerTimings {
	Fajr: string;
	Sunrise: string;
	Dhuhr: string;
	Asr: string;
	Maghrib: string;
	Isha: string;
}

export interface HijriDate {
	day: string;
	month: {
		en: string;
		ar: string;
	};
	year: string;
}

export interface AladhanDate {
	hijri: HijriDate;
	gregorian: {
		date: string;
	};
}

export interface AladhanData {
	timings: PrayerTimings;
	date: AladhanDate;
}

export interface AladhanResponse {
	code: number;
	status: string;
	data: AladhanData;
}

/**
 * IIUM Campus locations
 */
export const CAMPUSES: Record<string, Campus> = {
	gombak: { name: 'Gombak', city: 'Gombak', lat: 3.2513, lng: 101.7313 },
	kuantan: { name: 'Kuantan', city: 'Kuantan', lat: 3.8077, lng: 103.326 },
	pagoh: { name: 'Pagoh', city: 'Pagoh', lat: 2.1494, lng: 102.7181 },
};

/**
 * Fetches prayer times from Aladhan API with caching
 *
 * @param campus Campus object with coordinates
 * @param date Date string in format DD-MM-YYYY
 * @param cacheKey Optional cache key for localStorage
 * @returns Prayer times data or null on error
 */
export async function fetchPrayerTimes(
	campus: Campus,
	date: string,
	cacheKey?: string,
): Promise<AladhanData | null> {
	// Check cache if key provided
	if (cacheKey) {
		try {
			const cached = localStorage.getItem(cacheKey);
			if (cached) {
				const data: AladhanResponse = JSON.parse(cached);
				if (data?.code === 200) {
					return data.data;
				}
			}
		} catch (e) {
			console.warn('[Aladhan] Cache read error:', e);
		}
	}

	// Fetch from API
	try {
		const url = buildApiUrl(campus, date);
		const res = await fetch(url);

		if (!res.ok) {
			throw new Error(`HTTP ${res.status}: ${res.statusText}`);
		}

		const data: AladhanResponse = await res.json();

		if (data.code === 200) {
			// Cache successful response
			if (cacheKey) {
				try {
					localStorage.setItem(cacheKey, JSON.stringify(data));
				} catch (e) {
					console.warn('[Aladhan] Cache write error:', e);
				}
			}

			return data.data;
		}

		console.error('[Aladhan] API error:', data);
		return null;
	} catch (e) {
		console.error('[Aladhan] Fetch failed:', e);
		return null;
	}
}

/**
 * Builds Aladhan API URL for prayer times
 *
 * Uses JAKIM calculation method (method=3) which is standard for Malaysia
 *
 * @param campus Campus with lat/lng coordinates
 * @param date Date string in DD-MM-YYYY format
 * @returns API URL string
 */
export function buildApiUrl(campus: Campus, date: string): string {
	const baseUrl = 'https://api.aladhan.com/v1/timings';
	return `${baseUrl}/${date}?latitude=${campus.lat}&longitude=${campus.lng}&method=3`;
}

/**
 * Formats current date as DD-MM-YYYY for Aladhan API
 *
 * @param date Optional date object (defaults to today)
 * @returns Date string in DD-MM-YYYY format
 */
export function formatDateForApi(date: Date = new Date()): string {
	const day = date.getDate();
	const month = date.getMonth() + 1; // 0-indexed
	const year = date.getFullYear();
	return `${day}-${month}-${year}`;
}

/**
 * Generates cache key for prayer times
 *
 * @param campusKey Campus identifier
 * @param date Date string
 * @returns Cache key string
 */
export function generateCacheKey(campusKey: string, date: string): string {
	return `iium-prayer-times-${campusKey}-${date}`;
}

/**
 * Formats Hijri date for display
 *
 * @param hijri Hijri date object from API
 * @returns Formatted string "DD Month YYYY AH"
 */
export function formatHijriDate(hijri: HijriDate): string {
	return `${hijri.day} ${hijri.month.en} ${hijri.year} AH`;
}

/**
 * Parses time string to hours and minutes
 *
 * @param timeString Time in format "HH:MM" or "HH:MM (TZ)"
 * @returns Object with hours, minutes, and totalMinutes
 */
export function parseTimeString(timeString: string): {
	hours: number;
	minutes: number;
	totalMinutes: number;
} {
	// Remove timezone info if present
	const time = timeString.split(' ')[0];
	const [hoursStr, minutesStr] = time.split(':');
	const hours = Number.parseInt(hoursStr, 10);
	const minutes = Number.parseInt(minutesStr, 10);

	return {
		hours,
		minutes,
		totalMinutes: hours * 60 + minutes,
	};
}

/**
 * Gets current time in minutes since midnight
 *
 * @param date Optional date object (defaults to now)
 * @returns Minutes since midnight
 */
export function getCurrentMinutes(date: Date = new Date()): number {
	return date.getHours() * 60 + date.getMinutes();
}

/**
 * Finds next prayer time from current time
 *
 * @param prayerTimes Array of prayer times with totalMinutes
 * @param currentMinutes Current time in minutes since midnight
 * @returns Next prayer object or first prayer (for next day)
 */
export function findNextPrayer<T extends { totalMinutes: number }>(
	prayerTimes: T[],
	currentMinutes: number,
): { prayer: T; isTomorrow: boolean } {
	for (const prayer of prayerTimes) {
		if (prayer.totalMinutes > currentMinutes) {
			return { prayer, isTomorrow: false };
		}
	}

	// If no prayer found today, next is first prayer tomorrow
	return { prayer: prayerTimes[0], isTomorrow: true };
}

/**
 * Calculates countdown to target prayer
 *
 * @param targetHours Target hour (24-hour format)
 * @param targetMinutes Target minute
 * @param isTomorrow Whether target is tomorrow
 * @param now Optional current time (defaults to now)
 * @returns Object with hours, minutes, seconds until prayer
 */
export function calculateCountdown(
	targetHours: number,
	targetMinutes: number,
	isTomorrow: boolean,
	now: Date = new Date(),
): { hours: number; minutes: number; seconds: number } | null {
	const targetTime = new Date();
	targetTime.setHours(targetHours, targetMinutes, 0, 0);

	if (isTomorrow) {
		targetTime.setDate(targetTime.getDate() + 1);
	}

	const diff = targetTime.getTime() - now.getTime();

	if (diff < 0) {
		return null; // Time passed, should refresh
	}

	const hours = Math.floor(diff / 3600000);
	const minutes = Math.floor((diff % 3600000) / 60000);
	const seconds = Math.floor((diff % 60000) / 1000);

	return { hours, minutes, seconds };
}

/**
 * Formats countdown for display
 *
 * @param countdown Countdown object with hours, minutes, seconds
 * @returns Formatted string "HH:MM:SS"
 */
export function formatCountdown(countdown: {
	hours: number;
	minutes: number;
	seconds: number;
}): string {
	const { hours, minutes, seconds } = countdown;
	return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
