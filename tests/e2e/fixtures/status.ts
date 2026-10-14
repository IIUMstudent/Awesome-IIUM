import type { Page } from '@playwright/test';

/**
 * Fixed system status so dashboard tests don't depend on the deploy job
 * having written public/api/status.json.
 */
export const statusResponse = [
	{
		name: "i-Ma'luum",
		status: 'online',
		timestamp: '2026-01-01T00:00:00Z',
	},
	{
		name: "i-Ta'leem",
		status: 'offline',
		timestamp: '2026-01-01T00:00:00Z',
	},
];

export async function mockStatus(page: Page) {
	await page.route('**/api/status.json', (route) =>
		route.fulfill({ json: statusResponse }),
	);
}
