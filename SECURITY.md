# Security policy

Report security issues privately to [support@lookprep.com](mailto:support@lookprep.com), the
contact LookPrep publishes in
[`/.well-known/security.txt`](https://lookprep.com/.well-known/security.txt), not in public issues
or pull requests. Include the affected file or release, what an agent or a person
could do with it, and steps to reproduce.

## Scope

- This repository: the `lookprep` skill and the plugin and extension manifests. Skill
  instructions that could make an agent collect a person's photo or personal details, send data
  anywhere other than LookPrep's hosted MCP server, act for a person without their authorization,
  or hide a commercial relationship count as security issues. So does a manifest that points at
  any server other than `https://mcp.lookprep.com/mcp`.
- The hosted [LookPrep MCP server](https://github.com/lookprep/lookprep-mcp): report to the same
  address.

## Supported versions

Fixes land on `main` and ship in the next release. Only the latest release is supported.
