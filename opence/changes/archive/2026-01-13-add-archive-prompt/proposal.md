# Change: Add opence-archive Prompt

## Why
The `opence-archive` native skill exists, but there is no corresponding interactive prompt (slash command) to guide users through the archive process. Users currently have to manually invoke the skill or rely on the `compound` step's final instruction. Providing a dedicated prompt completes the workflow (plan -> work -> review -> compound -> archive) and ensures consistent guidance.

## What Changes
- Update `SlashCommandId` to include `'archive'`
- Add `archive` slash command content in `slash-command-templates.ts`
- Generate `.github/prompts/opence-archive.prompt.md` via `opence update`
- (Implicitly generates `.claude/commands/opence/archive.md` etc. via existing logic)

## Impact
- **Affected specs**: `opence-native-skills` (adding requirement for archive prompt)
- **Affected code**: `src/core/templates/slash-command-templates.ts`
- **User-facing**: New `opence-archive` prompt available in tool configurations.
