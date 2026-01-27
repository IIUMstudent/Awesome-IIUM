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

## 2026-01-27 - Focus Management in Dynamic Lists

**Learning:** When a user deletes an item from a list using a button inside that item, the button is removed from the DOM, causing focus to reset to the document `<body>`. This forces keyboard users to navigate from the start of the page again.
**Action:** When removing an element, identify the most logical next focus target (e.g., the next item's remove button, or the previous one if at the end) *before* removal, and explicitly apply focus to it immediately after the element is removed.
