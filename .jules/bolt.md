## 2026-01-21 - [SSG for Static Data]
**Learning:** Client-side fetching for static data (like contributors) hurts LCP and requires layout shift handling. Astro components run at build time, making them perfect for pre-fetching this data.
**Action:** Prefer top-level await fetch in Astro frontmatter for data that doesn't change frequently.

## 2026-01-23 - [Lazy Load Heavy Scripts]
**Learning:** MapLibre GL JS (~200KB) was loading immediately on the "Tools" page even if the user didn't scroll to the map, causing unnecessary network weight.
**Action:** Use `IntersectionObserver` to lazy load heavy interactive libraries only when their container comes into view.
