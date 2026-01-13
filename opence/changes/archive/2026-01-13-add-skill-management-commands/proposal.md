# Change: Add CLI commands for skills management

## Why

当前项目的 skills 创建和管理相关内容比较模糊且分散。虽然 `opence init` 会为选中的 AI 工具创建 opence 自带的 skills（plan, work, review, compound），但对于用户自定义的项目 skills，目前没有统一的管理方式。

Since `opence init` already tracks which AI tools the user has selected (claude, codex, github-copilot) and stores configuration, it makes sense to provide a unified CLI command that:
- Leverages this stored configuration to automatically create skills in the correct directories
- Provides consistent management for both opence-native skills and user-defined project skills
- Offers discovery, listing, updating, and removal capabilities

This will make skills management more discoverable and consistent with the rest of the opence workflow.

## What Changes

- Add `opence skill` command group with subcommands:
  - `opence skill add <name>` - Create a new user-defined skill with proper directory structure
  - `opence skill list` - List all skills (opence-native and user-defined) across configured tools
  - `opence skill update <name>` - Update an existing skill (supports refresh or content changes)
  - `opence skill remove <name>` - Remove a skill from all configured tool directories
  - `opence skill show <name>` - Display detailed information about a specific skill

- Skill creation automatically targets directories for tools configured during `opence init`:
  - `.claude/skills/` for Claude Code and GitHub Copilot
  - `.codex/skills/` for Codex

- Scaffold proper skill structure following skill-creator guidance:
  - `SKILL.md` with frontmatter (name, description, allowed-tools, metadata)
  - `references/` directory for extended guidance
  - `scripts/` directory for reusable code

- Support interactive prompts for metadata when creating skills
- Support non-interactive mode with flags for automation

## Impact

- **Affected specs**: New capability `cli-skill-commands`
- **Affected code**:
  - `src/cli/index.ts` - Register new skill command
  - `src/commands/skill.ts` - New file implementing skill subcommands
  - `src/core/skill-manager.ts` - New file with core skill management logic
  - `src/core/templates/skill-templates.ts` - May need updates for user skill templates
  - `src/core/config.ts` - Read existing tool configuration
  - `src/core/global-config.ts` - May store skill preferences
- **User-facing changes**: New commands available after installation
- **Documentation**: Update README with skill management section
