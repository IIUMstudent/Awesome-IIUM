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

| Code          | Full Name                                                                         |
| ------------- | --------------------------------------------------------------------------------- |
| `AIKOL`       | Ahmad Ibrahim Kulliyyah of Laws                                                   |
| `AHAS-KIRKHS` | AbdulHamid AbuSulayman Kulliyyah of Islamic Revealed Knowledge and Human Sciences |
| `KAED`        | Kulliyyah of Architecture and Environmental Design                                |
| `KAHS`        | Kulliyyah of Allied Health Sciences                                               |
| `KENMS`       | Kulliyyah of Economics and Management Sciences                                    |
| `KICT`        | Kulliyyah of Information and Communication Technology                             |
| `KLM`         | Kulliyyah of Languages and Management                                             |
| `KOD`         | Kulliyyah of Dentistry                                                            |
| `KOE`         | Kulliyyah of Engineering                                                          |
| `KOED`        | Kulliyyah of Education                                                            |
| `KOM`         | Kulliyyah of Medicine                                                             |
| `KON`         | Kulliyyah of Nursing                                                              |
| `KOP`         | Kulliyyah of Pharmacy                                                             |
| `KOS`         | Kulliyyah of Science                                                              |
| `general`     | Cross-kulliyyah resources                                                         |

---

## 📝 Writing Style

### Resource Descriptions

- **Format**: 1-2 concise sentences
- **Start with action**: "Access...", "Find...", "Learn...", "Calculate..."
- **Be specific**: Mention key features or use cases

**Good Examples:**

```markdown
- [i-Ma'luum](https://imaluum.iium.edu.my/) - Access course registration, exam
  results, and generate your timetable.
- [IIUM Schedule Maker](https://github.com/iiumschedule/iium-schedule-maker) -
  Visualize and plan your semester timetable before registration opens.
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

## 📤 Submission Process

1. **Fork** the repository
2. **Add** your resource following these guidelines
3. **Run** `npm run lint` to check formatting
4. **Submit** a Pull Request with a clear description
5. **Wait** for review and address any feedback

Thank you for contributing to Awesome IIUM! 🎓
