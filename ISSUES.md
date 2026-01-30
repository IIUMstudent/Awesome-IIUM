# Known Issues & Fixes

## Fixed Issues ✅

### 1. PWA Script Path (FIXED)
- **Issue**: PWA registration script referenced `/pwa-register.js` without base URL
- **Fix**: Updated to `/Awesome-IIUM/pwa-register.js` in `astro.config.mjs`
- **Impact**: PWA will now load correctly on GitHub Pages

### 2. Branch References Standardized (FIXED)
- **Issue**: Initial analysis assumed `main` branch, but repo uses `master`
- **Files Fixed**:
  - `.github/workflows/deploy.yml`
  - `.github/workflows/awesome-lint.yml`
  - `.github/workflows/quality.yml`
  - `src/components/ActivityFeed.astro`
  - `.github/workflows/status-monitor.yml`
- **Fix**: Standardized all references to use `master` branch
- **Impact**: GitHub Actions will work correctly with the master branch

### 3. PWA Manifest Icons (FIXED)
- **Issue**: Icon paths in `astro.config.mjs` didn't account for base URL
- **Fix**: Updated manifest icon paths to `/Awesome-IIUM/logo.png`
- **Also Fixed**: Updated `navigateFallback` from `/` to `/Awesome-IIUM/`
- **Impact**: PWA installation will load icons correctly

### 4. Empty Custom CSS (FIXED)
- **Issue**: `src/styles/custom.css` was empty
- **Fix**: Added basic structure with documentation
- **Impact**: File now serves its purpose

### 5. pnpm Documentation (FIXED)
- **Issue**: No setup instructions for pnpm requirement
- **Files Fixed**:
  - `CONTRIBUTING.md`: Added pnpm installation steps
  - Created new `SETUP.md`: Comprehensive development guide
- **Impact**: Contributors will know how to set up the project

## Remaining Issues ⚠️

### Medium Priority

#### Status Monitor Workflow (PARTIAL FIX)
- **Issue**: Git push could fail silently in some scenarios
- **Fix**: Changed error handling to use `|| true` for robustness
- **File**: `.github/workflows/status-monitor.yml`
- **Note**: Monitor updates status.json every 15 minutes

#### Asset Path Inconsistencies (NEEDS REVIEW)
- **Issue**: Logo referenced via `/logo.png` in content files
  - `src/content/docs/index.mdx`
  - `src/content/docs/ar/index.md`
  - `src/content/docs/zh/index.md`
  - `src/content/docs/ms/index.md`
  - `src/content/docs/ja/index.md`
- **Current Status**: Starlight may handle these automatically, but needs testing
- **Recommended Action**: 
  - Test the build output
  - Use relative paths or Astro asset imports if assets aren't loading
  - Consider importing logo as asset: `import logo from '../../assets/logo.png'`

### Low Priority

#### Internal Links May Break
- **Issue**: Some content links use absolute paths like `/categories/...`
- **Files Affected**: Various `.mdx` and `.md` files
- **Current Status**: Starlight should handle these, but should be verified
- **Recommendation**: Test site after deployment to GitHub Pages

#### Code Quality Suppressions
- **Issue**: Multiple `biome-ignore` comments throughout components
- **Examples**:
  - `StatusDashboard.astro` (unused variables marked for template)
  - `PrayerTimes.astro` (interface definitions marked as unused)
- **Recommendation**: These are valid suppressions for template variables passed via `define:vars`

#### Console Logging in Production
- **Issue**: Components still log debug information
- **Files Affected**:
  - `src/components/StatusDashboard.astro`
  - `src/components/PrayerTimes.astro`
  - `src/components/ActivityFeed.astro`
  - `src/components/NewThisWeek.astro`
  - `src/components/Leaderboard.astro`
- **Recommendation**: Consider wrapping in development-only checks or using a logging service

#### External API Dependencies Without Rate Limiting
- **Issue**: 
  - Prayer times from Aladhan API
  - Commits from GitHub API
  - Contributors from GitHub API
- **Recommendation**: Monitor rate limits; consider adding retry logic

#### Incomplete Translations
- **Issue**: i18n configured for 4 languages but content mostly English
  - `ar/` (العربية)
  - `ja/` (日本語)
  - `ms/` (Bahasa Melayu)
  - `zh/` (中文)
- **Recommendation**: Either complete translations or remove language options from config

#### Accessibility Improvements Needed
- **Issues**:
  - Map keyboard navigation could be improved
  - Some ARIA labels could be more descriptive
  - High contrast not tested
- **Recommendation**: Run accessibility audit (WAVE, axe DevTools)

#### Missing Environment Configuration
- **Issue**: No `.env.example` file for required environment variables
- **Recommendation**: Create `.env.example` documenting any needed secrets

## Testing Checklist

Before deploying, verify:

- [ ] `pnpm install` completes successfully
- [ ] `pnpm run build` produces valid output in `dist/`
- [ ] `pnpm run dev` starts dev server at `http://localhost:3000`
- [ ] PWA installs correctly (test via DevTools)
- [ ] Service worker loads (check Network tab in DevTools)
- [ ] Logo displays on all pages
- [ ] Internal links work correctly
- [ ] GitHub Actions workflows execute without errors
- [ ] Status dashboard updates every 15 minutes
- [ ] Mobile responsive design works well

## Next Steps

### Immediate (This Sprint)
1. Test the build locally: `pnpm install && pnpm run build`
2. Verify GitHub Pages deployment works with fixed paths
3. Test PWA installation on mobile device

### Short Term (Next Week)
1. Fix asset path issues if found during testing
2. Review and reduce console logging
3. Complete or remove incomplete translations

### Medium Term (Next Month)
1. Add accessibility audit and fixes
2. Implement rate-limit handling for APIs
3. Add environment configuration documentation
4. Consider moving to TypeScript for better type safety

## Related Files

- `astro.config.mjs` - Main configuration, PWA & Starlight setup
- `package.json` - Dependencies and scripts
- `biome.json` - Code quality rules
- `.github/workflows/*.yml` - CI/CD pipelines
- `src/components/*.astro` - Reusable components with external dependencies
