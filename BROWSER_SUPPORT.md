# Browser Support Matrix

**Last Updated:** February 4, 2026  
**Target Compliance:** WCAG 2.1 AA

---

## Supported Browsers

The site is built with Astro and ships standards-based HTML, CSS, and vanilla JS. The matrix below reflects browsers with active testing or broad compatibility guarantees.

| Browser | Minimum Version | Support Level | Notes |
|---------|------------------|---------------|-------|
| Chrome | Latest 2 versions | ✅ Full | Primary development browser |
| Edge (Chromium) | Latest 2 versions | ✅ Full | Same engine as Chrome |
| Firefox | Latest 2 versions + ESR | ✅ Full | ESR supported for university environments |
| Safari (macOS) | 15.4+ | ✅ Full | Required for modern CSS and Web APIs |
| Safari (iOS) | 15.4+ | ✅ Full | iOS WebKit alignment |
| Android Chrome | Latest 2 versions | ✅ Full | Primary Android target |
| Samsung Internet | 19+ | ✅ Best effort | No formal test suite |

---

## Feature Compatibility Notes

### Interactive Components

| Component | Requirement | Compatibility Note |
|-----------|------------|-------------------|
| CampusMap | WebGL | Requires WebGL support; older devices may show fallback state |
| Giscus Comments | Third-party script | Requires access to `giscus.app` and GitHub Discussions |
| PrayerTimes | Fetch API + localStorage | Supported in all modern browsers |
| GPA Calculator | ES2017+ | No external dependencies |

### Progressive Web App (PWA)

| Feature | Support | Notes |
|---------|---------|-------|
| Service Worker | ✅ Modern browsers | Not supported on older Safari versions |
| Add to Home Screen | ✅ iOS/Android | iOS requires manual install prompt |
| Offline Cache | ✅ Modern browsers | Cached pages only, dynamic data not guaranteed |

---

## Known Limitations

- **MapLibre GL**: Requires WebGL; fails gracefully on older or restricted devices.
- **Giscus**: Uses GitHub Discussions; blocked in environments that disallow third-party scripts.
- **Older Safari (< 15.4)**: Some CSS features (e.g., `:focus-visible`) may not render as intended.

---

## Testing Approach

### Manual Testing (Quarterly)

- Chrome (latest)
- Firefox (latest + ESR)
- Safari (latest macOS + iOS)
- Edge (latest)
- Android Chrome (latest)

### Automated Tests

- Playwright E2E on Chromium, Firefox, WebKit
- Accessibility tests (@axe-core/playwright)
- Lighthouse CI performance and accessibility

---

## Reporting Compatibility Issues

If you encounter a browser-specific bug:

1. Open an issue with:
   - Browser + version
   - OS + version
   - URL and steps to reproduce
   - Screenshot or console error (if possible)
2. Add the label: `browser-compatibility`

---

## Update Policy

- **Support updates quarterly** or when browser usage shifts significantly.
- **Dropped support** will be communicated in the CHANGELOG.

---

**Maintainers:** @IIUMstudent
