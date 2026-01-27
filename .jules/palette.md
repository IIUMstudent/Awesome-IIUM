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

## 2025-02-18 - Managing Focus in Dynamic Lists

**Learning:** When deleting an item from a list (like a row in a form), the focus is often lost to the `body` if the focused element (the delete button) is removed from the DOM. This breaks the keyboard navigation flow and forces users to tab through the entire document again to return to their context.
**Action:** Before removing an element, identify the logical next target for focus (e.g., the delete button of the next or previous item). Manually shift focus to this target immediately after removal to preserve the user's context and workflow.
