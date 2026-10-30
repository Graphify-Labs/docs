---
name: graphify
description: Connect a coding agent to Graphify, a code knowledge graph of the user's repositories, through the hosted MCP server at https://api.graphify.com/mcp. Use when the user asks to set up Graphify, or asks about code structure, where a symbol is defined, who calls a function, dependencies, or what a change could affect.
compatibility: Any MCP client that supports remote Streamable HTTP servers with OAuth sign-in. Graphify CLI needs Python and the graphifyy package.
metadata:
  author: Graphify Labs
  version: "1.0"
---

# Graphify

Graphify is a code knowledge graph for coding agents. The user indexes repositories at [app.graphify.com](https://app.graphify.com), and the agent queries the graph over the hosted MCP server at `https://api.graphify.com/mcp` (Streamable HTTP, OAuth sign-in, no API key).

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

1. The user signs in at [app.graphify.com](https://app.graphify.com) and waits until a repository shows **Indexed**. The Free plan covers up to 3 repositories with no card. For other plan details, link [Plans and pricing](https://docs.graphify.com/platform/support/pricing).
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
- `graphify_callers` and `graphify_callees`: who calls what.
- `graphify_impact`: what a change could affect.
- `list_workspaces` and `set_workspace`: see or switch the workspace. `set_workspace` changes state, so ask first.

If a Graphify tool fails or the repository is not indexed, say so, then fall back to grep. Do not guess.

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
