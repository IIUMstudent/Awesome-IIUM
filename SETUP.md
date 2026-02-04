# Setup & Development Guide

## Prerequisites

- **Node.js**: 18.17 or higher
- **pnpm**: 8.0 or higher (we use pnpm instead of npm for this project)

## Installation

1. **Install pnpm globally** (if you don't have it):

   ```bash
   npm install -g pnpm
   # OR use corepack (comes with Node.js 16.13+)
   corepack enable
   ```

2. **Install project dependencies**:

   ```bash
   pnpm install
   ```

## Environment Variables (Optional)

The project works without any environment variables, but you can configure the following for enhanced functionality:

### GitHub API Token

To avoid GitHub API rate limits (increases from 60 to 5000 requests/hour):

1. Create a personal access token at <https://github.com/settings/tokens>
   - No special scopes needed for public repo access
   - Token only needs read access to public repositories

2. Create a `.env` file in the project root:

   ```bash
   GITHUB_TOKEN=your_github_token_here
   ```

3. The token will be automatically used for API requests

**Note:** Never commit the `.env` file to version control (it's already in `.gitignore`)

## Development Server

Start the development server:

```bash
pnpm run dev
```

The site will be available at `http://localhost:3000`

## Building

Build the static site for production:

```bash
pnpm run build
```

Output files will be in `dist/` directory.

## Code Quality

### Linting

Check for code quality issues:

```bash
pnpm run lint
```

This runs both JavaScript/TypeScript linting and Markdown linting:

- **JavaScript/TypeScript**: Biome
- **Markdown**: markdownlint + prettier

### Formatting

Auto-format code:

```bash
pnpm run format
```

### Individual Commands

```bash
# Lint JavaScript/TypeScript
pnpm run lint:js

# Format JavaScript/TypeScript
pnpm run format:js

# Lint Markdown
pnpm run lint:md

# Format Markdown
pnpm run format:md
```

### Pre-commit Hooks

This project uses Husky and Lint-Staged to automatically lint and format code before committing. The hooks are set up during `pnpm install`:

**What happens on commit:**

- JavaScript/TypeScript files are checked with Biome
- Markdown files are formatted with Prettier and linted
- If there are issues, the commit is blocked until fixed

To bypass hooks (not recommended):

```bash
git commit --no-verify
```

To manually run pre-commit checks:

```bash
pnpm lint-staged
```

## Project Structure

```bash
awesome-iium/
├── public/                 # Static files served as-is
│   ├── api/
│   │   └── status.json    # System status (auto-updated)
│   └── logo.png           # Main logo
├── src/
│   ├── components/        # Reusable Astro components
│   ├── content/
│   │   └── docs/          # Markdown documentation
│   ├── styles/
│   │   └── custom.css     # Custom CSS
│   ├── config.ts          # Site configuration
│   └── content.config.ts  # Content collection schema
└── astro.config.mjs       # Astro configuration
```

## Key Technologies

- **Astro**: Static site builder
- **Starlight**: Documentation theme for Astro
- **Biome**: JavaScript/TypeScript linter and formatter
- **PWA**: Progressive Web App support with service workers
- **Vite**: Build tool

## Deployment

The project deploys automatically to GitHub Pages via GitHub Actions:

- Branch: `master`
- Base URL: `https://iiumstudent.github.io/Awesome-IIUM`
- The `base` setting in `astro.config.mjs` handles the path prefix

## PWA & Caching Strategy

This site is a Progressive Web App (PWA) with offline support powered by Workbox.

### How Caching Works

**Service Worker Generation:**

- Service worker (`sw.js`) is automatically generated during build using `@vite-pwa/astro`
- Uses Workbox's `generateSW` strategy with automatic precaching
- All static assets (HTML, CSS, JS, images) are precached for offline access

**Cache Versioning:**

- Each file has a content-based hash (revision) in the precache manifest
- When files change, their hashes change, triggering cache updates
- Example: `workbox-3105ea8d.js` (hash changes with content)

**Cache Invalidation:**

- Automatic cleanup of outdated caches via `cleanupOutdatedCaches()`
- New service workers activate immediately with `skipWaiting()`
- Users get updates on next page load without manual cache clearing

**Update Strategy:**

- `registerType: 'autoUpdate'` in `astro.config.mjs`
- Service worker checks for updates on page load
- New versions downloaded in background
- Changes applied on next visit (no interruption to current session)

**Offline Behavior:**

- All precached pages (226 entries, ~12MB) available offline
- Navigation fallback to root (`/Awesome-IIUM/`)
- Offline indicator appears when network is unavailable
- Users can browse previously visited pages without internet

**Development vs Production:**

- Service worker only registers in production builds
- Development server (`pnpm run dev`) doesn't use service worker
- Preview server (`pnpm run preview`) tests PWA functionality

### Testing PWA Locally

1. Build the site:

   ```bash
   pnpm run build
   ```

2. Start preview server:

   ```bash
   pnpm run preview
   ```

3. Open browser and:
   - Visit the site
   - Open DevTools → Application → Service Workers
   - Verify service worker is active
   - Go offline (toggle in DevTools Network tab)
   - Refresh page - should work offline

### Cache Statistics

From build output:

```text
PWA v1.2.0
mode      generateSW
precache  226 entries (12411.08 KiB)
```

- 226 pages/assets cached
- ~12MB total cache size
- Includes all 5 language versions (en, ar, ja, ms, zh)

## Troubleshooting

### pnpm: command not found

Install pnpm globally:

```bash
npm install -g pnpm
```

### Port 3000 already in use

Specify a different port:

```bash
pnpm run dev -- --port 3001
```

### Build fails

Try these steps:

1. Delete `node_modules` and `.astro` cache:

   ```bash
   rm -rf node_modules .astro dist
   ```

2. Reinstall dependencies:

   ```bash
   pnpm install
   ```

3. Rebuild:

   ```bash
   pnpm run build
   ```

## Known Issues

See [ISSUES.md](./ISSUES.md) for a detailed list of known issues and their status.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.
