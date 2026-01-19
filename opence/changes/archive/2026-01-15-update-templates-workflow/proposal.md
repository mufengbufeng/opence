# Change: Update template files to reflect current 5-stage workflow

## Why

The template files (`agents-template.ts`, `agents-root-stub.ts`) describe a 4-stage workflow (Plan/Work/Review/Compound), but the current implementation supports a 5-stage workflow (Plan -> Work -> Review -> Compound -> Archive). The templates need to be updated to accurately reflect the current workflow state.

## What Changes

- Update `agents-root-stub.ts` to reference the 5-stage workflow
- Update `agents-template.ts` to describe the complete workflow with Archive stage
- Ensure all workflow stages are documented consistently with the slash command definitions

## Impact

- Affected specs: `opence-native-skills` (template generation)
- Affected code: `src/core/templates/agents-template.ts`, `src/core/templates/agents-root-stub.ts`
