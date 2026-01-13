# Design: CLI Skills Management System

## Context

The opence project currently manages skills for AI assistants in two contexts:
1. **Opence-native skills** (plan, work, review, compound) - created during `opence init`
2. **User-defined project skills** - documented in guides but without CLI support

The `InitCommand` in `src/core/init.ts` already:
- Prompts for which AI tools to use (claude, codex, github-copilot)
- Stores this configuration (tracks which tools are configured)
- Creates opence-native skills via `configureSkills()` method
- Supports different skill formats per tool (frontmatter differences)

**Constraint**: Skills must support different metadata formats:
- Claude/Copilot: `allowed-tools`, `user-invocable`, `context` in frontmatter
- Codex: `metadata.short-description` in frontmatter

## Goals / Non-Goals

**Goals:**
- Provide unified CLI for managing both opence-native and user-defined skills
- Leverage existing tool configuration from `opence init`
- Auto-create skills in correct directories for configured tools
- Support full CRUD operations (create, read, update, delete)
- Follow skill-creator guidance (SKILL.md + references/ + scripts/)

**Non-Goals:**
- Global skill management (stay project-scoped)
- Skill version management or syncing across projects
- Skill marketplace or repository integration
- Editing skill content in CLI (use external editor)

## Decisions

### Command Structure

Use `opence skill <subcommand>` pattern consistent with `opence spec` and `opence change`:

```bash
opence skill add <name>         # Create new skill
opence skill list               # List all skills
opence skill show <name>        # Show skill details
opence skill update <name>      # Update skill metadata
opence skill remove <name>      # Remove skill
```

**Rationale**: Consistent with existing opence command groups and follows common CLI patterns.

### Tool Configuration Discovery

Read tool configuration from the project state created by `opence init`:

1. Check for existing tool-specific files with opence markers:
   - `.claude/skills/opence-*/SKILL.md` → Claude configured
   - `.codex/skills/opence-*/SKILL.md` → Codex configured
   - Look for opence markers (`<!-- OPENCE:START -->`) to confirm opence management

2. If no tools detected, prompt user to run `opence init` first

**Rationale**: Reuses the existing detection logic from `InitCommand.isToolConfigured()`. Avoids creating a separate config file.

**Alternative considered**: Store tool config in `opence/config.json`. Rejected because it duplicates state that's already discoverable from the filesystem.

### Skill Naming Convention

- **Format**: kebab-case, letters/numbers/hyphens only
- **Reserved prefix**: `opence-*` for native skills
- **Validation**: Check for name conflicts across all tools before creation

**Example valid names**: `project-guidelines`, `api-testing`, `deployment-checklist`

### Directory Structure for User Skills

Follow the same pattern as opence-native skills:

```
.claude/skills/
  <skill-name>/
    SKILL.md           # Main skill file with frontmatter + instructions
    references/        # Optional extended documentation
    scripts/           # Optional reusable scripts

.codex/skills/
  <skill-name>/
    SKILL.md
    references/
    scripts/
```

**Rationale**: Consistent with opence-native skills; follows skill-creator guidance; keeps related content together.

### Metadata Handling

For `skill add`, prompt for:
1. **name** (argument, required)
2. **description** (interactive or --description flag)
3. **allowed-tools** (Claude/Copilot only, optional, default to all)
4. **short-description** (Codex only, auto-generated from description if not provided)

Generate frontmatter based on target tool:

**Claude/Copilot format:**
```yaml
---
name: skill-name
description: Full description here
allowed-tools: [Read, Write, Bash]
user-invocable: true
---
```

**Codex format:**
```yaml
---
name: skill-name
description: Full description here
metadata:
  short-description: Brief description
---
```

**Rationale**: Mirrors the logic in `opence-skill-templates.ts` for consistency.

### Update Strategy

`opence skill update <name>` supports:
- **Metadata updates**: Re-prompt for description, allowed-tools, etc.
- **Content replacement**: Regenerate SKILL.md with new metadata

**Not supported**: Fine-grained content editing (users should edit files directly)

**Rationale**: CLI is for management and scaffolding, not content authoring. Keeps implementation simple.

### Skill Listing Format

`opence skill list` output:

```
Opence-native skills:
  opence-plan        (.claude, .codex)
  opence-work        (.claude, .codex)
  opence-review      (.claude, .codex)
  opence-compound    (.claude, .codex)

User-defined skills:
  api-testing        (.claude, .codex)
  deployment-guide   (.claude)

Use 'opence skill show <name>' for details.
```

With `--json`:
```json
{
  "native": [
    {"name": "opence-plan", "tools": ["claude", "codex"]},
    ...
  ],
  "user": [
    {"name": "api-testing", "tools": ["claude", "codex"]},
    ...
  ]
}
```

**Rationale**: Clear separation; shows tool coverage at a glance; supports scripting with --json.

## Implementation Architecture

### New Files

1. **`src/commands/skill.ts`** - CLI command registration and handlers
2. **`src/core/skill-manager.ts`** - Core skill operations (discovery, CRUD)

### Modified Files

1. **`src/cli/index.ts`** - Register skill command
2. **`src/core/templates/skill-templates.ts`** - Add user skill template generators

### Key Classes/Functions

**SkillManager class** (src/core/skill-manager.ts):
```typescript
class SkillManager {
  async discoverConfiguredTools(projectPath: string): Promise<string[]>
  async listSkills(projectPath: string): Promise<SkillInfo[]>
  async getSkillInfo(projectPath: string, name: string): Promise<SkillInfo>
  async createSkill(projectPath: string, name: string, options: SkillOptions): Promise<void>
  async updateSkill(projectPath: string, name: string, options: SkillOptions): Promise<void>
  async removeSkill(projectPath: string, name: string, options: RemoveOptions): Promise<void>
}
```

**Reuse existing code**:
- `FileSystemUtils` for file operations
- `PALETTE` for styled output
- `getOpenceSkillSpec()` to identify native skills
- Frontmatter parsing logic from `opence-skill-templates.ts`

## Risks / Trade-offs

**Risk**: Tool detection might fail if users manually modify skill files without opence markers.
- **Mitigation**: Clearly document that skills managed by opence should contain markers. Add validation to warn users.

**Risk**: Frontmatter format differences between tools could lead to confusion.
- **Mitigation**: Abstract format differences behind SkillManager API. Users don't need to think about it.

**Trade-off**: Not supporting global skills means users can't share skills across projects easily.
- **Acceptable**: Keeps scope manageable. Users can manually copy skill directories if needed.

**Trade-off**: CLI doesn't support content editing (only scaffolding and metadata).
- **Acceptable**: Skills often contain complex instructions. Better to edit in a proper editor with syntax highlighting.

## Migration Plan

No migration needed - this is a new feature. Existing projects continue to work unchanged.

**Rollout**:
1. Implement and test new commands
2. Update documentation
3. Add to shell completions
4. Release as minor version bump

**Rollback**: No impact on existing functionality. Users can continue managing skills manually if they prefer.

## Open Questions

1. **Should `opence skill add` support creating the skill from a template?**
   - Potential options: `--template <name>` to use predefined templates
   - Deferred to future enhancement

2. **Should we support renaming skills?**
   - Would require updating references in other docs
   - Deferred - users can remove and re-create if needed

3. **Should we validate skill content for common issues?**
   - Check for missing sections, broken links, etc.
   - Deferred - focus on structure, not content validation
