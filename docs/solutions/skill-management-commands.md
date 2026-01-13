# Solution: Skill Management Commands

## Problem

Users needed a way to manage project skills through the CLI, similar to how they manage changes and specs. Creating skills manually required:
- Understanding tool-specific directory structures (.claude/skills/ vs .codex/skills/)
- Writing correct frontmatter formats for each tool (Claude vs Codex)
- Following naming conventions (kebab-case, no opence- prefix)
- Creating proper directory structure (SKILL.md + references/ + scripts/)

This manual process was error-prone and inconsistent.

## Root Cause

opence had native skills (plan, work, review, compound) but no CLI commands to help users create their own project-specific skills. The skill-creator guidance was scattered across documentation without practical tooling.

## Solution

Added `opence skill` commands to manage the full lifecycle of project skills:

### Core Implementation

**SkillManager** (`src/core/skill-manager.ts`):
- Auto-detects configured AI tools (Claude, Codex) by checking for native skills
- Validates skill names against kebab-case pattern and reserved prefixes
- Creates skills in all configured tool directories with proper frontmatter
- Manages CRUD operations: create, list, show, update, remove

**CLI Commands** (`src/commands/skill.ts`):
- `opence skill add <name>` - Create new skill (interactive + non-interactive)
- `opence skill list` - List all skills with tool availability
- `opence skill show <name>` - Display skill metadata and content
- `opence skill update <name>` - Update skill frontmatter
- `opence skill remove <name>` - Delete skill with confirmation

**Template Generation** (`src/core/templates/skill-templates.ts`):
- Generates tool-specific frontmatter automatically
- Claude/Copilot: `allowed-tools`, `user-invocable`
- Codex: `metadata.short-description`

### Key Features

1. **Multi-tool support**: One command creates skills in all configured directories
2. **Validation**: Prevents invalid names, duplicates, and reserved prefixes
3. **Safety**: Cannot delete opence-native skills
4. **User experience**: Color output, progress indicators, clear error messages

### Testing

Added comprehensive test suite (`test/core/skill-manager.test.ts`):
- 29 unit tests covering all operations
- Tool detection, validation, CRUD operations
- Edge cases and error handling

## Usage Examples

```bash
# Create a new skill
opence skill add api-testing --description "Guidelines for testing API endpoints"

# List all skills
opence skill list

# Show skill details
opence skill show api-testing

# Update skill
opence skill update api-testing --description "Updated guidelines"

# Remove skill
opence skill remove api-testing
```

## Related Changes

- `add-skill-creator-skill` - Added native skill with guidance on skill creation

## Lessons Learned

1. **Tool detection strategy**: Using native skills as markers works reliably
2. **Frontmatter complexity**: Different tools need different formats - abstract this
3. **User safety**: Validation and confirmation prompts prevent common mistakes
4. **Testing value**: Comprehensive unit tests caught edge cases early
