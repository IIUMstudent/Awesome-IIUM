## 2026-01-23 - DOM XSS in StatusDashboard
**Vulnerability:** The `StatusDashboard.astro` component used `innerHTML` to render status updates from an API endpoint without sanitizing the input. This could allow an attacker to inject malicious scripts if the API response was compromised.
**Learning:** Even internal or "trusted" APIs should be treated as untrusted sources when rendering data into the DOM.
**Prevention:** Always use output encoding/sanitization (e.g., `escapeHtml` helper) when using `innerHTML`, or prefer safer alternatives like `textContent` or framework-specific binding that handles escaping automatically.
