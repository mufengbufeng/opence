# Change: Add OpenCode Support

## Why

OpenCode is a popular AI coding assistant (similar to Claude) that supports custom commands and skills. Currently, opence only supports Claude's directory structure (`.claude/`), limiting adoption by OpenCode users. Adding OpenCode support will:

- Allow OpenCode users to use opence workflow (plan/work/review/compound/archive)
- Enable sharing of opence-native skills and commands with OpenCode community
- Support dual-tool workflows (users can use both Claude and OpenCode)
- Align with OpenCode's configuration standards (opencode.json, .opencode/, ~/.config/opencode/)

## What Changes

- Add support for `.opencode/commands/` directory for custom commands (parallel to `.claude/commands/`)
- Add support for `opencode.json`/`opencode.jsonc` configuration files for command definitions
- Add support for `~/.config/opencode/` global directory for commands and skills
- Update `opence init` to detect and configure OpenCode alongside Claude
- Update `opence update` to sync opence-native skills and commands to OpenCode directories
- Update skill management commands (`opence skill add/list/show/update/remove`) to support OpenCode directories
- OpenCode Skills: Already compatible via `.claude/skills/*` format (OpenCode supports this natively)

## Impact

- Affected specs: 
  - `cli-initialization` (if exists) - for `opence init` changes
  - `cli-update-command` (if exists) - for `opence update` changes
  - `cli-skill-commands` - for skill management changes
  - `opence-native-skills` - for skill distribution to OpenCode
  - New spec: `opencode-integration` - for OpenCode-specific features

- Affected code:
  - CLI initialization logic (tool detection)
  - Template generation for commands and skills
  - Skill management commands (directory resolution)
  - Update command (multi-tool sync logic)

- Breaking changes: None (additive changes only)

- Migration: Existing Claude-only projects continue working unchanged; new projects can choose OpenCode during `opence init`
