// Offline checks for this repository: the skill's frontmatter, every plugin
// manifest, the layout and the listing details. No dependencies, no network.
//   node scripts/validate.mjs [repository root]
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const ENDPOINT = "https://mcp.lookprep.com/mcp";
const NAME = "lookprep";
const AGENT_PLUGINS_PLUGIN = "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json";
const AGENT_PLUGINS_MCP = "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json";
const SKILL_KEYS = ["name", "description", "license", "compatibility", "metadata", "allowed-tools"];
// Documented in Claude Code's plugin reference; anything else fails `claude plugin validate --strict`.
const CLAUDE_PLUGIN_KEYS = ["$schema", "name", "displayName", "version", "description", "author", "homepage", "repository", "license",
  "keywords", "icon", "documentationUrl", "supportUrl", "privacyPolicyUrl", "termsOfServiceUrl", "mcpServers", "skills"];
const CURSOR_PLUGIN_KEYS = ["name", "description", "version", "author", "homepage", "repository", "license", "keywords", "logo", "skills", "mcpServers"];
const AGENT_PLUGIN_KEYS = ["$schema", "name", "version", "description", "author", "homepage", "repository", "license", "keywords", "extensions"];

function frontmatter(text) {
  const match = /^---\n([\s\S]*?)\n---\n/.exec(text);
  if (!match) return null;
  const fields = {};
  for (const line of match[1].split("\n")) {
    const pair = /^([a-z-]+):\s?(.*)$/.exec(line);
    if (!pair) return null;
    fields[pair[1]] = pair[2];
  }
  return fields;
}

function walk(root, relative = "") {
  const files = [];
  for (const entry of readdirSync(path.join(root, relative), { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const child = path.posix.join(relative, entry.name);
    if (entry.isDirectory()) files.push(...walk(root, child));
    else files.push(child);
  }
  return files;
}

export function validate(root) {
  const problems = [];
  const check = (ok, message) => ok || problems.push(message);
  const read = (file) => readFileSync(path.join(root, file), "utf8");
  const json = (file) => {
    try {
      return JSON.parse(read(file));
    } catch (error) {
      problems.push(`${file}: ${error instanceof Error ? error.message : error}`);
      return {};
    }
  };

  const files = walk(root);
  check(!files.includes("SKILL.md"), "no SKILL.md at the root: it hides the skills folder from skill installers");
  check(!files.some((file) => file.startsWith("bin/")), "no top-level bin/ folder");
  check(!files.some((file) => path.posix.basename(file) === ".DS_Store"), "no .DS_Store files");
  // Claude Code's docs keep everything but the manifests out of .claude-plugin/.
  check(files.filter((file) => file.startsWith(".claude-plugin/")).sort().join() === ".claude-plugin/marketplace.json,.claude-plugin/plugin.json",
    ".claude-plugin/ holds only plugin.json and marketplace.json");

  // The skill.
  const skills = files.filter((file) => /^skills\/[^/]+\/SKILL\.md$/.test(file));
  check(skills.length === 1 && skills[0] === `skills/${NAME}/SKILL.md`, `exactly one skill, skills/${NAME}/SKILL.md`);
  const skillText = existsSync(path.join(root, `skills/${NAME}/SKILL.md`)) ? read(`skills/${NAME}/SKILL.md`) : "";
  const meta = frontmatter(skillText);
  if (!meta) {
    problems.push("SKILL.md needs single-line key: value frontmatter between --- lines");
  } else {
    check(Object.keys(meta).every((key) => SKILL_KEYS.includes(key)), `SKILL.md frontmatter keys must be among ${SKILL_KEYS.join(", ")}`);
    check(meta.name === NAME && /^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/.test(meta.name) && !meta.name.includes("--"), "skill name must be lookprep, matching its folder");
    check(meta.description?.length >= 1 && meta.description.length <= 1024, "skill description must be 1 to 1,024 characters");
    check(meta.compatibility === undefined || (meta.compatibility.length >= 1 && meta.compatibility.length <= 500), "skill compatibility must be at most 500 characters");
    check(meta.license === "MIT", "skill license must be MIT");
  }
  check(skillText.split("\n").length < 500, "SKILL.md must stay under 500 lines");

  // Manifests: one name, one version, one endpoint.
  const claude = json(".claude-plugin/plugin.json");
  const marketplace = json(".claude-plugin/marketplace.json");
  const cursor = json(".cursor-plugin/plugin.json");
  const agentPlugin = json("plugin.json");
  const agentMcp = json("mcp.json");
  const gemini = json("gemini-extension.json");
  const version = claude.version;
  check(/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version ?? ""), ".claude-plugin/plugin.json version must be MAJOR.MINOR.PATCH");
  for (const [file, manifest] of [[".claude-plugin/plugin.json", claude], [".cursor-plugin/plugin.json", cursor], ["plugin.json", agentPlugin], ["gemini-extension.json", gemini]]) {
    check(manifest.name === NAME, `${file} name must be ${NAME}`);
    check(manifest.version === version, `${file} version must be ${version}`);
  }

  check(Object.keys(claude).every((key) => CLAUDE_PLUGIN_KEYS.includes(key)), `.claude-plugin/plugin.json: only documented fields (${CLAUDE_PLUGIN_KEYS.join(", ")})`);
  check(JSON.stringify(claude.mcpServers) === JSON.stringify({ [NAME]: { type: "http", url: ENDPOINT } }), `.claude-plugin/plugin.json must connect exactly ${ENDPOINT} over http`);
  for (const key of ["homepage", "documentationUrl", "supportUrl", "privacyPolicyUrl", "termsOfServiceUrl"]) {
    check(typeof claude[key] === "string" && claude[key].startsWith("https://"), `.claude-plugin/plugin.json ${key} must be an https URL`);
  }
  check(typeof claude.icon === "string" && claude.icon.startsWith("./") && existsSync(path.join(root, claude.icon)), ".claude-plugin/plugin.json icon must be an existing ./ path");

  check(marketplace.name === NAME && marketplace.owner?.name === "LookPrep", "marketplace name lookprep, owner LookPrep");
  check(Array.isArray(marketplace.plugins) && marketplace.plugins.length === 1 && marketplace.plugins[0].name === NAME && marketplace.plugins[0].source === "./",
    "the marketplace lists exactly this plugin with source ./");

  check(Object.keys(cursor).every((key) => CURSOR_PLUGIN_KEYS.includes(key)), `.cursor-plugin/plugin.json: only documented fields (${CURSOR_PLUGIN_KEYS.join(", ")})`);
  check(cursor.author && Object.keys(cursor.author).every((key) => key === "name" || key === "email"), ".cursor-plugin/plugin.json author takes only name and email");
  check(JSON.stringify(cursor.mcpServers) === JSON.stringify({ [NAME]: { url: ENDPOINT } }), `.cursor-plugin/plugin.json must connect exactly ${ENDPOINT}`);
  check(typeof cursor.logo === "string" && !cursor.logo.includes("..") && existsSync(path.join(root, cursor.logo)), ".cursor-plugin/plugin.json logo must be an existing path inside the repository");

  check(agentPlugin.$schema === AGENT_PLUGINS_PLUGIN, `plugin.json $schema must be ${AGENT_PLUGINS_PLUGIN}`);
  check(Object.keys(agentPlugin).every((key) => AGENT_PLUGIN_KEYS.includes(key)), `plugin.json: only Agent Plugins 1.0.0 fields (${AGENT_PLUGIN_KEYS.join(", ")})`);
  check(agentMcp.$schema === AGENT_PLUGINS_MCP, `mcp.json $schema must be ${AGENT_PLUGINS_MCP}`);
  check(JSON.stringify(agentMcp.mcpServers) === JSON.stringify({ [NAME]: { type: "streamable-http", url: ENDPOINT } }), `mcp.json must connect exactly ${ENDPOINT}`);
  // Gemini CLI 0.70 reads type "http" with url as Streamable HTTP and calls the older httpUrl deprecated.
  check(JSON.stringify(gemini.mcpServers) === JSON.stringify({ [NAME]: { type: "http", url: ENDPOINT } }), `gemini-extension.json must connect exactly ${ENDPOINT} (type http)`);
  const ui = agentPlugin.extensions?.["com.openai"]?.interface ?? {};
  for (const key of ["composerIcon", "logo"]) {
    check(typeof ui[key] === "string" && ui[key].startsWith("./") && existsSync(path.join(root, ui[key])), `plugin.json interface ${key} must be an existing ./ path`);
  }
  check(Array.isArray(ui.defaultPrompt) && ui.defaultPrompt.length <= 3 && ui.defaultPrompt.every((prompt) => typeof prompt === "string" && prompt.length <= 128),
    "plugin.json interface defaultPrompt: at most three strings of at most 128 characters");

  // The icon: a square SVG of at least 128 px.
  const icon = claude.icon && existsSync(path.join(root, claude.icon)) ? read(claude.icon) : "";
  const box = /viewBox="0 0 (\d+) (\d+)"/.exec(icon);
  check(icon.startsWith("<svg") && box && box[1] === box[2] && Number(box[1]) >= 128, "the icon must be a square SVG of at least 128 px");

  // Listing details.
  const readme = existsSync(path.join(root, "README.md")) ? read("README.md") : "";
  const prose = readme.replace(/```[\s\S]*?```/g, " ").split(/\s+/).filter((word) => /[A-Za-z]/.test(word));
  check(prose.length >= 40, "README.md needs at least 40 words outside code blocks");
  check(existsSync(path.join(root, "LICENSE")) && claude.license === "MIT", "a LICENSE file and license MIT");
  check(new RegExp(`^## ${String(version).replaceAll(".", "\\.")}$`, "m").test(existsSync(path.join(root, "CHANGELOG.md")) ? read("CHANGELOG.md") : ""),
    `CHANGELOG.md needs a "## ${version}" section`);
  for (const file of files) {
    check(statSync(path.join(root, file)).size <= 256 * 1024, `${file} is over 256 KiB`);
  }
  return problems;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const root = path.resolve(process.argv[2] ?? fileURLToPath(new URL("..", import.meta.url)));
  const problems = validate(root);
  if (problems.length) {
    console.error(`Validation failed:\n- ${problems.join("\n- ")}`);
    process.exit(1);
  }
  console.log("OK: skill, manifests, layout and listing details");
}
