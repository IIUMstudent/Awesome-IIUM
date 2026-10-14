# Design

How Awesome IIUM looks, and why. This file is the source of truth for people, AI
agents and the automated checks alike. If the site and this file disagree, one
of them is a bug.

**Short version:** IIUM turquoise and gold on Starlight. Use the theme tokens
and never raw colours. Use our own book logo, never the IIUM crest. Check AA
contrast in both light and dark mode.

## Where the design comes from

IIUM publishes its visual identity in the **IIUM Brand Toolkit**, from the
Office for Communication, Advocacy and Promotion (OCAP):

| Source                                                                                                                                             | What it covers                                        |
| :------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------- |
| [Official IIUM (toolkit page)](https://office.iium.edu.my/ocap/official-iium-2/)                                                                   | Where the current toolkit files are published         |
| [Corporate Colours of IIUM](https://office.iium.edu.my/ocap/wp-content/uploads/sites/2/2025/07/Corporate-Colours-of-IIUM.pdf)                      | Turquoise, gold, black, white and what they stand for |
| [Logo Variations and Elements](https://office.iium.edu.my/ocap/wp-content/uploads/sites/2/2025/07/Corporate-IIUM-Logo-Variations-and-Elements.pdf) | Logo versions, typefaces, clear space, misuse         |
| [Full Brand Toolkit V2](https://office.iium.edu.my/ocap/wp-content/uploads/sites/2/2025/07/FULL_BRANDING_IIUM_V2.pdf)                              | Everything above in one document                      |

What we take from it (toolkit dated July 2025, checked 2026-10-14):

- **Corporate colours:** turquoise `#00918E` and gold `#D59F0F`, with black and
  white. The older 2021 Visual Identity System gives turquoise as `#00928F`
  (Pantone 7716) and gold as `#D59F0F` (Pantone 7555 C). We use the 2025 value.
  The toolkit says turquoise and gold stay the primary colours. Kulliyyah
  colours are only for kulliyyah branding.
- **Typefaces:** the IIUM wordmark is set in Rockwell (a geometric slab serif)
  and the tagline in Futura.
- **Logo misuse:** don't stretch, outline or add a shadow to the logo, and keep
  it clear of busy backgrounds.

> The values above come from the toolkit's published text. Our build environment
> couldn't download the PDFs, so if you're reading this with the PDFs open and
> something differs, the PDF wins: fix this file and `src/styles/custom.css`.

### We are not IIUM

Awesome IIUM is a student project, **not an official IIUM website**. IIUM asks
its community to protect the IIUM name, logo and trademarks from misuse, so:

- **Never use the IIUM crest or logo**, the "Garden of Knowledge and Virtue"
  tagline lockup, or partner logos (UNESCO, UN University and so on), anywhere
  on the site, in the README, or in link previews. We use the colours and the
  general feel. We don't use the marks.
- Don't word anything as if IIUM wrote or endorsed it. The homepage and the link
  preview image both say the site is student-run.
- If the project ever wants to use the logo, ask OCAP first
  (<corporatecomm@iium.edu.my>).

## Colour

All colours live in [`src/styles/custom.css`](src/styles/custom.css). Nothing
else may contain a colour value; `pnpm lint:design` fails if one does.

### Brand

| Token              | Value     | Use                                                                                                            |
| :----------------- | :-------- | :------------------------------------------------------------------------------------------------------------- |
| `--iium-turquoise` | `#00918E` | The brand colour itself: the logo, the browser theme colour, large fills. Too light for text on white (3.9:1). |
| `--iium-gold`      | `#D59F0F` | Decoration only: the header rule, the logo ribbon, highlights. Never text on a light background (2.4:1).       |

### Theme

Starlight's accent and grey tokens are mapped onto the brand. Use these in
components:

| Token                                             | Light     | Dark      | Use                                                                                                            |
| :------------------------------------------------ | :-------- | :-------- | :------------------------------------------------------------------------------------------------------------- |
| `--sl-color-accent`                               | `#00706D` | `#00A6A2` | Links, active states, borders, focus rings. The brand turquoise, darkened (light) or lifted (dark) to pass AA. |
| `--sl-color-accent-high`                          | `#00403F` | `#8FE0DD` | Text on `accent-low`; strong accents                                                                           |
| `--sl-color-accent-low`                           | `#D6F0EF` | `#003836` | Tinted backgrounds (badges, hero, hover)                                                                       |
| `--sl-color-bg-accent` + `--sl-color-text-invert` |           |           | Filled buttons: always use the pair, never `white` on accent                                                   |
| `--aw-color-gold`                                 | `#D59F0F` | `#D59F0F` | Decorative gold                                                                                                |
| `--aw-color-gold-high`                            | `#7A5800` | `#E9B949` | Gold-coloured text (e.g. "Featured", first place)                                                              |
| `--aw-color-gold-low`                             | `#F5EBCF` | `#3D2E05` | Gold-tinted backgrounds                                                                                        |
| `--aw-color-border-control`                       | `#7D8C8C` | `#6E7C7C` | Borders of inputs and selects: 3:1 or better on the field and the panel. Not for dividers                      |
| `--sl-color-gray-1…7`                             |           |           | Starlight's grey ramp, tinted towards turquoise                                                                |

Contrast (WCAG 2.1, measured on the page and sidebar backgrounds): link text is
5.6:1 or better in light mode and 9.2:1 or better in dark mode.
`--sl-color-accent` used as text is at least 4.6:1. The `-high` on `-low` pairs
are 5.5:1 or better. Filled buttons are 5.9:1 (light) and 8.6:1 (dark).

### Status and data colours

- **Status** (online, error, success, warning): use Starlight's semantic tokens,
  which already adapt to light and dark mode: `--sl-color-green|orange|red|blue`
  for dots, borders and icons, `-high` for text and `-low` for backgrounds.
  Don't invent new reds and greens.
- **Campus colours** (Campus Map): `--aw-campus-gombak` (turquoise),
  `--aw-campus-kuantan` (gold) and `--aw-campus-pagoh`. Text on them is
  `--aw-color-ink`.
- **Fixed surfaces** that look the same in both themes, such as the map, whose
  tiles and popups are always light: `--aw-color-paper`, `--aw-color-ink`,
  `--aw-color-ink-muted`.

Need a colour that isn't here? Add a token to `custom.css` with a light and a
dark value that pass AA contrast, and add it to this table.

## Typography

| Role                 | Font                                                               | Token                               |
| :------------------- | :----------------------------------------------------------------- | :---------------------------------- |
| Headings, site title | **Arvo** 700, a free geometric slab serif close to IIUM's Rockwell | `--aw-font-heading`                 |
| Body, UI             | System font stack (Starlight default)                              | Starlight's default, nothing to set |
| Code                 | System monospace                                                   | `--__sl-font-mono`                  |

- Arvo is self-hosted from `@fontsource/arvo` (Latin, bold only, 17 KB), so it
  works under the site's Content Security Policy and offline. Rockwell itself is
  a commercial font, so we don't ship it.
- Arabic, Japanese and Chinese pages use the system font for headings, because
  Arvo has no glyphs for those scripts.
- Don't add other fonts. `font-family` in components must use a token.

## Logo and images

- The logo is an open book with a gold bookmark ribbon on a turquoise tile:
  [`src/assets/logo.svg`](src/assets/logo.svg). It's ours, not IIUM's, and it
  stays readable as a 16px favicon.
- Everything else is generated from it with `pnpm brand:assets`: the favicon
  `public/logo.svg`, the app icons `public/logo.png` and `public/icon-192.png`,
  and the link preview `public/og.png` (1200×630, shown when the site is shared
  on WhatsApp, Telegram or X). Don't edit those files by hand. Change the SVG or
  the script, then regenerate.
- The logo always keeps its own turquoise tile. Don't recolour it, outline it or
  put it on a busy photo (the same rules IIUM sets for its own logo).

## Layout and components

- **Starlight first.** Use Starlight's components before writing new ones:
  `Card`, `CardGrid`, `LinkCard`, `Aside`, `Badge`, `Tabs`, `Steps`
  ([docs](https://starlight.astro.build/components/using-components/)). They
  already follow the theme.
- **The homepage** uses Starlight's `splash` template: a hero with the logo,
  then a `CardGrid` of `LinkCard`s for the main sections. Other pages use the
  normal docs layout.
- **Gold is the accent, turquoise does the work.** Buttons, links and active
  states are turquoise. Gold marks things out (the header rule, "featured"
  badges, first place) and is used sparingly.
- **Custom components** (`src/components/`): theme tokens for every colour,
  `rem` for spacing, `var(--sl-shadow-sm|md|lg)` for shadows, and a corner
  radius of 6px for controls, 8–12px for cards and 999px for pills.
- **Badges and pills** use a tinted background with darker text from the same
  family (`-low` background, `-high` text), not white text on a gradient.

## Accessibility

Every design choice has to pass [ACCESSIBILITY.md](ACCESSIBILITY.md):

- WCAG 2.1 AA contrast, **in both light and dark mode**. Check both before
  merging a visual change.
- Visible focus: `outline: 2px solid var(--sl-color-accent)` on
  `:focus-visible`.
- Form fields are bordered with `--aw-color-border-control`, not a hairline, so
  their edges reach 3:1.
- Touch targets at least 44×44px.
- Animations respect `prefers-reduced-motion`. Nothing pulses or loops forever,
  and text never fades (`opacity`) below its contrast.
- Don't use colour alone to carry meaning. Pair it with text or an icon (e.g.
  "Online" next to the green dot).

## How this is kept up to date

| What                                    | How                                                                                                                                                                                                                                                                                                                        |
| :-------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Colours and fonts only come from tokens | `pnpm lint:design` ([`scripts/check-design.mjs`](scripts/check-design.mjs)) runs in `pnpm lint` and CI and fails on raw colours or fonts. A line that truly needs an exception says why in a `design-ok` comment.                                                                                                          |
| Contrast and accessibility              | The axe accessibility tests in CI (`pnpm test:a11y`).                                                                                                                                                                                                                                                                      |
| IIUM changes its brand                  | The [monthly content report](MAINTAINING.md) checks the toolkit page and lists new or removed toolkit files under "🎨 IIUM brand toolkit changed". Compare them with this file, update it and `custom.css` if needed, then record the files in `brandToolkit.files` in [`scripts/discovery.json`](scripts/discovery.json). |

### Changing the design

1. Change the tokens in `src/styles/custom.css` and update the tables above.
2. If the logo or brand colours changed, update `src/assets/logo.svg` and run
   `pnpm brand:assets`.
3. Run `pnpm lint`, `pnpm build` and `pnpm test:a11y`, and look at the site in
   light and dark mode on a phone-sized window.
