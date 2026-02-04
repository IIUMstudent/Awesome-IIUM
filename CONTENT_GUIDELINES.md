# Content Guidelines

> Quality standards for contributing resources to Awesome IIUM.

## 📋 Resource Quality Criteria

Before submitting a resource, ensure it meets these criteria:

### ✅ Must Have

- **Relevant to IIUM** - Directly useful for IIUM students, faculty, or alumni
- **Working URL** - Link is active and accessible
- **Clear Description** - 1-2 sentence description explaining what it is
- **Free or Accessible** - Either free, or accessible via IIUM credentials

### ⚡ Nice to Have

- Official IIUM resource or widely used by students
- Open source (for tools/apps)
- Multi-language support
- Mobile-friendly

---

## 🏷️ Frontmatter Schema

All content files can include these optional metadata fields:

```yaml
---
title: 'Page Title'
description: 'Brief description for SEO'

# Optional resource metadata
resourceType: portal | tool | community | library | app | guide | course
tags:
  - registration
  - exam
  - official
verified: true # Only for officially verified resources
featured: false # Highlighted on homepage

# IIUM-specific
kulliyyah: KICT | KENMS | KOE | ... # See full list below
campus: gombak | kuantan | pagoh | all

# Tracking
lastUpdated: 2026-01-19
maintainer: '@github-username'
---
```

### Kulliyyah Codes

| Code | Full Name |
|------|-----------|
| `AIKOL` | Ahmad Ibrahim Kulliyyah of Laws |
| `AHAS-KIRKHS` | AbdulHamid AbuSulayman Kulliyyah of Islamic Revealed Knowledge and Human Sciences |
| `KAED` | Kulliyyah of Architecture and Environmental Design |
| `KAHS` | Kulliyyah of Allied Health Sciences |
| `KENMS` | Kulliyyah of Economics and Management Sciences |
| `KICT` | Kulliyyah of Information and Communication Technology |
| `KLM` | Kulliyyah of Languages and Management |
| `KOD` | Kulliyyah of Dentistry |
| `KOE` | Kulliyyah of Engineering |
| `KOED` | Kulliyyah of Education |
| `KOM` | Kulliyyah of Medicine |
| `KON` | Kulliyyah of Nursing |
| `KOP` | Kulliyyah of Pharmacy |
| `KOS` | Kulliyyah of Science |
| `general` | Cross-kulliyyah resources |

---

## 📝 Writing Style

### Resource Descriptions

- **Format**: 1-2 concise sentences
- **Start with action**: "Access...", "Find...", "Learn...", "Calculate..."
- **Be specific**: Mention key features or use cases

**Good Examples:**

```markdown
- [i-Ma'luum](https://imaluum.iium.edu.my/) - Access course registration, exam results, and generate your timetable.
- [IIUM Schedule Maker](https://github.com/iiumschedule/iium-schedule-maker) - Visualize and plan your semester timetable before registration opens.
```

**Bad Examples:**

```markdown
- [i-Ma'luum](https://imaluum.iium.edu.my/) - Student portal.
- [IIUM Schedule Maker](https://github.com/...) - A tool for schedules.
```

### Categories

Organize resources under clear headings:

```markdown
## 🏛 Official Portals
## 🛠 Tools & Utilities
## 📚 Learning Resources
## 👥 Communities
## 📱 Mobile Apps
```

---

## ✅ Verified Badge

The `verified: true` flag is reserved for:

1. **Official IIUM resources** - From iium.edu.my domains
2. **Widely-used student tools** - 50+ stars or significant user base
3. **Maintainer-confirmed** - Active development and support

To request verification:

1. Open a GitHub Issue with the "Verification Request" template
2. Provide evidence of quality and usage
3. A maintainer will review and approve

---

## ✅ Content Review Process

All content submissions go through a lightweight review to protect quality and avoid duplicates.

### Review Checklist

Before approving a resource, reviewers verify:

- The URL loads reliably (no 404, no persistent timeouts)
- The resource is relevant to IIUM students/faculty
- The description is clear (1-2 sentences, action-oriented)
- The resource is not already listed
- The resource fits the correct category and campus
- Frontmatter metadata is correct (if provided)
- Links are formatted correctly (relative for internal links)
- Items are sorted alphabetically within the category

### Reviewers & Approval

- **Who can approve:** Repository maintainers and collaborators with write access
- **Verification badge approvals:** Maintainers only (official/featured/verified)
- **Fast path:** Clear, high-quality resources may be approved without further questions

### Quality Assurance Steps

1. **Manual check:** Open the URL and validate the description
2. **Duplicate check:** Search existing content for the same resource
3. **Formatting check:** Ensure markdown matches style guidelines
4. **Optional automated checks:**

- `pnpm run lint:md`
- `pnpm run format:md`
- `lychee` link check (see Link Verification section)

### Submission Paths

- **Recommended:** Open a Resource Suggestion issue (template below)
- **Alternative:** Submit a PR directly with the resource added

---

## 🧾 Issue Templates for Content Submissions

Use these templates to submit content-related requests:

1. **Resource Suggestion** (new resource request)
2. **Verification Request** (request `verified: true` badge)

Templates live in `.github/ISSUE_TEMPLATE/` and include a quality checklist.

---

## 🌐 Translation Guidelines

When translating content:

1. Keep technical terms in English where appropriate
2. Translate descriptions naturally, not word-for-word
3. Maintain the same structure and formatting
4. Update URLs only if a localized version exists

See [TRANSLATION_GUIDE.md](./TRANSLATION_GUIDE.md) for detailed instructions.

---

## 🔄 Keeping Content Updated

- Check your contributed links periodically
- Report broken links via GitHub Issues
- Update descriptions when resources change significantly
- Mark deprecated resources with a note

---

## 🔗 Link Verification Process

All links in content files are checked regularly to ensure quality and accessibility.

### Automated Link Checking

We use [lychee](https://github.com/lycheeverse/lychee) to validate all links in the repository.

**Run link checker locally:**

```bash
# Install lychee (macOS)
brew install lychee

# Install lychee (Linux)
cargo install lychee

# Check all markdown files with proper base URL
lychee --verbose --no-progress --max-redirects 5 --timeout 10 \
  --accept '200..=399,403,999' \
  --base-url 'https://iiumstudent.github.io/Awesome-IIUM' \
  'src/content/docs/**/*.md'
```

### Pre-Commit Validation

Markdownlint runs automatically on commit via Husky to catch:

- Broken markdown syntax
- Inconsistent formatting
- Dead links (basic validation)

**Manually run linting:**

```bash
pnpm run lint:md          # Check markdown files
pnpm run format:md        # Auto-fix formatting
```

### Link Best Practices

#### ✅ DO

- Use **relative paths** for internal links: `../categories/academics/`
- Remove `.md` extensions from links: `../about/license` not `../about/license.md`
- Use HTTPS URLs when available
- Test links before submitting PR
- Document known timeouts (e.g., IIUM subdomain issues)

#### ❌ DON'T

- Use absolute paths `/` for internal links (breaks on GitHub Pages with base path)
- Hardcode the base URL `/Awesome-IIUM/` in links
- Link to localhost or development URLs
- Use outdated or archived resources without warnings

### Known Issues

Some IIUM services may timeout during link checking:

- `lib.iium.edu.my` - Library portal (slow response)
- `censerve.iium.edu.my` - CENSERVE (timeout issues)
- Kulliyyah subdomains (varies by campus)

These are institutional infrastructure issues and cannot be fixed externally. If a link consistently times out but is known to work, add a note in the description:

```markdown
- [IIUM Library](https://lib.iium.edu.my/) - Digital library access (may be slow to load).
```

### Reporting Broken Links

Found a broken link? Help us fix it:

1. **Open a GitHub Issue** with:
   - URL that's broken
   - Page where it appears
   - Error message (404, timeout, etc.)
   - Suggested replacement (if you have one)

2. **Or submit a PR** with the fix directly

---

## 📤 Submission Process

1. **Fork** the repository
2. **Add** your resource following these guidelines
3. **Run** `npm run lint` to check formatting
4. **Submit** a Pull Request with a clear description
5. **Wait** for review and address any feedback

Thank you for contributing to Awesome IIUM! 🎓
