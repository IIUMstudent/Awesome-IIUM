## 2026-01-26 - [SRI for External Assets]
**Vulnerability:** External scripts and stylesheets loaded from CDNs (like unpkg) without Subresource Integrity (SRI) checks.
**Learning:** Without SRI, if the CDN is compromised or the file is replaced with a malicious version, users will execute arbitrary code. This is a supply chain vulnerability.
**Prevention:** Always calculate and include the `integrity` hash (e.g., sha384) and set `crossorigin="anonymous"` for any external assets (scripts/CSS) loaded from CDNs. This ensures the browser only executes the file if its hash matches the expected value.
