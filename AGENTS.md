# Instructions for agents editing these docs

Follow `CONTRIBUTING.md` at the repository root. It is the source of truth; this file is the short version.

## Project

- Mintlify site. Pages are MDX with YAML frontmatter; navigation, redirects, and agent instructions live in `docs.json`.
- Preview with `npx mint@latest dev`. Check links with `npx mint@latest broken-links`.
- One fix per PR, on a fresh branch from `main`. Never push to or merge into `main`. Keep URLs stable.
- PR checks require: valid `docs.json`, every nav page exists, every redirect destination exists, no description starting with `[`, and no broken links.

## Frontmatter

- `title` in sentence case.
- `description` as one plain sentence, with no `[Local]`/`[Cloud]`/`[Both]` prefix.
- `surface: local | cloud | both`.
- `icon:` on every page: a Lucide name (https://lucide.dev/icons) that fits the topic and isn't repeated within its sidebar group (CI fails on a repeat). No colours or `iconType`. See "Page icons" in CONTRIBUTING.md.

## Terminology

- **Graphify** is the hosted product. Never write "Graphify Cloud" or "Graphify Console". Say "hosted Graphify" only where you contrast it with Graphify CLI.
- **Graphify CLI** is the open-source `graphifyy` package (two y's). Use "Graphify CLI" in headings, nav, tab labels, setup steps and comparison tables, and "open-source Graphify" in running text. The command is `graphify`.
- **Console** is the web UI at app.graphify.com. Don't call it the dashboard, Graphify app, or Platform.
- **Workspace** is personal or team.
- **Graphify GitHub App** is the GitHub integration.

## Style

- Active voice, second person, one idea per sentence, sentence-case headings.
- Bold UI labels exactly as the console shows them. Code-format commands, paths, and file names.

## Accuracy and screenshots

- Verify product behaviour against source (the graphify repo for Graphify CLI, the console source for Graphify, graphify.com/pricing for plans). Don't invent commands, flags, or limits.
- Screenshots: use the open-source Graphify-Labs/graphify repo, never personal repo names. Reuse `images/console/` first. No inline base64 images.
