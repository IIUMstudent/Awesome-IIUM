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

## 2025-05-23 - Focus Management in Dynamic Lists

**Learning:** When deleting elements from a dynamic list (like rows in a calculator), focus is often lost to the `<body>`, which is disorienting for keyboard users.
**Action:** Explicitly manage focus when removing elements. Calculate the target focus element (next sibling or previous sibling) *before* removing the current element, and apply `.focus()` to it immediately after removal. Also, ensure interactive elements like remove buttons have visible focus states (`:focus-visible`) so users can track their position.
