# Template Workflow Update

## Problem
Template files (`agents-template.ts`, `agents-root-stub.ts`) described a 4-stage workflow (Plan/Work/Review/Compound), but the actual implementation supports a 5-stage workflow (Plan -> Work -> Review -> Compound -> Archive).

## Root Cause
Templates were not updated when the Archive stage was added to the opence workflow.

## Fix
Updated both template files to accurately reflect the 5-stage workflow:
- `agents-root-stub.ts`: Updated workflow reference to include Archive
- `agents-template.ts`: Added Archive stage documentation, CLI commands, and flags

## Files Changed
- `src/core/templates/agents-root-stub.ts`
- `src/core/templates/agents-template.ts`
