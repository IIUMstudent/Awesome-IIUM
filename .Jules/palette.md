# Palette's Journal

## 2025-02-23 - Accessibility in Dynamic Lists
**Learning:** In dynamic lists (like a GPA calculator), placeholders are not sufficient labels. Screen readers need `aria-label` or `aria-labelledby`.
**Action:** Always add `aria-label` to inputs in dynamic rows, even if visually the context is clear.

## 2025-02-23 - Inline Feedback vs Alerts
**Learning:** `alert()` is disruptive. Users prefer subtle, non-blocking feedback (like a small text fade-in) for successful save actions.
**Action:** Replace `alert()` with inline status messages or toasts.
