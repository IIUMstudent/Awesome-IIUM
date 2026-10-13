# Maintaining Awesome IIUM

This guide is for whoever looks after Awesome IIUM next. The site is built to
run itself: robots keep it deployed, checked and up to date, and they open
GitHub issues when a person needs to decide something. **You don't need to know
how to code to maintain it.**

## Your 10 minutes a week

Open the [issues](https://github.com/IIUMstudent/Awesome-IIUM/issues) and work
through these, newest first:

| Issue                                        | What to do                                                                                                                                                                                                    |
| :------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`[Resource]: …`** (label `new resource`)   | A bot has already replied with a check. If it says ✅ and the resource is useful to IIUM students, add the **`approved`** label. It's published to the site and the issue closes by itself. If not, close it. |
| **`[Automated] Monthly content report`**     | Pick a page or two from "Pages to review", check the facts on it are still right, fix what's wrong and set `lastUpdated` to today. Add useful sites from "IIUM sites not in the guide yet".                   |
| **`[Automated] Broken Links Detected`**      | Fix or remove the dead links listed (edit the page on GitHub with the ✏️ button).                                                                                                                             |
| **Dependabot pull requests** (major updates) | Small updates merge themselves. Big ones wait for you: if all checks are green, merge. If something is red and you're unsure, leave it; nothing breaks if it waits.                                           |

Editing a page: open it under
[`src/content/docs`](https://github.com/IIUMstudent/Awesome-IIUM/tree/master/src/content/docs),
press ✏️, make the change and commit. The site redeploys in a few minutes.

## What runs on its own

| Workflow                                                  | When                            | What it does                                                                                                      |
| :-------------------------------------------------------- | :------------------------------ | :---------------------------------------------------------------------------------------------------------------- |
| [Deploy](.github/workflows/deploy.yml)                    | Every push and every 3 hours    | Builds and publishes the site, refreshes system status and the GitHub activity widgets.                           |
| [Resource Submissions](.github/workflows/submissions.yml) | When issues are opened/labelled | Checks suggestions and publishes approved ones.                                                                   |
| [Content Report](.github/workflows/content-report.yml)    | 1st of every month              | Lists pages due for review and new IIUM sites to cover.                                                           |
| [Link Checker](.github/workflows/link-checker.yml)        | Every push, and weekly          | Blocks broken internal links; reports dead external links.                                                        |
| [Dependabot](.github/dependabot.yml)                      | Weekly                          | Updates dependencies; [minor and patch updates merge automatically](.github/workflows/dependabot-auto-merge.yml). |
| Quality, E2E, Accessibility, Lighthouse, Security         | Every pull request              | Lint, tests, accessibility and performance checks.                                                                |

GitHub turns off scheduled workflows after 60 days without commits; the deploy
workflow re-enables them, so the site keeps updating even if nobody commits for
months.

## Handing over to the next maintainers

Everything belongs to the **IIUMstudent** GitHub organization, not to a person.
To pass it on:

1. **Add the new people** to the organization (Settings → People) and to a team
   called **`maintainers`** with the **Maintain** role on this repository.
   [CODEOWNERS](.github/CODEOWNERS) asks that team to review pull requests.
2. **Make at least two people organization owners**, so the project never
   depends on one account.
3. **Remove yourself** once they're comfortable (or stay as a quiet owner).

Repository settings the robots rely on (already set up; check them if something
stops working):

- **Settings → Actions → General → Workflow permissions:** "Read and write
  permissions".
- **Settings → Pages:** deploy from the `gh-pages` branch.
- **Settings → Features → Discussions:** on (page comments use
  [Giscus](https://giscus.app), whose GitHub app must be installed on the
  organization).
- If you protect the `master` branch, let **GitHub Actions** bypass the rule,
  otherwise approved submissions can't be published.

### Accounts outside GitHub

- **Analytics (GoatCounter):** visits are counted at `2217441.goatcounter.com`,
  a personal account. To move it, create a
  [GoatCounter](https://www.goatcounter.com) site for the organization and set
  the repository variable `GOATCOUNTER_ENDPOINT` (Settings → Secrets and
  variables → Actions → Variables) to `https://<site>.goatcounter.com/count`.
- **Sentry (error tracking):** optional and off unless the `PUBLIC_SENTRY_DSN`
  variable is set.

No other secrets or paid services are needed.

## When something goes wrong

- **The site isn't updating:** open
  [Actions → Deploy to GitHub Pages](https://github.com/IIUMstudent/Awesome-IIUM/actions/workflows/deploy.yml)
  and press **Run workflow**. If it fails, the log says why.
- **A submission didn't publish:** the bot explains why on the issue. Fix the
  issue text (or the page) and add the `approved` label again.
- **Too many "new sites" in the report:** add the ones you don't want to
  `ignore` in [`scripts/discovery.json`](scripts/discovery.json).
- **Bigger problems:** [OPERATIONS.md](OPERATIONS.md) covers disaster recovery,
  and [ARCHITECTURE.md](ARCHITECTURE.md) explains how the site is built.
