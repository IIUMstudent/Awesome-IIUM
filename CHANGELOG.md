# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- New look based on the IIUM Brand Toolkit: IIUM turquoise and gold, slab-serif
  headings, a gold header rule and a landing page with section cards
  ([DESIGN.md](DESIGN.md)).
- Replaced the logo, which reused IIUM's official partner banner, with the
  project's own book logo, plus new app icons and a link preview image.

### Added

- DESIGN.md, AGENTS.md and a `pnpm lint:design` check that keeps colours and
  fonts on the theme tokens.
- Dark-mode accessibility tests.
- The monthly content report flags changes to IIUM's brand toolkit.

### Fixed

- The offline notice no longer peeks over the page on phones while online.
- Colour contrast of the "NEW" badge and the next-prayer card.
- Form fields have borders you can see (3:1), and the error box's details
  panel has a background in dark mode.
- Prayer time cards were unstyled: they are drawn by script, so the
  component's scoped styles never reached them.
- Contrast of the error box heading in light mode and of the highlighted
  next-prayer card in dark mode.

### Planned

- Complete translations for all supported languages
- Enhanced accessibility features
- Performance monitoring and optimization
- Rate limiting for external API calls
- TypeScript migration for components
- Comprehensive test suite
- Developer contribution analytics

## [1.0.0] - 2026-02-03

### Added

- Initial release of Awesome IIUM
- Comprehensive resource collection for IIUM community
- Multi-language support (English, Bahasa Melayu, Arabic, Chinese, Japanese)
- Starlight documentation theme with built-in search
- Progressive Web App (PWA) support with offline capability
- Automated CI/CD with GitHub Actions
  - CodeQL security scanning
  - Dependency security audits
  - Awesome list linting
  - Link checking
  - Status monitoring
- Responsive design with mobile support
- Prayer times integration via Aladhan API
- Campus map component
- GPA calculator utility
- Activity feed from GitHub
- Student leaderboard
- Status dashboard
- Contributing guidelines and code of conduct
- Comprehensive documentation
  - Setup guide with troubleshooting
  - Content guidelines with quality standards
  - Translation guide with per-language instructions
  - Issue tracking documentation

### Infrastructure

- Built with Astro 5.17.1
- Styled with modern CSS
- Biome for code quality
- Prettier for consistent formatting
- Markdownlint for documentation standards
- Workbox service worker for PWA features
- GoatCounter analytics for privacy-first tracking
