# Implementation Tasks

## 1. Core Skill Management

- [x] 1.1 Create `src/core/skill-manager.ts` with base skill discovery and validation logic
- [x] 1.2 Implement skill metadata parsing (frontmatter extraction for Claude/Codex formats)
- [x] 1.3 Add skill directory resolution based on configured AI tools
- [x] 1.4 Create utility functions for skill CRUD operations

## 2. Skill Templates

- [x] 2.1 Add user skill template generator in `src/core/templates/skill-templates.ts`
- [x] 2.2 Support different frontmatter formats (Claude vs Codex)
- [x] 2.3 Create default skill scaffold structure (SKILL.md, references/, scripts/)
- [x] 2.4 Add validation for skill naming conventions (kebab-case, uniqueness)

## 3. CLI Command Implementation

- [x] 3.1 Create `src/commands/skill.ts` with command group registration
- [x] 3.2 Implement `skill add <name>` command
  - [x] 3.2.1 Interactive prompts for description, allowed-tools, short-description
  - [x] 3.2.2 Non-interactive mode with flags (--description, --allowed-tools)
  - [x] 3.2.3 Create skill in all configured tool directories
  - [x] 3.2.4 Scaffold references/ and scripts/ directories
- [x] 3.3 Implement `skill list` command
  - [x] 3.3.1 List all opence-native skills (opence-plan, opence-work, etc.)
  - [x] 3.3.2 List all user-defined skills
  - [x] 3.3.3 Show which tools each skill is installed for
  - [x] 3.3.4 Add --json flag for machine-readable output
- [x] 3.4 Implement `skill show <name>` command
  - [x] 3.4.1 Display skill metadata (name, description, tools)
  - [x] 3.4.2 Show file paths for each tool
  - [x] 3.4.3 Display skill content preview
  - [x] 3.4.4 Add --json flag for detailed output
- [x] 3.5 Implement `skill update <name>` command
  - [x] 3.5.1 Support updating description and metadata
  - [x] 3.5.2 Support updating content
  - [x] 3.5.3 Apply changes across all tool directories
  - [x] 3.5.4 Interactive prompts with current values as defaults
- [x] 3.6 Implement `skill remove <name>` command
  - [x] 3.6.1 Confirmation prompt before deletion
  - [x] 3.6.2 Remove from all tool directories
  - [x] 3.6.3 Add --yes flag to skip confirmation
  - [x] 3.6.4 Handle opence-native skills (warn against deletion)

## 4. Configuration Integration

- [x] 4.1 Read AI tool configuration from opence init state
- [x] 4.2 Detect which tools are configured in the current project
- [x] 4.3 Handle projects where opence init hasn't been run (warn user)
- [x] 4.4 Support future multi-tool configurations

## 5. Testing

- [x] 5.1 Unit tests for skill-manager.ts
- [x] 5.2 Unit tests for skill template generation
- [x] 5.3 Integration tests for CLI commands
- [x] 5.4 E2E tests for full skill lifecycle (add, list, update, remove)
- [x] 5.5 Test with different tool configurations (claude-only, codex-only, both)

## 6. Documentation

- [x] 6.1 Add skill management section to README
- [x] 6.2 Create examples in docs/examples/
- [x] 6.3 Update opence/AGENTS.md with skill command references
- [x] 6.4 Add skill command to shell completions

## 7. Polish

- [x] 7.1 Add colored output with PALETTE
- [x] 7.2 Add spinner for async operations
- [x] 7.3 Validate skill names (no spaces, kebab-case, no conflicts)
- [x] 7.4 Add helpful error messages for common issues
