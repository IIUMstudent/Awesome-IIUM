import starlight from '@astrojs/starlight';
import AstroPWA from '@vite-pwa/astro';
import { defineConfig } from 'astro/config';

export default defineConfig({
	site: 'https://iiumstudent.github.io',
	base: '/Awesome-IIUM',
	integrations: [
		starlight({
			title: 'Awesome IIUM',
			description:
				'A curated list of resources for the International Islamic University Malaysia (IIUM) community.',
			head: [
				{
					tag: 'link',
					attrs: {
						rel: 'manifest',
						href: '/manifest.webmanifest',
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'theme-color',
						content: '#ffffff',
					},
				},
				{
					tag: 'script',
					attrs: {
						src: '/pwa-register.js',
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
						src: '/logo.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: '/logo.png',
						sizes: '512x512',
						type: 'image/png',
					},
				],
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,json}'],
				navigateFallback: '/',
			},
		}),
	],
});
