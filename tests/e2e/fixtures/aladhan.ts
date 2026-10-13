import type { Page } from '@playwright/test';

/**
 * Fixed Aladhan API response so prayer times tests don't depend on the
 * live API being reachable.
 */
export const aladhanResponse = {
	code: 200,
	status: 'OK',
	data: {
		timings: {
			Fajr: '05:45',
			Sunrise: '07:00',
			Dhuhr: '13:05',
			Asr: '16:20',
			Sunset: '19:08',
			Maghrib: '19:08',
			Isha: '20:18',
		},
		date: {
			hijri: { day: '20', month: { en: 'Rabīʿ al-thānī' }, year: '1448' },
		},
	},
};

export async function mockAladhan(page: Page, delayMs = 0) {
	await page.route('**/api.aladhan.com/v1/timings/**', async (route) => {
		if (delayMs) await new Promise((resolve) => setTimeout(resolve, delayMs));
		await route.fulfill({ json: aladhanResponse });
	});
}
