import starlight from '@astrojs/starlight';
import sentry from '@sentry/astro';
import AstroPWA from '@vite-pwa/astro';
import { defineConfig } from 'astro/config';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
	site: 'https://iiumstudent.github.io',
	base: '/Awesome-IIUM',
	// Enable source maps for error debugging in production
	vite: {
		build: {
			sourcemap: true,
			minify: 'esbuild',
		},
		esbuild: {
			// Remove console.log, console.warn, console.info in production
			// Keep console.error for critical errors that need monitoring
			pure: process.env.NODE_ENV === 'production' 
				? ['console.log', 'console.warn', 'console.info'] 
				: [],
		},
		plugins: [
			// Bundle size visualizer - generates stats.html after build
			visualizer({
				filename: 'dist/stats.html',
				open: false,
				gzipSize: true,
				brotliSize: true,
			}),
		],
	},
	integrations: [
		// Sentry error tracking (optional, requires PUBLIC_SENTRY_DSN)
		sentry({
			enabled: !!process.env.PUBLIC_SENTRY_DSN,
			dsn: process.env.PUBLIC_SENTRY_DSN,
			environment: process.env.NODE_ENV || 'production',
			release: process.env.SENTRY_RELEASE,
			sourceMapsUploadOptions: {
				enabled: !!process.env.SENTRY_AUTH_TOKEN,
				authToken: process.env.SENTRY_AUTH_TOKEN,
				org: process.env.SENTRY_ORG,
				project: process.env.SENTRY_PROJECT,
			},
		}),
		starlight({
			title: 'Awesome IIUM',
			description:
				'A curated list of resources for the International Islamic University Malaysia (IIUM) community.',
			head: [
				{
					tag: 'meta',
					attrs: {
						name: 'theme-color',
						content: '#ffffff',
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'description',
						content:
							'A curated list of resources, tools, and guides for the IIUM community.',
					},
				},
				{
					tag: 'meta',
					attrs: {
						property: 'og:title',
						content: 'Awesome IIUM',
					},
				},
				{
					tag: 'meta',
					attrs: {
						property: 'og:description',
						content:
							'A curated list of resources, tools, and guides for the IIUM community.',
					},
				},
				{
					tag: 'meta',
					attrs: {
						property: 'og:type',
						content: 'website',
					},
				},
				{
					tag: 'meta',
					attrs: {
						property: 'og:url',
						content: 'https://iiumstudent.github.io/Awesome-IIUM/',
					},
				},
				{
					tag: 'meta',
					attrs: {
						property: 'og:image',
						content: 'https://iiumstudent.github.io/Awesome-IIUM/logo.png',
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'twitter:card',
						content: 'summary_large_image',
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'twitter:title',
						content: 'Awesome IIUM',
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'twitter:description',
						content:
							'A curated list of resources, tools, and guides for the IIUM community.',
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'twitter:image',
						content: 'https://iiumstudent.github.io/Awesome-IIUM/logo.png',
					},
				},
				{
					tag: 'script',
					attrs: {
						type: 'application/ld+json',
					},
					content: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'WebSite',
						name: 'Awesome IIUM',
						url: 'https://iiumstudent.github.io/Awesome-IIUM/',
						description:
							'A curated list of resources, tools, and guides for the IIUM community.',
						publisher: {
							'@type': 'Organization',
							name: 'IIUMstudent',
							url: 'https://github.com/iiumstudent',
						},
					}),
				},
				{
					tag: 'script',
					attrs: {
						src: '/Awesome-IIUM/pwa-register.js',
						defer: true,
					},
				},
				// GoatCounter - Privacy-first analytics (free for open source)
				{
					tag: 'script',
					attrs: {
						'data-goatcounter': 'https://2217441.goatcounter.com/count',
						src: '//gc.zgo.at/count.js',
						async: true,
					},
				},
			],
			logo: {
				src: './src/assets/logo.png',
			},
			social: [
				{
					label: 'GitHub',
					href: 'https://github.com/iiumstudent/Awesome-IIUM',
					icon: 'github',
				},
			],
			defaultLocale: 'root',
			locales: {
				root: { label: 'English', lang: 'en' },
				ar: { label: 'العربية', lang: 'ar', dir: 'rtl' },
				ja: { label: '日本語', lang: 'ja' },
				ms: { label: 'Bahasa Melayu', lang: 'ms' },
				zh: { label: '中文', lang: 'zh-CN' },
			},
			sidebar: [
				{ label: 'Welcome', link: '/' },
				{ label: '📊 Dashboard', link: '/dashboard' },
				{ label: '🛠 Tools', link: '/tools' },
				{
					label: 'Categories',
					autogenerate: { directory: 'categories' },
				},
				{
					label: 'About',
					items: [
						{ label: 'Contributing', link: '/about/contributing' },
						{ label: 'Code of Conduct', link: '/about/code-of-conduct' },
						{ label: 'License', link: '/about/license' },
					],
				},
			],
			customCss: ['./src/styles/custom.css'],
			components: {
				Footer: './src/components/Giscus.astro',
			},
		}),
		AstroPWA({
			registerType: 'autoUpdate',
			manifest: {
				name: 'Awesome IIUM',
				short_name: 'AwesomeIIUM',
				description: 'The Ultimate Student Platform for IIUM',
				theme_color: '#ffffff',
				background_color: '#ffffff',
				display: 'standalone',
				icons: [
					{
						src: '/Awesome-IIUM/logo.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: '/Awesome-IIUM/logo.png',
						sizes: '512x512',
						type: 'image/png',
					},
				],
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,json}'],
				navigateFallback: '/Awesome-IIUM/',
			},
		}),
	],
});
