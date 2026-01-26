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

## 2026-01-26 - Dynamic List Focus Management

**Learning:** When removing items from a dynamic list, focus is often lost to `document.body`. Furthermore, if the removal action leaves the list in a state where the removal button of the remaining item becomes disabled, standard focus management logic (focusing the "next" or "previous" button) fails because browsers prevent focusing disabled elements.
**Action:** Implement explicit focus management logic that accounts for element state changes. If the logical focus target becomes disabled (e.g., "Remove" button on the last remaining item), fallback to a nearby interactive element like the input field to maintain the user's context.
