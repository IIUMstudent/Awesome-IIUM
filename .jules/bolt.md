## 2026-01-22 - Build Artifacts Tracking
**Learning:** The `dist/` directory was tracked in git despite being a build artifact. This caused massive diffs and suppressed tool outputs during verification.
**Action:** Always check `git status` or `git ls-files` for build artifacts and use `git rm --cached -r <dir>` to remove them from the index if found.
