# Change: Add opence-skill-creator native skill

## Why

Currently, the guidance for creating skills is scattered across multiple places:
- References to "skill-creator guidance" in AGENTS.md and prompts
- Examples in docs/examples/skill-management.md
- Implicit conventions in the codebase

When AI assistants need to create new project skills during the compound phase, they must piece together best practices from these various sources. This can lead to:
- Inconsistent skill structure
- Missing or incomplete frontmatter
- Unclear when to use references/ vs scripts/ directories
- Forgetting important conventions (kebab-case naming, concise SKILL.md, etc.)

By creating an `opence-skill-creator` native skill, we provide a single, authoritative reference that AI assistants can consult when creating new skills. This skill will be created during `opence init` alongside plan/work/review/compound, making it immediately available.

## What Changes

- Add new opence-native skill: `opence-skill-creator`
  - Contains comprehensive guidance on skill creation
  - Includes naming conventions, directory structure, frontmatter formats
  - Provides examples and anti-patterns
  - References the `opence skill` CLI commands
  
- Update `OPENCE_SKILL_IDS` to include `'skill-creator'`

- Update `opence init` to create this skill alongside existing native skills

- Add reference documentation in `references/` directory:
  - Frontmatter format examples
  - Directory structure conventions
  - When to use references/ vs scripts/

## Impact

- **Affected specs**: New capability `opence-native-skills` (or modify existing if one exists)
- **Affected code**:
  - `src/core/templates/opence-skill-templates.ts` - Add skill-creator spec
  - `src/core/templates/skill-templates.ts` - May need helper templates
  - `src/core/init.ts` - Already handles skills array, no change needed
- **User-facing changes**: New skill appears after `opence init` or `opence update`
- **Documentation**: Update README to mention skill-creator skill

**Breaking changes**: None - this is purely additive
