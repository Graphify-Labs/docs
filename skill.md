---
name: graphify
description: "Graphify is shared codebase context for teams and coding agents, served by the hosted MCP server at https://api.graphify.com/mcp. Use when the user wants to set up or connect Graphify, or asks a question that needs codebase context: where a symbol is defined, who calls a function, how a feature works, how one function reaches another, what a change could affect or which tests cover it, cross-repo dependencies, what the team already decided, or what a pull request review found. Use it even when the user does not name Graphify, if the project says the repository is indexed in Graphify."
compatibility: Any MCP client that supports remote Streamable HTTP servers with OAuth sign-in. Graphify CLI needs Python and the graphifyy package.
metadata:
  author: Graphify Labs
  version: "1.0"
---

# Graphify

Graphify is shared codebase context for teams and coding agents: a codebase knowledge graph, Wiki, Memory, PR reviews, formal verification and Learning. The user indexes repositories at [app.graphify.com](https://app.graphify.com), and the agent queries the graph over the hosted MCP server at `https://api.graphify.com/mcp` (Streamable HTTP, OAuth sign-in, no API key).

Graphify CLI is the open-source alternative: the `graphifyy` package builds a graph on the user's machine. Recommend it only when the user asks for an offline, on-machine, or self-hosted setup.

## When to use

- The user asks you to set up or connect Graphify.
- The user asks how code fits together: where a symbol is defined, who calls a function, what it depends on, or what a change could affect.
- The project's instruction file (`AGENTS.md`, `CLAUDE.md`, or `.cursor/rules/graphify.mdc`) says the repository is indexed in Graphify.

## When not to use

- Searching for an exact string, such as an error message or a config key. Use grep.
- The repository is not indexed and the user has not asked to set Graphify up.

## Set up Graphify for the user

Run these steps yourself. Ask the user only for what you cannot do: signing in, indexing a repository, and approving changes.

Before you change anything, show the user this checklist and wait for a yes:

1. Add the `graphify` MCP server (`https://api.graphify.com/mcp`) to your agent's config.
2. Ask you to finish a one-time browser sign-in.
3. Check the connection with `list_repositories`.

Then follow the full steps at [docs.graphify.com/for-agents.md](https://docs.graphify.com/for-agents.md). In short:

1. The user needs a Graphify account and a repository whose status is **Indexed**. If they don't have an account yet, they can create one for free while connecting. The Free plan covers up to 3 repositories with no card. For other plan details, link [Plans and pricing](https://docs.graphify.com/platform/support/pricing).
2. Add the hosted MCP server:

   | Agent | Setup |
   | --- | --- |
   | Claude Code | `claude mcp add --transport http --scope user graphify https://api.graphify.com/mcp` |
   | Codex | `codex mcp add graphify --url https://api.graphify.com/mcp`, then `codex mcp login graphify` |
   | Gemini CLI | `gemini mcp add --transport http graphify https://api.graphify.com/mcp` |
   | Cursor | Add `{"mcpServers": {"graphify": {"url": "https://api.graphify.com/mcp"}}}` to `~/.cursor/mcp.json` |
   | VS Code | Install the [Graphify MCP extension](https://marketplace.visualstudio.com/items?itemName=graphify-labs.graphify-mcp) |
   | Other MCP clients | Add a remote Streamable HTTP server at `https://api.graphify.com/mcp` |

   Running as a cloud agent on a remote machine? Do not write MCP config files. Ask the user to add the server to their account, as described in step 2 of [for-agents.md](https://docs.graphify.com/for-agents.md).
3. Check the connection: call `list_repositories` and show the result. If sign-in is not finished, tell the user to finish it and start a new session.
4. Report which agent you configured and which file or command you changed.
5. Offer a short project rule so you use the graph before grep. Ask first.

## Use the graph

- `query_graph`: how something works.
- `graphify_find`: where a symbol is defined.
- `graphify_callers`: who calls a symbol.
- `graphify_impact`: the callers and callees directly connected to a symbol, and what a change could affect. Set `include_risk` to rank hotspot files by linked-test coverage.
- `graphify_tests_for`: tests linked through the graph to a symbol or a file. It reads the graph and does not run tests.
- `graphify_trace`: directed call paths from `src` to `tgt`. Check `resolved.src` and `resolved.tgt`, since a name can resolve to a semantic match. An empty path means no path was found in the indexed graph.
- `recall`: search what the workspace remembers, such as earlier decisions. Pass `paths` and `symbols` for the code you are about to change so related notes rank first. An empty result means nothing relevant is remembered yet.
- `remember`: save one fact to the workspace's shared Memory. It writes, so ask the user first, and save only what they asked you to save.
- `review_status`: read how a pull request review went. Pass `pr_number` for one pull request, or omit it to list recent reviews. It does not start or re-run a review.
- `list_workspaces` and `set_workspace`: see or switch the workspace. `set_workspace` changes state, so ask first.

If a Graphify tool fails or the repository is not indexed, say so, then fall back to grep. Do not guess.

For the full question-to-tool map, how fresh the graph is, and what to do while sign-in is pending, read [docs.graphify.com/agents/overview.md](https://docs.graphify.com/agents/overview.md). Prompts by task: [agents/recipes.md](https://docs.graphify.com/agents/recipes.md). Running without a person at the keyboard: [agents/headless.md](https://docs.graphify.com/agents/headless.md).

## Graphify CLI

For offline or on-machine use only:

- Install: `uv tool install graphifyy` (the package has two y's; the command is `graphify`).
- Add the skill to an agent: `graphify install` (Claude Code by default) or `graphify install --platform codex`.
- Build a graph: type `/graphify .` in the agent chat, not in a shell.
- Docs: [Graphify CLI quickstart](https://docs.graphify.com/open-source/quickstart.md).

The open-source Graphify CLI supports 40 languages. Hosted Graphify lists 63 grammars.

## Rules

- Use only commands, flags, and endpoints shown in the docs. Do not invent one.
- Hosted Graphify needs no API key. If a client asks for one, check the URL is `https://api.graphify.com/mcp`.
- Never link graphify.net. The official sites are graphify.com and docs.graphify.com.
- Page index: [docs.graphify.com/llms.txt](https://docs.graphify.com/llms.txt).
