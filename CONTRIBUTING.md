# Contributing to Awesome IIUM

Thank you for your interest in contributing to Awesome IIUM! We aim to build the
most comprehensive and high-quality resource for the IIUM community.

## 📋 Inclusion Criteria

To keep this list high-quality, please ensure your contribution:

- **Is relevant to IIUM**: It should be useful for students, staff, or alumni.
- **Is active**: The resource (link, app, group) should be currently active and
  maintained.
- **Adds value**: Avoid generic resources unless they have a specific use case
  for IIUM (e.g., specific student discounts).

## 📝 Style Guide

- **Alphabetical Order**: Please keep the list sorted alphabetically within each
  category.
- **Format**: `[Name](Link) - Description.`
  - **Name**: Capitalized correctly.
  - **Link**: Direct link to the resource.
  - **Description**: Short, clear, and ends with a period.
- **No Self-Promotion**: If you are the author, please state it in the PR but
  keep the description objective.

## 📦 Dependency Management Policy

We keep dependencies stable and secure with a lightweight update policy.

### When to Update

- **Security fixes:** Update within **48 hours** of a known vulnerability.
- **Minor/patch updates:** Batch monthly or when needed for compatibility.
- **Major updates:** Only after testing and review (see below).

### Handling Breaking Changes

1. Review changelog and migration notes.
2. Update in a dedicated PR with a clear summary of changes.
3. Run the full test suite (`pnpm test`, `pnpm test:e2e`).
4. Confirm no regressions in build (`pnpm build`).

### Package Manager

- **pnpm is required** for consistency (lockfile and workspace behavior).
- Do not run `npm install` or `yarn install`.
- Keep `pnpm-lock.yaml` in sync with `package.json`.

## 🚀 How to Contribute

1. **Fork the repository**: Click the "Fork" button at the top right of this
   page.
2. **Clone your fork**:

   ```bash
   git clone https://github.com/YOUR-USERNAME/Awesome-IIUM.git
   cd Awesome-IIUM
   ```

3. **Setup your environment**:

   ```bash
   # Install pnpm if you don't have it
   npm install -g pnpm
   # Install dependencies
   pnpm install
   ```

4. **Create a branch**:

   ```bash
   git checkout -b add-my-awesome-resource
   ```

5. **Make your changes**: Add your resource to the appropriate file in
   `src/content/docs/`.
6. **Commit your changes**:

   ```bash
   git commit -m "Add [Resource Name] to [Category]"
   ```

7. **Push to your fork**:

   ```bash
   git push origin add-my-awesome-resource
   ```

8. **Submit a Pull Request**: Go to the original repository and click "Compare
   & pull request".

## ⚠️ Issues

If you find a broken link or outdated information, please
[open an issue](https://github.com/iiumstudent/Awesome-IIUM/issues) describing
the problem.

Thank you for helping us make IIUM awesome! 🚀
