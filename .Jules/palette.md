## 2025-05-15 - Dynamic Content Styling in Astro
**Learning:** Standard Astro scoped CSS does not apply to elements created dynamically via client-side JavaScript (e.g., `innerHTML`), causing broken layouts for interactive lists.
**Action:** Use nested global selectors (e.g., `.component-wrapper :global(.dynamic-element)`) to ensure styles target both static and dynamic content safely.

## 2025-05-15 - Destructive Action Confirmation Pattern
**Learning:** For actions that wipe significant user data (like "Clear All"), a simple two-step confirmation on the button itself (changing text to "Confirm?") is less intrusive than a modal and prevents accidental data loss.
**Action:** Implement a stateful button that changes text/color on first click and executes on second click, with a timeout to reset if abandoned.
