import { readdirSync } from 'node:fs';
import sitemap from '@astrojs/sitemap';
import starlight from '@astrojs/starlight';
import AstroPWA from '@vite-pwa/astro';
import { defineConfig } from 'astro/config';
import { visualizer } from 'rollup-plugin-visualizer';
import {
	isIndexableUrl,
	LOCALES,
	SITE,
	slugFromFilePath,
	websiteJsonLd,
} from './src/utils/seo.ts';

// Content ids of the pages that have a real translation, e.g. `ms`.
const translatedIds = new Set(
	Object.keys(LOCALES)
		.filter((locale) => locale !== 'root')
		.flatMap((locale) =>
			readdirSync(new URL(`./src/content/docs/${locale}`, import.meta.url), {
				recursive: true,
			})
				.filter((file) => /\.mdx?$/.test(file))
				.map((file) =>
					slugFromFilePath(`${locale}/${file.replaceAll('\\', '/')}`),
				),
		),
);

// Search engine ownership checks (MAINTAINING.md). The codes are public; a
// repository variable overrides the one here.
const siteVerification = [
	[
		'google-site-verification',
		process.env.GOOGLE_SITE_VERIFICATION ||
			'CYWtroYbk9hzcAP_WC9w-uNvy-KFOvC3P9xjv3fo9Ds',
	],
	['msvalidate.01', process.env.BING_SITE_VERIFICATION],
	['yandex-verification', process.env.YANDEX_SITE_VERIFICATION],
]
	.filter(([, content]) => content)
	.map(([name, content]) => ({ tag: 'meta', attrs: { name, content } }));

export default defineConfig({
	site: 'https://iiumstudent.github.io',
	base: '/Awesome-IIUM',
	// Pages that moved, so old links and search results keep working.
	redirects: {
		'/categories/academics/klm': '/Awesome-IIUM/categories/academics/kstcl/',
		'/categories/campus-life/kuliyyah':
			'/Awesome-IIUM/categories/academics/#-colleges-kulliyyahs',
	},
	// Enable source maps for error debugging in production
	vite: {
		build: {
			sourcemap: true,
			minify: 'esbuild',
		},
		esbuild: {
			// Remove console.log, console.warn, console.info in production
			// Keep console.error for critical errors that need monitoring
			pure:
				process.env.NODE_ENV === 'production'
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
		// Starlight adds its own sitemap unless one is already here. This one
		// leaves out the English copies of pages that have no translation.
		sitemap({
			i18n: {
				defaultLocale: 'root',
				locales: Object.fromEntries(
					Object.entries(LOCALES).map(([key, { lang }]) => [key, lang]),
				),
			},
			filter: (url) => isIndexableUrl(url, translatedIds),
		}),
		starlight({
			title: SITE.name,
			description: SITE.description,
			// Per-page titles, canonicals, hreflang and structured data.
			routeMiddleware: './src/routeMiddleware.ts',
			head: [
				// GitHub Pages can't send security headers, so they go in meta tags.
				// 'unsafe-inline' is needed for Astro's inline scripts and styles.
				{
					tag: 'meta',
					attrs: {
						'http-equiv': 'Content-Security-Policy',
						content: [
							"default-src 'self'",
							"script-src 'self' 'unsafe-inline' https://gc.zgo.at https://unpkg.com",
							"style-src 'self' 'unsafe-inline' https://unpkg.com",
							"img-src 'self' data: blob: https:",
							"font-src 'self' data:",
							"connect-src 'self' https://api.github.com https://api.aladhan.com https://*.goatcounter.com https://tile.openstreetmap.org",
							"worker-src 'self' blob:",
							'frame-src https://www.openstreetmap.org',
							"object-src 'none'",
							"base-uri 'self'",
							"form-action 'self'",
						].join('; '),
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'referrer',
						content: 'strict-origin-when-cross-origin',
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'theme-color',
						content: '#00918e', // IIUM turquoise, see DESIGN.md
					},
				},
				...siteVerification,
				// Description, title and URL tags come from each page; the
				// preview image is the same everywhere.
				{
					tag: 'meta',
					attrs: { property: 'og:image', content: SITE.image },
				},
				{ tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
				{ tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
				{
					tag: 'meta',
					attrs: { property: 'og:image:alt', content: SITE.imageAlt },
				},
				{
					tag: 'meta',
					attrs: { name: 'twitter:image', content: SITE.image },
				},
				{
					tag: 'meta',
					attrs: { name: 'twitter:image:alt', content: SITE.imageAlt },
				},
				{
					tag: 'link',
					attrs: { rel: 'apple-touch-icon', href: '/Awesome-IIUM/logo.png' },
				},
				{
					tag: 'script',
					attrs: { type: 'application/ld+json' },
					content: JSON.stringify(websiteJsonLd()),
				},
				{
					tag: 'script',
					attrs: {
						src: '/Awesome-IIUM/pwa-register.js',
						defer: true,
					},
				},
				// GoatCounter - Privacy-first analytics (free for open source).
				// Set the GOATCOUNTER_ENDPOINT repository variable to move it.
				{
					tag: 'script',
					attrs: {
						'data-goatcounter':
							process.env.GOATCOUNTER_ENDPOINT ||
							'https://2217441.goatcounter.com/count',
						src: 'https://gc.zgo.at/count.js',
						async: true,
					},
				},
			],
			favicon: '/logo.svg',
			logo: {
				src: './src/assets/logo.svg',
				alt: '',
			},
			social: [
				{
					label: 'GitHub',
					href: 'https://github.com/iiumstudent/Awesome-IIUM',
					icon: 'github',
				},
			],
			defaultLocale: 'root',
			locales: LOCALES,
			sidebar: [
				{ label: 'Welcome', link: '/' },
				{ label: '📊 Dashboard', link: '/dashboard' },
				{ label: '🛠 Tools', link: '/tools' },
				{
					label: 'Categories',
					items: [{ autogenerate: { directory: 'categories' } }],
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
			// Theme and design rules: DESIGN.md
			customCss: ['@fontsource/arvo/latin-700.css', './src/styles/custom.css'],
			components: {
				Footer: './src/components/Footer.astro',
			},
		}),
		AstroPWA({
			registerType: 'autoUpdate',
			manifest: {
				name: 'Awesome IIUM',
				short_name: 'AwesomeIIUM',
				description: SITE.description,
				lang: 'en',
				categories: ['education', 'reference'],
				theme_color: '#00918e',
				background_color: '#ffffff',
				display: 'standalone',
				icons: [
					{
						src: '/Awesome-IIUM/icon-192.png',
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
			// Pages and data come from the network first, so a deploy shows up on
			// the next load; the cache is only used offline. Precaching HTML
			// served every page cache-first, so visitors saw the previous deploy.
			workbox: {
				globPatterns: ['**/*.{js,css,ico,png,svg,webp,woff2}'],
				navigateFallback: null,
				runtimeCaching: [
					{
						urlPattern: ({ request }) => request.mode === 'navigate',
						handler: 'NetworkFirst',
						options: {
							cacheName: 'pages',
							networkTimeoutSeconds: 5,
							expiration: { maxEntries: 100 },
							plugins: [
								{
									// Offline on a page never visited: show the cached home page.
									handlerDidError: () =>
										caches.match('/Awesome-IIUM/', { cacheName: 'pages' }),
								},
							],
						},
					},
					{
						urlPattern: ({ url }) => url.pathname.endsWith('.json'),
						handler: 'NetworkFirst',
						options: {
							cacheName: 'data',
							networkTimeoutSeconds: 5,
							expiration: { maxEntries: 20 },
						},
					},
				],
			},
		}),
	],
});
