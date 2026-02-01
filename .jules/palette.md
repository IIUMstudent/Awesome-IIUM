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

## 2025-02-19 - Keyboard Shortcuts for Rapid Data Entry

**Learning:** In repetitive data entry forms (like course lists), users expect spreadsheet-like behavior where pressing 'Enter' commits the current row and immediately prepares the next one. Requiring a mouse click or multiple tabs to add a new row breaks the flow and increases friction.
**Action:** Implement a 'press Enter to add row' pattern for the last item in a dynamic list, and 'press Enter to navigate down' for middle items. This significantly improves speed and satisfaction for power users without affecting standard navigation.

## 2025-05-22 - MapLibre Marker Accessibility Overwrites

**Learning:** MapLibre GL JS markers implemented as DOM elements can lose custom accessibility attributes (like `aria-label`) during the library's initialization process when added to the map.
**Action:** When creating accessible map markers, explicitly set attributes like `aria-label` or `role` *after* the marker has been added to the map instance (or ensure the library's internal logic doesn't clobber them), and verify with a screen reader or inspector.
