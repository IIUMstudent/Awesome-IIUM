#!/usr/bin/env node
/**
 * Regenerates the image files made from the logo, after a change to
 * src/assets/logo.svg or the colours in DESIGN.md:
 *
 * - public/logo.svg       favicon
 * - public/logo.png       512px app icon (PWA, Apple touch icon)
 * - public/icon-192.png   192px app icon (PWA)
 * - public/og.png         1200x630 link preview (WhatsApp, Telegram, X, ...)
 *
 *   pnpm brand:assets
 *
 * The link preview is rendered by Playwright's Chromium so it can use the
 * site's heading font. Set CHROMIUM_PATH to use a Chromium that is already
 * installed instead of the one `playwright install chromium` downloads.
 */

import { copyFileSync, readFileSync } from 'node:fs';
import { chromium } from '@playwright/test';
import sharp from 'sharp';

const logo = 'src/assets/logo.svg';

copyFileSync(logo, 'public/logo.svg');
for (const [size, file] of [
	[512, 'public/logo.png'],
	[192, 'public/icon-192.png'],
]) {
	await sharp(logo, { density: 1200 }).resize(size).png().toFile(file);
}

const font = readFileSync(
	'node_modules/@fontsource/arvo/files/arvo-latin-700-normal.woff2',
).toString('base64');
const svg = readFileSync(logo, 'utf8');

const html = `<!doctype html>
<html><head><meta charset="utf-8"><style>
  @font-face { font-family: Arvo; font-weight: 700; src: url(data:font/woff2;base64,${font}) format('woff2'); }
  html, body { margin: 0; }
  body {
    width: 1200px; height: 630px; box-sizing: border-box; padding: 80px 88px;
    display: flex; flex-direction: column; justify-content: space-between;
    background: linear-gradient(135deg, #003836 0%, #00706d 100%);
    color: #ffffff; font-family: 'Segoe UI', Roboto, 'Noto Sans', 'DejaVu Sans', sans-serif;
  }
  .brand { display: flex; align-items: center; gap: 48px; }
  .brand svg { width: 200px; height: 200px; flex: none; border-radius: 44px; box-shadow: 0 12px 40px rgba(0,0,0,.35); }
  h1 { font-family: Arvo, serif; font-size: 104px; line-height: 1; margin: 0 0 24px; letter-spacing: -1px; }
  .rule { width: 160px; height: 8px; background: #d59f0f; border-radius: 4px; margin-bottom: 24px; }
  p { margin: 0; font-size: 36px; line-height: 1.3; color: #d6f0ef; }
  footer { display: flex; justify-content: space-between; font-size: 26px; color: #d6f0ef; }
</style></head><body>
  <div class="brand">${svg}<div>
    <h1>Awesome IIUM</h1><div class="rule"></div>
    <p>Resources, tools and guides for the IIUM community</p>
  </div></div>
  <footer><span>iiumstudent.github.io/Awesome-IIUM</span><span>Student-run · not an official IIUM site</span></footer>
</body></html>`;

const browser = await chromium.launch({
	executablePath: process.env.CHROMIUM_PATH || undefined,
});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: 'public/og.png' });
await browser.close();

console.log('Wrote public/logo.svg, logo.png, icon-192.png and og.png');
