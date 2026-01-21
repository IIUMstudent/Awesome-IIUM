## 2026-01-21 - [SSG for Static Data]
**Learning:** Client-side fetching for static data (like contributors) hurts LCP and requires layout shift handling. Astro components run at build time, making them perfect for pre-fetching this data.
**Action:** Prefer top-level await fetch in Astro frontmatter for data that doesn't change frequently.
