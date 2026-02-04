# Security Policy

## Reporting a Vulnerability

The Awesome IIUM project takes security seriously. We appreciate your efforts to responsibly disclose any security vulnerabilities you find.

### How to Report

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report security vulnerabilities by:

1. **Using GitHub Security Advisories** (recommended):
   - Navigate to <https://github.com/iiumstudent/Awesome-IIUM/security/advisories/new>
   - Click "Report a vulnerability"
   - Provide detailed information about the vulnerability

2. **Opening a private security report**:
   - Go to <https://github.com/iiumstudent/Awesome-IIUM/security>
   - Use GitHub's private vulnerability reporting feature

3. **Contacting the maintainers**:
   - Create a new Discussion in the Security category
   - Or contact @iiumstudent on GitHub

### What to Include in Your Report

To help us understand and quickly address the issue, please include:

- **Type of vulnerability** (e.g., XSS, injection, broken authentication)
- **Full paths of source file(s)** related to the vulnerability
- **Location** of the affected code (tag/branch/commit or direct URL)
- **Step-by-step instructions** to reproduce the issue
- **Proof-of-concept or exploit code** (if possible)
- **Impact** of the vulnerability
- **Your suggested fix** (if you have one)

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 5 business days
- **Target Fix Timeline**: Within 30 days for critical issues

We'll keep you informed of our progress and may ask for additional information.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |
| Older   | :x:                |

We only support the latest version deployed on GitHub Pages. Security updates are applied to the `master` branch.

## Security Update Policy

When we receive a security report:

1. We confirm the issue and determine its severity
2. We develop and test a fix
3. We release the fix as soon as possible
4. We credit the reporter (unless they prefer to remain anonymous)

### Severity Levels

- **Critical**: Immediate data breach risk, RCE, or authentication bypass
- **High**: XSS, CSRF, or significant data exposure
- **Medium**: Information disclosure, SSRF, or denial of service
- **Low**: Minor configuration issues or best practice violations

## Known Security Features

### Current Protections

- **Content Security Policy**: Implemented via GitHub Pages
- **XSS Prevention**: All user-generated content is escaped
- **HTTPS Only**: Site served exclusively over HTTPS
- **No Authentication**: No login system, reducing attack surface
- **Static Site**: No server-side code, reducing vulnerabilities
- **Dependency Scanning**: Automated via GitHub Dependabot
- **Code Scanning**: CodeQL analysis runs weekly

### API Security

- **Rate Limiting**: GitHub API requests include retry logic and rate limit detection
- **No Secrets**: No API keys or tokens required for basic functionality
- **Public Data Only**: All data fetched from public APIs

### Client-Side Security

- **Input Validation**: User inputs are validated before processing
- **Safe HTML Rendering**: No `dangerouslySetInnerHTML` equivalent
- **No Eval**: No dynamic code execution
- **Sanitization**: All dynamic content is sanitized

## Security Best Practices for Contributors

When contributing to this project:

1. **Never commit secrets** (API keys, tokens, passwords)
2. **Validate all inputs** in interactive components
3. **Escape user-generated content** before rendering
4. **Use HTTPS** for all external resources
5. **Review dependencies** for known vulnerabilities
6. **Run security checks** before submitting PRs

   ```bash
   pnpm audit
   pnpm run lint
   ```

## Third-Party Dependencies

We regularly update dependencies to patch security vulnerabilities:

- **Automated**: Dependabot creates PRs for security updates
- **Manual Review**: Maintainers review and merge security patches within 48 hours
- **Testing**: All updates are tested before deployment

### Auditing Dependencies

To check for vulnerabilities:

```bash
pnpm audit
pnpm audit --fix  # Apply fixes automatically
```

## Disclosure Policy

- We follow **coordinated vulnerability disclosure**
- We'll work with you to understand and fix the issue before public disclosure
- We prefer a **90-day disclosure deadline** but can be flexible
- We'll credit researchers who report valid issues (with permission)

## Security Hall of Fame

We appreciate security researchers who help keep Awesome IIUM safe. Contributors who report valid security issues will be listed here (with permission):

<!-- Security researchers will be listed here -->
_No reports yet. Be the first to help secure this project!_

## Out of Scope

The following are **not** considered security vulnerabilities:

- Reports from automated scanning tools without validation
- Issues in third-party dependencies (report to the dependency maintainer)
- Social engineering attacks
- Physical attacks
- Denial of service attacks on external APIs
- Browser-specific issues (unless critical)
- Issues requiring unlikely user interaction
- Reports without proof of concept

## Bug Bounty

This is an open-source community project and we do not offer monetary rewards. However, we:

- Publicly acknowledge your contribution (with permission)
- Add you to our contributors list
- Provide a detailed public thank you when the issue is resolved

## Legal

By reporting a vulnerability, you agree to:

- Give us reasonable time to investigate and fix the issue
- Not exploit the vulnerability beyond what's necessary to demonstrate it
- Not violate the privacy of other users
- Comply with applicable laws and regulations

We will not pursue legal action against researchers who:

- Act in good faith
- Follow responsible disclosure practices
- Don't access or modify others' data beyond what's necessary

## Questions?

If you have questions about this security policy, please:

- Open a GitHub Discussion
- Contact the maintainers via GitHub
- Create an issue (for non-sensitive questions only)

---

**Last Updated**: February 3, 2026  
**Version**: 1.0
