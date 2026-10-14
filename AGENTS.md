# Agent guide

Instructions for AI coding agents (and a quick start for people) working on
Awesome IIUM: a curated guide for the IIUM community, built with Astro Starlight
and deployed to GitHub Pages.

## Read before you change

| Changing...                                        | Follow                                                               |
| :------------------------------------------------- | :------------------------------------------------------------------- |
| How anything looks (CSS, components, images, logo) | [DESIGN.md](DESIGN.md)                                               |
| Page content in `src/content/docs`                 | [CONTENT_GUIDELINES.md](CONTENT_GUIDELINES.md)                       |
| Translations                                       | [TRANSLATION_GUIDE.md](TRANSLATION_GUIDE.md)                         |
| Workflows, scripts, build                          | [ARCHITECTURE.md](ARCHITECTURE.md), [MAINTAINING.md](MAINTAINING.md) |
| Anything user-facing                               | [ACCESSIBILITY.md](ACCESSIBILITY.md)                                 |

## Design rules you must not break

- Colours only come from the tokens in `src/styles/custom.css`. Never write a
  hex, `rgb()`, `hsl()` or named colour anywhere else.
- Never use the IIUM crest or logo, or partner logos. This site is unofficial
  and uses its own logo (`src/assets/logo.svg`).
- Use Starlight's components (`Card`, `LinkCard`, `Aside`, ...) before writing
  new ones.
- Text must pass WCAG AA contrast in both light and dark mode.

## Check your work

```bash
pnpm install
pnpm lint      # Biome, markdownlint and the design rules (scripts/check-design.mjs)
pnpm test      # unit tests
pnpm build     # must succeed
pnpm test:e2e  # E2E + axe accessibility tests against the build
```

pnpm only, never npm or yarn. Keep `pnpm-lock.yaml` in sync.
