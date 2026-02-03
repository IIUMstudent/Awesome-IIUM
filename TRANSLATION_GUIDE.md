# Translation Guide

> Guidelines for translating Awesome IIUM content into different languages.

## 🌍 Supported Languages

| Code | Language | Direction | Status |
|------|----------|-----------|--------|
| `en` | English | LTR | ✅ Primary |
| `ms` | Bahasa Melayu | LTR | 🔄 Partial |
| `ar` | العربية (Arabic) | RTL | 🔄 Partial |
| `zh` | 中文 (Chinese) | LTR | 🔄 Partial |
| `ja` | 日本語 (Japanese) | LTR | 🔄 Partial |

---

## 📁 File Structure

Translations are organized by locale in the content directory:

```
src/content/docs/
├── index.md          # English (default)
├── ms/
│   └── index.md      # Bahasa Melayu
├── ar/
│   └── index.md      # Arabic
├── zh/
│   └── index.md      # Chinese
└── ja/
    └── index.md      # Japanese
```

---

## 🖊️ Translation Guidelines

### General Principles

1. **Natural Translation** - Translate meaning, not word-for-word
2. **Local Conventions** - Use local date formats, number styles
3. **Consistent Terminology** - Use the same terms throughout
4. **Keep Technical Terms** - Some terms are better left in English

### What to Translate

| Element | Translate? | Notes |
|---------|------------|-------|
| Page titles | ✅ Yes | Use natural language |
| Descriptions | ✅ Yes | Adapt for local context |
| Headings | ✅ Yes | Keep structure |
| Body text | ✅ Yes | Main content |
| Link text | ✅ Yes | But keep URLs |
| Code | ❌ No | Keep as-is |
| Brand names | ❌ No | "IIUM", "i-Ma'luum" |
| Technical terms | ⚠️ Maybe | Use judgment |

### What NOT to Translate

- File names and paths
- Code snippets and examples
- URLs and links
- Technical acronyms (API, GPA, etc.)
- Official portal names (i-Ma'luum, i-Ta'leem)

---

## 📝 Language-Specific Guidelines

### Bahasa Melayu (ms)

```yaml
---
title: 'Senarai Sumber IIUM'
description: 'Koleksi sumber, alatan, dan panduan untuk komuniti IIUM.'
---
```

**Style Notes:**

- Use formal register (standard Bahasa Melayu)
- Prefer Malay terms over English loans where natural
- Keep IIUM terminology as-is

**Common Translations:**

| English | Bahasa Melayu |
|---------|---------------|
| Resources | Sumber |
| Tools | Alatan |
| Guide | Panduan |
| Campus | Kampus |
| Student | Pelajar |
| Academic | Akademik |
| Career | Kerjaya |

---

### Arabic (ar)

```yaml
---
title: 'مصادر IIUM الرائعة'
description: 'قائمة منسقة من الموارد والأدوات لمجتمع الجامعة الإسلامية العالمية بماليزيا.'
dir: rtl
---
```

**Style Notes:**

- Use Modern Standard Arabic (فصحى)
- Right-to-left direction is automatic
- Keep English acronyms and names
- Use Arabic numerals (١٢٣) or Western (123) consistently

**Common Translations:**

| English | Arabic |
|---------|--------|
| Resources | موارد |
| Tools | أدوات |
| Guide | دليل |
| Student | طالب |
| Academic | أكاديمي |
| Library | مكتبة |

---

### Chinese (zh)

```yaml
---
title: 'IIUM 精选资源'
description: '为马来西亚国际伊斯兰大学社区精心策划的资源、工具和指南列表。'
---
```

**Style Notes:**

- Use Simplified Chinese (简体中文)
- Keep technical terms in English where appropriate
- Numbers can use Arabic numerals

**Common Translations:**

| English | Chinese |
|---------|---------|
| Resources | 资源 |
| Tools | 工具 |
| Guide | 指南 |
| Student | 学生 |
| Campus | 校园 |
| Academic | 学术 |

---

### Japanese (ja)

```yaml
---
title: 'IIUM リソース一覧'
description: 'マレーシア国際イスラム大学コミュニティのためのリソース、ツール、ガイドの厳選リスト。'
---
```

**Style Notes:**

- Use polite form (です/ます)
- Mix of kanji, hiragana, katakana as natural
- Technical terms often in katakana

**Common Translations:**

| English | Japanese |
|---------|----------|
| Resources | リソース |
| Tools | ツール |
| Guide | ガイド |
| Student | 学生 |
| Campus | キャンパス |
| Academic | 学術 |

---

## 🔄 Translation Workflow

### 1. Choose a File

Start with high-impact pages:

1. `index.md` - Homepage
2. `categories/academics/index.md` - Academics overview
3. `tools.md` - Tools page
4. `about/contributing.md` - Contribution guide

### 2. Create Translation File

```bash
# Example: Translate index.md to Bahasa Melayu
cp src/content/docs/index.md src/content/docs/ms/index.md
```

### 3. Translate Content

- Keep the same frontmatter structure
- Update title and description
- Translate all body content
- Keep links and code unchanged

### 4. Test Locally

```bash
npm run dev
# Visit http://localhost:4321/ms/ to check
```

### 5. Submit PR

- Title: `i18n(ms): Translate index page`
- Description: List what was translated
- Request review from native speaker if possible

---

## ✅ Quality Checklist

Before submitting translations:

- [ ] All text is translated (no English left behind)
- [ ] Frontmatter is correct (title, description)
- [ ] Links still work
- [ ] Formatting is preserved
- [ ] No broken images or components
- [ ] Tested locally in browser
- [ ] RTL direction works (Arabic)

---

## 🤝 Contributing

We especially need help with:

- Completing Arabic translations
- Expanding Bahasa Melayu coverage
- Japanese natural language review
- Chinese simplification consistency

**Questions?** Open an issue with the `i18n` label!
