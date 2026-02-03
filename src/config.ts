/**
 * Global configuration for Awesome IIUM
 */

export const GITHUB_REPO = {
	owner: 'iiumstudent',
	name: 'Awesome-IIUM',
	get fullName() {
		return `${this.owner}/${this.name}`;
	},
	get url() {
		return `https://github.com/${this.fullName}`;
	},
	get apiUrl() {
		return `https://api.github.com/repos/${this.fullName}`;
	},
};

export const SITE_CONFIG = {
	title: 'Awesome IIUM',
	description:
		'A curated list of resources for the International Islamic University Malaysia (IIUM) community',
	baseUrl: '/Awesome-IIUM',
	siteUrl: 'https://iiumstudent.github.io',
	get fullUrl() {
		return `${this.siteUrl}${this.baseUrl}`;
	},
};
