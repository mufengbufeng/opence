# Solution: opence-archive Native Skill

## Problem

After completing the plan→work→review→compound workflow, users need to run `opence archive <change-id>` to finalize changes. However, AI assistants lacked structured guidance on:
- When and how to use the archive command
- What the archive operation does (moves to archive/, applies spec deltas)
- Best practices for pre-archive verification
- Handling different scenarios (completed vs incomplete tasks, validation warnings)

## Root Cause

Archive was the only workflow step without a dedicated native skill. While opence had skills for plan, work, review, and compound, the final archiving step lacked:
- A structured verification checklist
- Documentation of command flags and options
- Guidance on interpreting archive command output
- Post-archive verification steps

## Solution

Added `opence-archive` as the sixth opence-native skill.

### Core Implementation

1. **Skill Definition** (`src/core/templates/opence-skill-templates.ts`):
   - Added `'archive'` to `OpenceSkillId` and `OPENCE_SKILL_IDS`.
   - Defined `ARCHIVE_TOOLS` as `['Read', 'Write', 'Bash']`.
   - Added `archive` metadata to `SKILLS`.
   - Implemented `generateArchiveBody()` to provide detailed guidance.

2. **Workflow Integration**:
   - Updated `compound` command template and prompt to reference the `opence-archive` skill.
   - Updated `README.md` to include the archive skill in the workflow overview.

3. **Content Highlights**:
   - Triggering signals for archiving.
   - Pre-archive verification checklist (validation, tests, tasks).
   - Detailed command usage and flags.
   - Output interpretation (task status warnings, spec deltas).
   - Post-archive verification steps.

## Lessons Learned

1. **Consistency in Workflow**: Providing a skill for every major CLI operation ensures AI assistants can guide users through the entire lifecycle.
2. **Tool Selection**: Native workflow skills benefit from having `Bash` access to execute verification and finalization commands.
3. **Trigger Signals**: Clearly defining *when* a skill should be invoked (e.g., after compound documentation is complete) helps AI assistants move between workflow stages.
