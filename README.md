# LookPrep skill and plugins

**Give your AI assistant a lip filler consultation playbook: it explains what named lip looks
mean, shows looks and amounts side by side on demo simulations, quotes current prices, and hands
you to LookPrep to make a simulation on your own face.**

[LookPrep](https://lookprep.com) makes simulations of how lip filler might look: from one photo of
a person's own face, it shows named lip looks and a lip flip at set amounts, side by side, to take
to a consultation. A simulation is for planning and discussion. It is not a prediction of a result
and not medical advice. Photo-based previews are for adults aged 18 or older.

This repository holds one [Agent Skill](https://agentskills.io), `lookprep`, and plugin
manifests that add the skill together with LookPrep's hosted, read-only MCP server
(`https://mcp.lookprep.com/mcp`) to Claude Code, Codex, Cursor and Gemini CLI. Nothing in it runs
when you install it: the skill is plain-language instructions, the server is hosted by LookPrep,
and `scripts/` holds only the repository's own checks.

[Install](#install) · [Try asking](#try-asking) · [What the skill does](#what-the-skill-does) ·
[Privacy and safety](#privacy-and-safety) · [Support](#support)

## Install

**Any agent that reads Agent Skills, one command.** Adds the skill to Claude Code, Codex, Cursor,
Gemini CLI, GitHub Copilot and other agents:

```bash
npx skills add lookprep/skills
```

Installing the skill alone does not connect the LookPrep tools; connect the server as described
in the [MCP server guide](https://github.com/lookprep/lookprep-mcp#connect), or use a plugin below.

**Claude Code.** The plugin adds the skill and connects LookPrep's hosted tools. Nothing runs on
your computer.

```bash
claude plugin marketplace add lookprep/skills
claude plugin install lookprep@lookprep
```

Inside a Claude Code session: `/plugin marketplace add lookprep/skills`, then
`/plugin install lookprep@lookprep`.

**Codex.** Adds this repository as a plugin source; then install LookPrep from the plugin browser
(`/plugins` in a Codex session). Codex reads the [Agent Plugins](https://agent-plugins.org)
manifests `plugin.json` and `mcp.json`.

```bash
codex plugin marketplace add lookprep/skills
```

**Cursor.** Cursor reads `.cursor-plugin/plugin.json`, which adds the skill and the hosted
server. Until the plugin is listed in Cursor's marketplace, add the server from the
[MCP server guide](https://github.com/lookprep/lookprep-mcp#connect) and the skill with
`npx skills add lookprep/skills`.

**Gemini CLI.** The extension adds the skill and the hosted server.

```bash
gemini extensions install https://github.com/lookprep/skills
```

**GitHub CLI.** Adds the skill for GitHub Copilot and the other agents it supports.

```bash
gh skill install lookprep/skills lookprep
```

**Claude on the web, desktop or mobile.** Open **Settings > Connectors**, choose **Add custom
connector** and paste `https://mcp.lookprep.com/mcp`, with no authentication.

**A client that only starts local servers.** Every manifest here connects the hosted server
directly. For a client that can only start a local (stdio) server, the npm package
[`lookprep-mcp`](https://github.com/lookprep/lookprep-mcp#clients-that-only-start-local-servers)
forwards to the same hosted server: command `npx`, arguments `-y lookprep-mcp`.

## Try asking

- "What do Russian lips and cupid's bow lips each mean, and where do sources disagree?"
- "Show me natural lips at two different amounts on a demo face, side by side."
- "How is a lip flip different from filler? Show me both."
- "How much does LookPrep cost, and what is free?"
- "Help me make a list of looks I like and questions for my injector."
- "I want to see these looks on my own face before my consultation. Where do I start?"

## What the skill does

- **Explains look names honestly.** It says what a name such as Russian, cupid's bow or
  heart-shaped lips usually describes, how consistently sources use it, where they disagree, and
  what kind of source each claim comes from.
- **Compares like with like.** It shows two looks, or two amounts of one look, on the same demo
  face, so the only difference is the one you are asking about.
- **Labels every image as a simulation**, never a prediction, and says demo settings are not
  recommended amounts.
- **Prepares you for the consultation.** It collects the looks you like and want to avoid, and
  turns the points where sources disagree into questions for your injector.
- **Hands you to LookPrep for your own simulation.** It gives you a link, with the looks you
  chose already selected if you like; you upload your own photo, confirm you are 18 or older and
  consent, and pay, if you choose, on LookPrep's checkout page.

## Privacy and safety

- **No photos.** The skill tells the agent never to ask for your photo. The tools cannot receive
  one: their inputs are short ids such as `russian` or `natural`.
- **No consent, payment details or email through the agent.** The tools accept none of them.
  You consent yourself on lookprep.com, and payment happens only on LookPrep's checkout page.
- **No medical advice.** The agent will not say a treatment is safe or suitable for you, and will
  not suggest a product, an amount or a dose. Those decisions belong with a qualified clinician.
- **Adults only.** The skill tells the agent not to help anyone who is, or may be, under 18.
- **Read-only, no account.** The hosted server needs no sign-in and sets no cookies. See the
  [MCP server guide](https://github.com/lookprep/lookprep-mcp#privacy) and the
  [Privacy Policy](https://lookprep.com/privacy#agent-connector) for what it receives and logs.

## Repository layout

| Path | Used by |
| --- | --- |
| `skills/lookprep/SKILL.md` | Every agent that reads [Agent Skills](https://agentskills.io) |
| `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json` | Claude Code |
| `assets/icon.svg`, `assets/icon.png` | The plugin icon (SVG for Claude and Cursor; the same artwork as a 512 px PNG for Codex) |
| `plugin.json`, `mcp.json` | [Agent Plugins](https://agent-plugins.org) 1.0.0 clients, including Codex |
| `.cursor-plugin/plugin.json` | Cursor |
| `gemini-extension.json` | Gemini CLI |
| `scripts/` | The repository's own checks (`bash scripts/check-local.sh`). No plugin runs them. |

## Support

- Email [support@lookprep.com](mailto:support@lookprep.com), or see
  [Contact & support](https://lookprep.com/contact).
- For AI agents and the people who run them: [lookprep.com/agents](https://lookprep.com/agents).
- Report security issues privately as described in [SECURITY.md](SECURITY.md).
- [Terms](https://lookprep.com/terms) · [Privacy Policy](https://lookprep.com/privacy)

LookPrep is operated by REPLYPILOT sp. z o.o., a company registered in Poland. The files in this
repository are released under the [MIT License](LICENSE); the LookPrep name and logo are not
covered by that licence.
