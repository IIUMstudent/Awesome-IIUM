## 2026-01-21 - [SSG for Static Data]
**Learning:** Client-side fetching for static data (like contributors) hurts LCP and requires layout shift handling. Astro components run at build time, making them perfect for pre-fetching this data.
**Action:** Prefer top-level await fetch in Astro frontmatter for data that doesn't change frequently.

## 2026-01-24 - [SSG for Local API]
**Learning:** `public/api/status.json` can be read at build time using `node:fs` to pre-render "client-side" dashboards. This eliminates LCP delay and CLS.
**Action:** For any component fetching local static JSON, implement SSG initial render + client-side hydration/polling.
