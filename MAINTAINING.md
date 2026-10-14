# Maintaining Awesome IIUM

This guide is for whoever looks after Awesome IIUM next. The site is built to
run itself: robots keep it deployed, checked and up to date, and they open
GitHub issues when a person needs to decide something. **You don't need to know
how to code to maintain it.**

## Your 10 minutes a week

Open the [issues](https://github.com/IIUMstudent/Awesome-IIUM/issues) and work
through these, newest first:

| Issue                                        | What to do                                                                                                                                                                                                                                                                                                |
| :------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`Monthly content refresh`** pull request   | Claude has checked pages against IIUM's official sites and fixed what changed. Read its summary, skim the changes and **merge**. Anything under "Needs a person" is for you to decide.                                                                                                                    |
| **`[Resource]: …`** (label `new resource`)   | A bot has already replied with a check. If it says ✅ and the resource is useful to IIUM students, add the **`approved`** label. It's published to the site and the issue closes by itself. If not, close it.                                                                                             |
| **`[Automated] Monthly content report`**     | With the content refresh on, there's nothing to do: it works through this list. Otherwise pick a page or two from "Pages to review", check the facts, fix what's wrong and set `lastUpdated` to today. If it says the IIUM brand toolkit changed, see [DESIGN.md](DESIGN.md#how-this-is-kept-up-to-date). |
| **`[Automated] Broken Links Detected`**      | With the content refresh on, it fixes these too. Otherwise fix or remove the dead links listed (edit the page on GitHub with the ✏️ button).                                                                                                                                                              |
| **Dependabot pull requests** (major updates) | Small updates merge themselves. Big ones wait for you: if all checks are green, merge. If something is red and you're unsure, leave it; nothing breaks if it waits.                                                                                                                                       |

Editing a page: open it under
[`src/content/docs`](https://github.com/IIUMstudent/Awesome-IIUM/tree/master/src/content/docs),
press ✏️, make the change and commit. The site redeploys in a few minutes.

## What runs on its own

| Workflow                                                  | When                            | What it does                                                                                                          |
| :-------------------------------------------------------- | :------------------------------ | :-------------------------------------------------------------------------------------------------------------------- |
| [Deploy](.github/workflows/deploy.yml)                    | Every push and every 3 hours    | Builds and publishes the site, refreshes system status and the GitHub activity widgets.                               |
| [Resource Submissions](.github/workflows/submissions.yml) | When issues are opened/labelled | Checks suggestions and publishes approved ones.                                                                       |
| [Content Report](.github/workflows/content-report.yml)    | 1st of every month              | Lists pages due for review, topics not covered yet, new IIUM sites and changes to IIUM's brand toolkit.               |
| [Content Refresh](.github/workflows/content-refresh.yml)  | 3rd of every month              | Claude works through the report and opens one pull request with the fixes ([switch it on](#keeping-content-current)). |
| [Link Checker](.github/workflows/link-checker.yml)        | Weekly                          | Reports dead external links in one issue.                                                                             |
| [Dependabot](.github/dependabot.yml)                      | Weekly                          | Updates dependencies; [minor and patch updates merge automatically](.github/workflows/dependabot-auto-merge.yml).     |
| [CI](.github/workflows/ci.yml)                            | Every push and pull request     | Lint (including the [design rules](DESIGN.md)), unit tests, build, internal links, E2E and accessibility tests.       |
| [Security](.github/workflows/security.yml)                | Every pull request, and weekly  | CodeQL and dependency audit.                                                                                          |
| [Lighthouse](.github/workflows/lighthouse.yml)            | Monthly                         | Performance and SEO audit.                                                                                            |

GitHub turns off scheduled workflows after 60 days without commits; the deploy
workflow re-enables them, so the site keeps updating even if nobody commits for
months.

## Keeping content current

IIUM's information lives on dozens of official sites that change without notice.
Three things keep the guide in step with them:

- **[`scripts/coverage.json`](scripts/coverage.json)** is the list of everything
  the guide should cover, and which pages cover it. To ask for a new topic, add
  it with `"pages": []`.
- **The monthly content report** lists what needs attention: pages not reviewed
  in 6 months, mentions of past semesters, topics with no page, and IIUM sites
  the guide doesn't mention yet.
- **The monthly content refresh** has Claude (an AI model) do that work: it
  opens the official pages, fixes what changed, writes missing pages and sends
  you one pull request to review. Its instructions are in
  [`.github/content-refresh.md`](.github/content-refresh.md), in plain English.

### Switching on the content refresh

It's off until you give it an API key. It costs a small amount per run, billed
by Anthropic.

1. Create an API key in the [Anthropic Console](https://console.anthropic.com/)
   and set a monthly spend limit there.
2. In this repository: **Settings → Secrets and variables → Actions → New
   repository secret**, name `ANTHROPIC_API_KEY`, paste the key.
3. **Settings → Actions → General → Workflow permissions:** tick **Allow GitHub
   Actions to create and approve pull requests**.
4. To start now instead of waiting for the 3rd: **Actions → Content Refresh →
   Run workflow**. You can type a focus, like "write a page on food at the
   Kuantan campus".

Only one refresh pull request is open at a time: merge (or close) it and the
next run continues where it stopped. The robot can only change pages and the two
lists in `scripts/`; every change is linted, built and link-checked before you
see it, and nothing is published until you merge.

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
- **Settings → Pages → Source:** "GitHub Actions". `deploy.yml` publishes with
  `actions/deploy-pages`; with any other source the live site stops updating
  even though the workflow succeeds.
- If you protect the `master` branch, let **GitHub Actions** bypass the rule,
  otherwise approved submissions can't be published.

### Accounts outside GitHub

- **Analytics (GoatCounter):** visits are counted at `2217441.goatcounter.com`,
  a personal account. To move it, create a
  [GoatCounter](https://www.goatcounter.com) site for the organization and set
  the repository variable `GOATCOUNTER_ENDPOINT` (Settings → Secrets and
  variables → Actions → Variables) to `https://<site>.goatcounter.com/count`.

- **Anthropic (content refresh, optional):** the `ANTHROPIC_API_KEY` secret.
  Whoever owns the key pays for it, so give the new maintainers their own key
  and delete yours.

- **Search engines (free):** register the site so IIUM students searching
  "IIUM", "UIA" or "UIAM" find it, and so you can see which searches bring
  them in. Do this once, with an account the organization can keep.
  1. In [Google Search Console](https://search.google.com/search-console), add
     a **URL prefix** property for `https://iiumstudent.github.io/Awesome-IIUM/`
     and choose the **HTML tag** method.
  2. Copy only the `content="..."` value into the repository variable
     `GOOGLE_SITE_VERIFICATION`, run the deploy workflow, then press
     **Verify**. (The current code is in `astro.config.mjs`; the variable
     replaces it.) A **Domain** property can't be used: it needs a DNS record
     on `github.io`, which only GitHub controls.
  3. Under **Sitemaps**, submit `sitemap-index.xml`.
  4. In [Bing Webmaster Tools](https://www.bing.com/webmasters), import the
     site from Search Console (or use the `BING_SITE_VERIFICATION` variable
     the same way). Bing also feeds DuckDuckGo, Yahoo, Ecosia and ChatGPT
     search. `YANDEX_SITE_VERIFICATION` works the same way for Yandex.

  The sitemap, page titles, descriptions and structured data are built from
  the pages themselves (`src/routeMiddleware.ts`, `src/utils/seo.ts`); a good
  frontmatter `description` is the snippet people see in search results.

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
  [DESIGN.md](DESIGN.md) explains how it looks and why.
