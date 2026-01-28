## 2026-01-24 - StatusDashboard XSS Vulnerability

**Vulnerability:** Unsanitized data from internal API used in `innerHTML`
assignment in `StatusDashboard.astro`. **Learning:** Even internal data sources
(like `status.json`) should be treated as untrusted in client-side scripts to
prevent XSS if the source is compromised. **Prevention:** Always sanitize data
using an escape helper or use `textContent` / DOM creation methods instead of
`innerHTML`.

## 2026-01-27 - PrayerTimes External API XSS

**Vulnerability:** Unsanitized data from external API (aladhan.com) used in `innerHTML` in `PrayerTimes.astro`.
**Learning:** External APIs, even trusted ones, can be vectors for XSS if their response is injected directly into the DOM.
**Prevention:** Implement local `escapeHtml` helper in Astro client scripts and sanitize all dynamic data before using `innerHTML`.
