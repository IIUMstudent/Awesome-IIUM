## 2024-05-22 - Invisible Form Labels in Dynamic Tables

**Learning:** Table-like form layouts often omit visible labels for individual
inputs to save space, relying on column headers or implicit context. This
creates a severe accessibility barrier for screen reader users who lose context
when navigating individual fields. **Action:** Always ensure inputs in
table-like structures have explicit `aria-label` attributes (e.g.,
`aria-label="Course Name"`) even if they visually align with a header,
especially in dynamically generated rows where structure might be less obvious.

## 2026-01-22 - Replacing Alerts with Inline Feedback

**Learning:** Native `alert()` dialogs are disruptive and create a poor user experience by blocking the entire browser interface. For simple confirmations like "Data saved", inline feedback on the trigger element itself is far more effective.
**Action:** Replace `alert()` calls with a temporary state change on the triggering button (e.g., changing text to "✅ Saved!", disabling the button) that automatically reverts after a short delay (e.g., 2000ms). This provides clear confirmation without interrupting the user's workflow.

## 2025-05-27 - Focus Management in Dynamic Lists

**Learning:** When removing an item from a dynamic list (like a row in a table), the browser's default behavior is to reset focus to the `<body>` if the focused element is removed. This completely disrupts keyboard navigation, forcing the user to tab through the entire page again.
**Action:** Always manually manage focus when deleting elements. Calculate the logical next target (next item, previous item, or a parent "add" button) *before* removal, and explicitly `.focus()` it immediately after the element is removed from the DOM.
