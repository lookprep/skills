import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { validate } from "./validate.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));

function copy(t) {
  const dir = mkdtempSync(path.join(tmpdir(), "skills-validate-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  cpSync(root, dir, { recursive: true, filter: (source) => !source.includes(`${path.sep}.git${path.sep}`) });
  return dir;
}

function edit(dir, file, change) {
  const target = path.join(dir, file);
  writeFileSync(target, change(readFileSync(target, "utf8")));
}

test("this repository passes", () => {
  assert.deepEqual(validate(root), []);
});

for (const [label, file, change, pattern] of [
  ["a manifest pointing at another server", "mcp.json", (text) => text.replace("https://mcp.lookprep.com/mcp", "https://example.com/mcp"), /mcp\.json must connect/],
  ["a version that differs between manifests", "gemini-extension.json", (text) => text.replace(/"version": "[^"]+"/, '"version": "9.9.9"'), /gemini-extension\.json version/],
  ["an undocumented Claude plugin field", ".claude-plugin/plugin.json", (text) => text.replace('"name": "lookprep",', '"name": "lookprep",\n  "logo": "x",'), /only documented fields/],
  ["an unknown skill frontmatter key", "skills/lookprep/SKILL.md", (text) => text.replace("license: MIT", "license: MIT\nversion: 1"), /frontmatter keys/],
  ["a Cursor author url", ".cursor-plugin/plugin.json", (text) => text.replace('"email": "support@lookprep.com"', '"email": "support@lookprep.com", "url": "https://lookprep.com"'), /author takes only/],
]) {
  test(`validation fails on ${label}`, (t) => {
    const dir = copy(t);
    edit(dir, file, change);
    assert.ok(validate(dir).some((problem) => pattern.test(problem)), validate(dir).join("\n"));
  });
}

test("validation fails on a root SKILL.md and on .DS_Store", (t) => {
  const dir = copy(t);
  writeFileSync(path.join(dir, "SKILL.md"), "x");
  writeFileSync(path.join(dir, ".DS_Store"), "x");
  const problems = validate(dir).join("\n");
  assert.match(problems, /no SKILL\.md at the root/);
  assert.match(problems, /no \.DS_Store/);
});
