## 2026-01-24 - StatusDashboard XSS Vulnerability

**Vulnerability:** Unsanitized data from internal API used in `innerHTML`
assignment in `StatusDashboard.astro`. **Learning:** Even internal data sources
(like `status.json`) should be treated as untrusted in client-side scripts to
prevent XSS if the source is compromised. **Prevention:** Always sanitize data
using an escape helper or use `textContent` / DOM creation methods instead of
`innerHTML`.
