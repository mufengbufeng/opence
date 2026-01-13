# Solution: opence-archive Prompt

## Problem

The `opence-archive` native skill existed to guide AI assistants through the archive workflow, but there was no corresponding interactive prompt (slash command) for users to invoke directly. Users had to rely on the `compound` step's final instruction to manually run the archive command. This created an inconsistency in the workflow where all other phases (plan, work, review, compound) had both skills and prompts, but archive only had a skill.

## Root Cause

When the `archive` skill was added to `OpenceSkillId`, it was not simultaneously added to `SlashCommandId`. The system has two separate type hierarchies:
- `SlashCommandId` - defines workflow prompts/commands
- `OpenceSkillId` - extends `SlashCommandId` plus meta-skills like `skill-creator`

The `archive` was initially added only as a standalone skill ID, not as a slash command, breaking the pattern where workflow phases should be both skills and commands.

## Solution

Added `archive` to the slash command system to complete the workflow.

### Implementation

1. **Updated SlashCommandId** (`src/core/templates/slash-command-templates.ts`):
   - Added `'archive'` to the union type
   - Created `archiveSteps` and `archiveReferences` content
   - Added `archive` entry to `slashCommandBodies` Record

2. **Updated All Configurators**:
   - `src/core/configurators/slash/claude.ts` - Added FILE_PATHS and FRONTMATTER entries
   - `src/core/configurators/slash/codex.ts` - Added FILE_PATHS and frontmatter entries
   - `src/core/configurators/slash/github-copilot.ts` - Added FILE_PATHS and FRONTMATTER entries

3. **Simplified Type Definition** (`src/core/templates/opence-skill-templates.ts`):
   - Changed `OpenceSkillId` from `SlashCommandId | 'skill-creator' | 'archive'` to `SlashCommandId | 'skill-creator'`
   - Since `archive` is now in `SlashCommandId`, no need to list it twice

4. **Generated Prompt Files**:
   - `.github/prompts/opence-archive.prompt.md` (GitHub Copilot)
   - `.claude/commands/opence/archive.md` (Claude)
   - `.codex/prompts/opence-archive.md` (Codex)

### Content Structure

The archive prompt delegates to the skill:
- **Step 1**: Consult the `opence-archive` skill for comprehensive guidance
- **Step 2**: Complete pre-archive verification (validate, tests, tasks.md)
- **Step 3**: Run `opence archive <change-id>`
- **Step 4**: Review output and confirm spec updates
- **Step 5**: Complete post-archive verification

This keeps the prompt concise while the skill provides detailed troubleshooting and edge case handling.

## Lessons Learned

1. **Workflow Symmetry**: When adding workflow phases, ensure both skill and prompt are created together to maintain consistency.

2. **Type Hierarchy Matters**: Understanding the relationship between `SlashCommandId` (workflow prompts) and `OpenceSkillId` (prompts + meta-skills) prevents duplicate type definitions.

3. **Configurator Updates Required**: Adding a new slash command requires updating all three configurators (Claude, Codex, GitHub Copilot) with file paths and frontmatter.

4. **Delegation Pattern**: Prompts can delegate to skills for detailed guidance, keeping prompt content focused on the primary workflow steps.

5. **Manual Generation for Existing Projects**: `opence update` only updates existing files; new slash commands in existing projects require manual file creation or re-running specific generation logic.
