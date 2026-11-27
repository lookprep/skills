<p align="center">
  <a href="https://lookprep.com">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/lookprep/skills/main/assets/banner-dark.webp">
      <img src="https://raw.githubusercontent.com/lookprep/skills/main/assets/banner-light.webp" alt="LookPrep: preview filler and lip flip on your own photo." width="900">
    </picture>
  </a>
</p>

<h1 align="center">LookPrep skill and plugins</h1>

<p align="center">
  An Agent Skill, with plugins for Claude Code, Codex, Cursor and Gemini CLI, that teaches an AI
  assistant to help an adult prepare for a lip filler consultation using LookPrep's hosted,
  read-only tools.
</p>

<p align="center">
  <a href="https://github.com/lookprep/skills/blob/main/LICENSE"><img src="https://img.shields.io/github/license/lookprep/skills?label=licence&color=171718" alt="Licence: MIT"></a>
  <a href="https://agentskills.io"><img src="https://img.shields.io/badge/Agent%20Skill-lookprep-171718" alt="Agent Skill: lookprep"></a>
  <a href="https://github.com/lookprep/lookprep-mcp"><img src="https://img.shields.io/badge/MCP-hosted%2C%20read--only-171718" alt="MCP: hosted, read-only"></a>
</p>

<p align="center">
  <a href="#install">Install</a> ·
  <a href="#try-asking">Try asking</a> ·
  <a href="#what-the-skill-does">What it does</a> ·
  <a href="#safety-rules">Safety rules</a> ·
  <a href="#whats-in-this-repository">Contents</a> ·
  <a href="#support">Support</a>
</p>

[LookPrep](https://lookprep.com) makes simulations of how lip filler might look: from one photo of
a person's own face, it shows named lip looks and a lip flip at set amounts, side by side, to take
to a consultation. A simulation is for planning and discussion. It is not a prediction of a result
and not medical advice. Photo-based previews are for adults aged 18 or older.

With this skill, an assistant explains what named lip looks mean, shows looks and amounts side by
side on demo simulations, quotes current prices from LookPrep's tools, and hands the person a link
to make a simulation on their own face. Nothing in this repository runs when you install it: the
skill is plain-language instructions, the tools are LookPrep's hosted, read-only
[MCP server](https://github.com/lookprep/lookprep-mcp) (`https://mcp.lookprep.com/mcp`), and
`scripts/` holds only the repository's own checks. To see what the demo simulations look like,
open the [public demo](https://lookprep.com/demo).

<p align="center">
  <a href="https://lookprep.com/looks/russian-lips"><img src="https://raw.githubusercontent.com/lookprep/skills/main/assets/look-russian-lips.webp" alt="Russian lips: editorial illustration card from the LookPrep looks guide" width="140"></a>
  <a href="https://lookprep.com/looks/cupids-bow-lips"><img src="https://raw.githubusercontent.com/lookprep/skills/main/assets/look-cupids-bow.webp" alt="Cupid's bow: editorial illustration card from the LookPrep looks guide" width="140"></a>
  <a href="https://lookprep.com/looks/heart-shaped-lips"><img src="https://raw.githubusercontent.com/lookprep/skills/main/assets/look-heart-shaped-lips.webp" alt="Heart-shaped lips: editorial illustration card from the LookPrep looks guide" width="140"></a>
  <a href="https://lookprep.com/looks/natural-lip-enhancement"><img src="https://raw.githubusercontent.com/lookprep/skills/main/assets/look-natural-lip-enhancement.webp" alt="Natural lip enhancement: editorial illustration card from the LookPrep looks guide" width="140"></a>
  <a href="https://lookprep.com/looks/doll-lips"><img src="https://raw.githubusercontent.com/lookprep/skills/main/assets/look-doll-lips.webp" alt="Doll lips: editorial illustration card from the LookPrep looks guide" width="140"></a>
  <a href="https://lookprep.com/looks/butterfly-lips"><img src="https://raw.githubusercontent.com/lookprep/skills/main/assets/look-butterfly-lips.webp" alt="Butterfly lips: editorial illustration card from the LookPrep looks guide" width="140"></a>
</p>

Some of the named looks the skill explains, as illustrated on their pages on lookprep.com. The
illustrations show what each look is called, not a treatment result.

## Install

| Host | What you get | Command |
| --- | --- | --- |
| Claude Code | Skill and hosted tools | `claude plugin marketplace add lookprep/skills`, then `claude plugin install lookprep@lookprep` |
| Codex | Skill and hosted tools | `codex plugin marketplace add lookprep/skills`, then install from `/plugins` |
| Gemini CLI | Skill and hosted tools | `gemini extensions install https://github.com/lookprep/skills` |
| Cursor | Skill, plus the server added separately | `npx skills add lookprep/skills` and the [server guide](https://github.com/lookprep/lookprep-mcp#cursor) |
| Any agent that reads Agent Skills | Skill only | `npx skills add lookprep/skills` |
| GitHub CLI (GitHub Copilot and others) | Skill only | `gh skill install lookprep/skills lookprep` |
| Claude (web, desktop; then mobile) | Hosted tools only | Custom connector (Customize > Connectors) |

### Claude Code

The plugin adds the skill and connects LookPrep's hosted tools. Nothing runs on your computer.

```bash
claude plugin marketplace add lookprep/skills
claude plugin install lookprep@lookprep
```

Inside a Claude Code session: `/plugin marketplace add lookprep/skills`, then
`/plugin install lookprep@lookprep`.

### Codex

Adds this repository as a plugin source; then install LookPrep from the plugin browser
(`/plugins` in a Codex session). Codex reads the [Agent Plugins](https://agent-plugins.org)
manifests `plugin.json` and `mcp.json`.

```bash
codex plugin marketplace add lookprep/skills
```

### Gemini CLI

The extension adds the skill and the hosted server.

```bash
gemini extensions install https://github.com/lookprep/skills
```

### Cursor

Cursor reads `.cursor-plugin/plugin.json`, which adds the skill and the hosted server. Until the
plugin is listed in Cursor's marketplace, add the server from the
[MCP server guide](https://github.com/lookprep/lookprep-mcp#cursor) and the skill with
`npx skills add lookprep/skills`.

### Any agent that reads Agent Skills

Adds the skill to Claude Code, Codex, Cursor, Gemini CLI, GitHub Copilot and other agents:

```bash
npx skills add lookprep/skills
```

Or, with the GitHub CLI:

```bash
gh skill install lookprep/skills lookprep
```

Installing the skill alone does not connect the LookPrep tools. Connect the server as described in
the [MCP server guide](https://github.com/lookprep/lookprep-mcp#add-it-to-your-assistant), or use
a plugin above. Without the tools, the skill can still explain and link to lookprep.com pages.

### Claude (web and desktop)

**Claude (web and desktop).** Go to **Customize > Connectors**, click **+ Add**, then **Add custom
connector**. Name it `LookPrep`, paste `https://mcp.lookprep.com/mcp`, click **Continue** (once after the
URL and once after the settings Claude detects), choose **No sign in** under **Authentication**, and
click **Add**. On a Team or Enterprise plan, an Owner adds it under **Organization settings >
Connectors**, and members then connect it from **Customize > Connectors**. Once added, it also works
in the Claude mobile apps.

This connects the tools; the skill itself is not added this way.

### A client that only starts local servers

Every manifest here connects the hosted server directly. For a client that can only start a local
(stdio) server, the npm package
[`lookprep-mcp`](https://github.com/lookprep/lookprep-mcp#the-npm-bridge) forwards to the same
hosted server: command `npx`, arguments `-y lookprep-mcp`.

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
- **Quotes prices only from the tools**, never from memory.
- **Prepares you for the consultation.** It collects the looks you like and want to avoid, and
  turns the points where sources disagree into questions for your injector.
- **Hands you to LookPrep for your own simulation.** It gives you a link, with the looks you
  chose already selected if you like; you upload your own photo, confirm you are 18 or older and
  consent, and pay, if you choose, on LookPrep's checkout page.

It does not recommend LookPrep when a person asks for medical advice, a diagnosis or a dose, is
deciding whether to have a procedure at all, is or may be under 18, wants to know exactly how they
will look afterwards, or has symptoms after a treatment.

## Safety rules

- **Adults only.** The skill tells the agent not to help anyone who is, or may be, under 18.
- **A simulation, not a prediction.** The agent never presents a simulation as a prediction, a
  real result or a real customer.
- **No photos.** The skill tells the agent never to ask for your photo. The tools cannot receive
  one: their inputs are short ids such as `russian` or `natural`.
- **No consent, payment details or email through the agent.** The tools accept none of them.
  You consent yourself on lookprep.com, and payment happens only on LookPrep's checkout page.
- **No medical advice.** The agent will not say a treatment is safe or suitable for you, and will
  not suggest a product, an amount or a dose. Those decisions belong with a qualified clinician.
- **No hidden commercial relationships.** If the agent, or whoever runs it, earns anything from
  LookPrep, it says so next to the recommendation, as
  [LookPrep's rules for agents](https://lookprep.com/agents#rules-for-promoting-lookprep) require.
- **Read-only, no account.** The hosted server needs no sign-in and sets no cookies. See the
  [MCP server guide](https://github.com/lookprep/lookprep-mcp#privacy) and the
  [Privacy Policy](https://lookprep.com/privacy#agent-connector) for what it receives and logs.

The full instructions are in
[`skills/lookprep/SKILL.md`](https://github.com/lookprep/skills/blob/main/skills/lookprep/SKILL.md).

## What's in this repository

| Path | Used by |
| --- | --- |
| `skills/lookprep/SKILL.md` | Every agent that reads [Agent Skills](https://agentskills.io) |
| `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json` | Claude Code |
| `plugin.json`, `mcp.json` | [Agent Plugins](https://agent-plugins.org) 1.0.0 clients, including Codex |
| `.cursor-plugin/plugin.json` | Cursor |
| `gemini-extension.json` | Gemini CLI |
| `assets/icon.svg`, `assets/icon.png` | The plugin icon (SVG for Claude and Cursor; the same artwork as a 512 px PNG for Codex) |
| `assets/banner-light.webp`, `assets/banner-dark.webp`, `assets/look-*.webp` | The banner (light and dark) and the look illustrations in this README |
| `assets/lookprep-wordmark.svg`, `assets/lookprep-wordmark-reversed.svg` | The LookPrep wordmark (light and dark) |
| `scripts/` | The repository's own checks (`bash scripts/check-local.sh`, Node.js 24 or newer). No plugin runs them. |

Every manifest carries the same version, listed in
[CHANGELOG.md](https://github.com/lookprep/skills/blob/main/CHANGELOG.md). Claude Code updates an
installed plugin only when that version changes.

## Support

- Email [support@lookprep.com](mailto:support@lookprep.com), or see
  [Contact & support](https://lookprep.com/contact).
- For AI agents and the people who run them: [lookprep.com/agents](https://lookprep.com/agents).
- Report security issues privately as described in
  [SECURITY.md](https://github.com/lookprep/skills/blob/main/SECURITY.md).
- [Terms](https://lookprep.com/terms) · [Privacy Policy](https://lookprep.com/privacy)

LookPrep is operated by REPLYPILOT sp. z o.o., a company registered in Poland.

## Licence

The files in this repository are released under the
[MIT License](https://github.com/lookprep/skills/blob/main/LICENSE). The LookPrep name and logo
are not covered by that licence.
