## 2024-05-22 - Invisible Form Labels in Dynamic Tables

**Learning:** Table-like form layouts often omit visible labels for individual
inputs to save space, relying on column headers or implicit context. This
creates a severe accessibility barrier for screen reader users who lose context
when navigating individual fields. **Action:** Always ensure inputs in
table-like structures have explicit `aria-label` attributes (e.g.,
`aria-label="Course Name"`) even if they visually align with a header,
especially in dynamically generated rows where structure might be less obvious.

## 2024-05-23 - Non-Blocking Save Feedback

**Learning:** Blocking alerts (`window.alert`) for confirmation messages disrupt user flow and feel antiquated. Users expect immediate, inline feedback for successful actions like saving.
**Action:** Replace success alerts with temporary button state changes (e.g., changing text to "✅ Saved!" and disabling the button for 2 seconds). This provides confirmation without requiring user interaction to dismiss.
