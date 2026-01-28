## 2026-01-21 - [SSG for Static Data]
**Learning:** Client-side fetching for static data (like contributors) hurts LCP and requires layout shift handling. Astro components run at build time, making them perfect for pre-fetching this data.
**Action:** Prefer top-level await fetch in Astro frontmatter for data that doesn't change frequently.

## 2026-01-25 - [Lazy Loading Client Libraries]
**Learning:** Loading heavy libraries (like MapLibre) immediately on client-side hydration delays interaction for other elements, even if the component is below the fold.
**Action:** Use `IntersectionObserver` to defer library loading and initialization until the component approaches the viewport.

## 2026-01-27 - [SSG for Local Data]
**Learning:** Fetching local JSON files via client-side `fetch()` causes unnecessary layout shifts (CLS) and loading states.
**Action:** Use `node:fs` to read local data files at build time in Astro frontmatter for immediate rendering.
