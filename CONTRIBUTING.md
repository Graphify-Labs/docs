# Contributing to the Graphify docs

This repo is the source for [docs.graphify.com](https://docs.graphify.com), a [Mintlify](https://mintlify.com) site. Every merge to `main` deploys to production.

## Preview locally

```bash
npx mint@latest dev            # http://localhost:3000
npx mint@latest broken-links   # same link check CI runs
```

Run both from the repo root, where `docs.json` lives. Each PR also gets a Mintlify preview deployment, linked from the PR checks.

## Pull requests

- **One fix per PR**, on a fresh branch from the latest `main`. Never push to `main`.
- Say what changed and why, and list what you checked (local preview, rendered pages, source you verified against).
- Keep URLs stable. If a page must move, add an entry to `redirects` in `docs.json`.

## PR checks

`.github/workflows/docs-checks.yml` runs on every pull request and must pass:

| Check | Fails when |
| --- | --- |
| docs.json is valid JSON | `docs.json` doesn't parse |
| Every nav page exists | a `pages` or `root` entry has no matching `.mdx` or `.md` file |
| Every redirect destination exists | a local `redirects` destination isn't a real page |
| No description starts with a tag | a `description:` starts with `[` |
| Page icons | two icons repeat within one sidebar group, or a product-name page under `integrations/` has an `icon:` (a missing `icon:` elsewhere is only a warning) |
| Mintlify broken links | `mint broken-links` finds a broken internal link |

## Frontmatter

```yaml
---
title: "Connect a repository"
description: "Connect repositories, configure analysis, and track indexing builds."
surface: "cloud"
---
```

- `title`: sentence case.
- `description`: one plain sentence. It appears under the page title, in search, and in `llms.txt`. No `[Local]`, `[Cloud]`, or `[Both]` prefix.
- Keep `title` at 60 characters or fewer and `description` at 155 or fewer. CI fails the build when either is longer.
- Write the Free plan and trial line as plain text: "The Free plan (up to 3 repositories) needs no card. Pro and Teams start with a 14-day trial, card required." On the homepage card use "Free to start, no card required." Don't import JS variables into pages; the hosted build and the `.md`/`llms.txt` output don't render them. Search for the sentence with `git grep "14-day Pro trial"` when it changes.
- `surface`: `local`, `cloud`, or `both`. It's the source of truth for which product a page covers. Agents tell the surface from the page path, so keep Graphify pages under `platform/` and the hosted MCP group, and Graphify CLI pages under `open-source/` and the Graphify CLI tabs in Integrations. If you change that layout, update the surface rules in `docs.json` (`markdown.instructions`) and `for-agents.mdx`.

## Page icons

Concept, guide, and Overview pages have an icon, so a new page of that kind needs an `icon:` in its frontmatter. Pages named after a product, tool, or integration (everything under `integrations/` except its Overview, such as Claude Code, Cursor, GitHub, or GitLab) have no icon: the name already identifies the page, and a generic glyph next to a brand name reads as noise. You don't need Mintlify access for this; it's one line in the `.mdx` file.

```yaml
---
title: "Test impact analysis"
description: "..."
surface: "cloud"
icon: "flask-conical"
---
```

- Use a [Lucide](https://lucide.dev/icons) icon name (the site sets `icons.library: "lucide"`). Use the name exactly as Lucide lists it, in kebab-case.
- Pick by topic. Examples from our pages: `zap` (Quickstart), `gauge` (Rate limits), `lock` (Security and data), `git-pull-request` (Pull request reviews), `database` (Databases), `square-terminal` (CLI reference).
- Don't repeat an icon within the same sidebar group (a `group` in `docs.json`); the PR check fails if you do. Reusing an icon in a different group is fine, such as `house` on each tab's Overview.
- Don't add colours or `iconType`. `sidebar-groups.css` makes icons neutral grey (off-white in dark mode) and green only on the active page.
- Check it renders: run `npx mint@latest dev` and open the page. If the icon is missing from the sidebar, the name is wrong or Lucide renamed it (for example `circle-help` is now `circle-question-mark`). If you edit frontmatter while `mint dev` is running and the sidebar doesn't update, restart `mint dev`.
- The "Page icons" PR check warns about any other nav page without an icon, fails on a duplicate icon within one sidebar group, and fails if a product-name page under `integrations/` has an `icon:`.

## Terminology

- **Graphify**: the hosted product. Never write "Graphify Cloud" or "Graphify Console". Say "hosted Graphify" only where you contrast it with Graphify CLI.
- **Graphify CLI**: the open-source package on your machine. Use "Graphify CLI" in headings, nav, tab labels, setup steps and comparison tables, and "open-source Graphify" in running text. The PyPI package is `graphifyy` (two y's); the command is `graphify`.
- **Console**: the web UI at [app.graphify.com](https://app.graphify.com). Not "dashboard", "Graphify app", or "Platform".
- **Workspace**: where work lives in the console, either personal or a team workspace.
- **Graphify GitHub App**: the GitHub integration.
- Bold UI labels exactly as the console shows them: click **Repositories**.

## Screenshots

- Capture from the open-source [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) repo. Never show personal or customer repo names, emails, or tokens.
- Reuse the console-tour images in `images/console/` before taking new ones.
- Store images under `images/`, not inline base64, and give every image useful `alt` text.

## Fact-check against source

Every claim about product behaviour (labels, menus, limits, plan caps, commands, flags, MCP setup) must match the source:

- Graphify CLI: the [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) repo and `graphify --help`.
- Graphify: the console source. Quote UI text as written.
- Pricing: [graphify.com/pricing](https://graphify.com/pricing).

If you can't verify something, leave it out or flag it in the PR.
