# Accessibility Statement

**Last Updated:** February 4, 2026

Awesome IIUM is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.

---

## Conformance Status

Awesome IIUM **conforms to WCAG 2.1 Level AA** standards. This means:

- ✅ All interactive elements are keyboard accessible
- ✅ Color contrast ratios meet or exceed 4.5:1 for normal text
- ✅ All images have descriptive alternative text
- ✅ Proper semantic HTML structure throughout
- ✅ ARIA labels and landmarks implemented where appropriate
- ✅ Screen reader compatible

### Standards & Guidelines

We follow these accessibility standards:

- [Web Content Accessibility Guidelines (WCAG) 2.1](https://www.w3.org/WAI/WCAG21/quickref/) - Level AA
- [WAI-ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/)
- [Section 508 Standards](https://www.section508.gov/) (U.S. Federal)

---

## Accessibility Features

### 🎯 Navigation

- **Skip to Main Content**: Skip navigation link available on all pages (first Tab press)
- **Keyboard Navigation**: All interactive elements accessible via keyboard (Tab, Enter, Arrow keys)
- **Logical Tab Order**: Focus moves through page in a logical order
- **Focus Indicators**: Visible focus outlines on all interactive elements

### 🎨 Visual Design

- **Color Contrast**: All text meets WCAG AA standards (minimum 4.5:1 ratio)
- **Responsive Design**: Works on all screen sizes and orientations
- **Zoom Support**: Content readable and functional up to 200% zoom
- **Dark/Light Mode**: Respects user's system color scheme preference

### 🔤 Text & Content

- **Semantic HTML**: Proper heading hierarchy (H1 → H2 → H3)
- **Descriptive Links**: Link text clearly describes destination
- **Text Alternatives**: All images have descriptive alt text
- **Language Declaration**: HTML lang attribute set correctly (en, ms, ar, ja, zh)

### 📱 Interactive Elements

- **Form Labels**: All form inputs properly labeled
- **ARIA Labels**: Interactive widgets have appropriate ARIA attributes
- **Live Regions**: Dynamic content announces changes (aria-live)
- **Error Messages**: Clear, descriptive error messages for forms

### 🖱️ Input Methods

- **Mouse**: Full mouse/pointer support
- **Keyboard**: Complete keyboard navigation
- **Touch**: Touch-optimized for mobile devices
- **Screen Reader**: Compatible with NVDA, JAWS, VoiceOver

---

## Tested Assistive Technologies

Awesome IIUM has been tested with the following combinations:

### Screen Readers

| Screen Reader | Browser | OS | Status |
|--------------|---------|-----|--------|
| NVDA 2023+ | Firefox, Chrome | Windows | ✅ Compatible |
| JAWS 2023+ | Chrome, Edge | Windows | ✅ Compatible |
| VoiceOver | Safari | macOS, iOS | ✅ Compatible |
| TalkBack | Chrome | Android | ✅ Compatible |

### Browsers

- ✅ Chrome 120+
- ✅ Firefox 120+
- ✅ Safari 17+
- ✅ Edge 120+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## Automated Testing

We use automated accessibility testing tools in our CI/CD pipeline:

### Tools Used

- **[@axe-core/playwright](https://github.com/dequelabs/axe-core-npm)** - Automated WCAG 2.1 AA compliance testing
- **[Playwright](https://playwright.dev/)** - E2E testing with accessibility checks

### Test Coverage

```bash
# Run accessibility tests
pnpm test:a11y           # Axe-core + Playwright (13 tests)

# All E2E tests (includes 13 accessibility tests)
pnpm test:e2e            # 41 total tests

# View test results
pnpm exec playwright show-report
```

**Current Status:** All 41 E2E tests passing (including 13 dedicated accessibility tests)

---

## Known Issues

We continuously work to improve accessibility. Here are known limitations:

### Minor Issues

1. **Browser Compatibility**: Some older browsers may not support all modern accessibility features
   - **Workaround**: Use latest versions of Chrome, Firefox, Safari, or Edge
   - **Status**: Not planned (focus on modern browser support)

2. **Third-Party Content**: Some embedded content (GitHub API widgets, external maps) may have limited accessibility
   - **Workaround**: We've added ARIA labels and fallback content where possible
   - **Status**: Ongoing improvements

### Future Enhancements

- [ ] Add keyboard shortcuts guide in documentation
- [ ] Implement high contrast mode toggle
- [ ] Add text size adjustment controls
- [ ] Expand screen reader testing on Linux (Orca)

---

## Testing Methodology

### Automated Testing (CI/CD)

Every pull request and commit is automatically tested for accessibility:

1. **Build-time checks**: Lighthouse CI, axe-core
2. **E2E testing**: Playwright with axe-core integration
3. **Manual review**: Code reviews include accessibility checklist

### Manual Testing

Our manual testing process includes:

1. **Keyboard navigation**: Tab through all interactive elements
2. **Screen reader testing**: Test with NVDA (Windows) and VoiceOver (macOS)
3. **Zoom testing**: Verify readability at 200% browser zoom
4. **Color blindness**: Check with color blindness simulators
5. **Mobile testing**: Test on iOS and Android devices

### Checklist for Contributors

When contributing, please verify:

- [ ] All interactive elements are keyboard accessible
- [ ] Images have descriptive alt text
- [ ] Forms have proper labels
- [ ] Color contrast meets 4.5:1 ratio (use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/))
- [ ] Heading hierarchy is logical
- [ ] Links have descriptive text (avoid "click here")
- [ ] Dynamic content announced to screen readers

---

## How to Report Accessibility Issues

We take accessibility seriously and welcome your feedback.

### Reporting Process

1. **Check existing issues**: Search [GitHub Issues](https://github.com/iiumstudent/Awesome-IIUM/issues?q=is%3Aissue+label%3Aaccessibility)
2. **Open a new issue**: Use the accessibility issue template
3. **Provide details**:
   - Page URL where issue occurs
   - Your operating system and browser version
   - Assistive technology used (if applicable)
   - Steps to reproduce the issue
   - Expected vs. actual behavior

### Issue Labels

Use these labels when reporting:

- `accessibility` - General accessibility issues
- `a11y-critical` - Blocks access for users with disabilities
- `a11y-moderate` - Hinders access but workaround available
- `a11y-minor` - Improvement opportunity

### Response Timeline

- **Critical issues**: Response within 48 hours, fix within 7 days
- **Moderate issues**: Response within 5 days, fix within 30 days
- **Minor enhancements**: Response within 7 days, fix when possible

---

## Accessibility Roadmap

### ✅ Completed (Feb 2026)

- [x] WCAG 2.1 Level AA compliance
- [x] Color contrast fixes (all components)
- [x] ARIA labels implementation
- [x] Keyboard navigation support
- [x] Screen reader compatibility
- [x] Automated accessibility testing in CI

### 🚧 In Progress

- [ ] Comprehensive manual accessibility audit
- [ ] Screen reader user testing session
- [ ] Browser zoom testing up to 400%

### 📋 Future Plans

- [ ] WCAG 2.2 Level AAA conformance (where possible)
- [ ] Accessibility settings panel (font size, contrast)
- [ ] Accessibility documentation in multiple languages
- [ ] Regular accessibility audits (quarterly)

---

## Resources

### For Users

- [WebAIM: Web Accessibility In Mind](https://webaim.org/)
- [Screen Reader Keyboard Shortcuts](https://dequeuniversity.com/screenreaders/)
- [NVDA Download](https://www.nvaccess.org/download/) (Free Windows screen reader)

### For Contributors

- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [Inclusive Components](https://inclusive-components.design/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [MDN Accessibility Guide](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

### Testing Tools

- [axe DevTools](https://www.deque.com/axe/devtools/) (Browser extension)
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) (Built into Chrome)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

## Contact

For accessibility questions or concerns:

- **GitHub Issues**: [Report accessibility issue](https://github.com/iiumstudent/Awesome-IIUM/issues/new?labels=accessibility)
- **GitHub Discussions**: [Discuss accessibility](https://github.com/iiumstudent/Awesome-IIUM/discussions)
- **Email**: Create an issue first for tracking

---

## Legal

This accessibility statement is provided in good faith and for informational purposes. While we strive for WCAG 2.1 Level AA conformance, we acknowledge that no website is 100% accessible to all users. We are committed to continuous improvement and welcome feedback to help us achieve our accessibility goals.

**Framework**: Built with [Astro](https://astro.build/) and [Starlight](https://starlight.astro.build/), which follow accessibility best practices by default.

---

**Last Updated:** This statement is reviewed and updated regularly. Last review: February 4, 2026
