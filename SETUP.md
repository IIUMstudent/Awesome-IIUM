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

## Project Structure

```
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
- Branch: `main`
- Base URL: `https://iiumstudent.github.io/Awesome-IIUM`
- The `base` setting in `astro.config.mjs` handles the path prefix

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
