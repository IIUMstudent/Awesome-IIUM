# Operations: Backup & Disaster Recovery

**Last Updated:** February 4, 2026  
**Scope:** Awesome IIUM (static site on GitHub Pages)

---

## Overview

Awesome IIUM is a static site hosted on GitHub Pages. The primary source of truth is the Git repository. Recovery is achieved by restoring the repository and re-deploying the site.

---

## Backup Strategy

### 1. Git Repository (Primary Backup)

- **Authoritative source:** GitHub repository history
- **Coverage:** All content, configuration, workflows, and assets
- **Redundancy:** Contributors and forks provide additional copies

### 2. Automated Exports (Optional)

- **GitHub repository export**: Can be generated via GitHub UI or API
- **Local clones**: Maintainers should keep a fresh local clone

---

## Disaster Recovery Scenarios

### Scenario A: GitHub Pages Outage

**Impact:** Site unavailable

**Mitigation:**

1. Check GitHub Status: <https://www.githubstatus.com/>
2. Post a status update via GitHub Issues or Discussions
3. Wait for GitHub Pages recovery (no data loss expected)

**Optional Fallback:**

- Rebuild and deploy to a temporary static host (e.g., Netlify) using the same `dist/` output.

---

### Scenario B: Repository Corruption or Loss

**Impact:** Code and content unavailable

**Recovery Steps:**

1. **Restore from fork or local clone**
   - Identify the most up-to-date fork
   - Create a new repository under IIUMstudent
2. **Re-establish GitHub Pages**
   - Enable Pages in repository settings
   - Set build and deployment from `master` (or updated branch)
3. **Reconfigure secrets**
   - `SENTRY_AUTH_TOKEN` (if used)
   - Any analytics or deployment secrets
4. **Run full build**
   - `pnpm install`
   - `pnpm build`
   - Deploy via GitHub Actions

---

### Scenario C: Broken Deployment

**Impact:** Build fails or site deployed with errors

**Recovery Steps:**

1. Revert to last known good commit
2. Re-run CI and deployment
3. Investigate failure in GitHub Actions logs
4. Patch and redeploy

---

## Restoration Checklist

- [ ] Confirm repository integrity
- [ ] Verify GitHub Actions workflows are active
- [ ] Ensure `pnpm-lock.yaml` is present
- [ ] Run `pnpm build` locally
- [ ] Validate site output in `dist/`
- [ ] Confirm `sitemap-index.xml` and `robots.txt` are generated
- [ ] Verify site on GitHub Pages

---

## Contact & Escalation

- **Primary contact:** Open a GitHub Issue
- **Urgent issues:** Use GitHub Discussions or reach maintainers via repository activity

---

## Testing Recovery

- **Quarterly drill:** Verify a clean clone can build and deploy
- **Post-incident:** Document lessons learned in CHANGELOG or an issue

---

**Maintainers:** @IIUMstudent
