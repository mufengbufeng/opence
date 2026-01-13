# Change: Add opence-archive native skill

## Why

Currently, after completing the plan→work→review→compound workflow, users need to run `opence archive <change-id>` to finalize the change. However, there's no native skill to guide AI assistants on:
- When and how to use the archive command
- What the archive operation does (moves to archive/, applies spec deltas)
- Best practices for pre-archive verification
- Handling different scenarios (completed vs incomplete tasks, validation warnings)

The compound phase prompts users to "run `opence archive <change-id>`" but doesn't provide detailed guidance on the archiving workflow as a skill.

By adding an `opence-archive` native skill, we:
- Complete the workflow skills set (plan, work, review, compound, archive)
- Provide consistent, discoverable guidance for the final workflow step
- Enable AI assistants to guide users through the archiving process
- Document best practices for verification before archiving

## What Changes

- Add new opence-native skill: `opence-archive`
  - Guides AI assistants on when to archive
  - Explains pre-archive verification steps
  - Documents archive command flags and options
  - Provides troubleshooting for common archive issues
  
- Update `OpenceSkillId` type to include `'archive'`
- Update `OPENCE_SKILL_IDS` array to include `'archive'`
- Update compound skill to reference archive skill

## Impact

- **Affected specs**: Modify `opence-native-skills` spec (add archive skill requirement)
- **Affected code**:
  - `src/core/templates/opence-skill-templates.ts` - Add archive skill
  - `src/core/templates/slash-command-templates.ts` - Update compound to reference archive skill
  - `src/core/init.ts` - Already handles OPENCE_SKILL_IDS array
  - `src/core/update.ts` - Already handles OPENCE_SKILL_IDS array
- **User-facing changes**: New skill appears after `opence init` or `opence update`
- **Documentation**: Update README to include archive in workflow

**Breaking changes**: None - this is purely additive
