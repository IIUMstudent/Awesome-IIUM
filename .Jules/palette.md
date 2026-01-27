## 2025-05-15 - Dynamic Content Styling in Astro
**Learning:** Standard Astro scoped CSS does not apply to elements created dynamically via client-side JavaScript (e.g., `innerHTML`), causing broken layouts for interactive lists.
**Action:** Use nested global selectors (e.g., `.component-wrapper :global(.dynamic-element)`) to ensure styles target both static and dynamic content safely.
