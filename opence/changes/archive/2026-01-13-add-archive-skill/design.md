# Design: opence-archive Native Skill

## Context

The opence workflow has 4 native skills (plan, work, review, compound) that guide AI assistants through the development process. However, the final step—archiving a completed change—lacks a dedicated skill.

The `opence archive` CLI command exists and works well, but AI assistants don't have structured guidance on:
- Pre-archive verification checklist
- Understanding archive command output
- Handling edge cases (incomplete tasks, validation warnings)
- Post-archive verification

## Goals / Non-Goals

**Goals:**
- Provide structured guidance for the archive workflow step
- Complete the native skills set for the full workflow
- Document pre-archive and post-archive verification
- Help AI assistants handle archive edge cases

**Non-Goals:**
- Change how `opence archive` command works
- Add new CLI flags or options
- Provide interactive archiving (CLI already has confirmation prompts)

## Decisions

### Skill ID and Metadata

- **Name**: `opence-archive`
- **Description**: "Archive a completed change and apply spec updates to the main specifications."
- **Allowed Tools**: `['Read', 'Write', 'Bash']` - needs to read proposal/tasks, write verification notes, run archive command
- **Context**: None (not fork-specific)

**Rationale**: Completes the workflow skills set. Bash needed to run `opence archive` command.

### Content Structure

**SKILL.md** (concise workflow):
- When to archive (post-compound, after documentation and skills)
- Pre-archive verification checklist
- Archive command usage and flags
- Understanding archive output
- Post-archive verification

**No references/ needed**: Archive workflow is straightforward enough to fit in SKILL.md (<200 lines).

### Key Content

1. **Triggering conditions**
   - All tasks.md items completed
   - Documentation created in docs/solutions/
   - Skills created if applicable
   - Review completed, no blockers

2. **Pre-archive verification**
   - `opence validate <id> --strict` passes
   - Tests pass
   - tasks.md reflects reality (all [x] checked)
   - Proposal matches implementation

3. **Archive command**
   ```bash
   opence archive <change-id>
   # With flags if needed:
   opence archive <change-id> --yes          # Skip prompts
   opence archive <change-id> --skip-specs   # Infrastructure/docs changes
   ```

4. **Understanding output**
   - Task status check (warns if incomplete)
   - Spec delta summary (+ added, ~ modified, - removed)
   - Confirmation prompt
   - Archive location (archive/YYYY-MM-DD-<change-id>)

5. **Post-archive verification**
   - `opence list` shows no active changes
   - Specs updated in `opence/specs/`
   - Change moved to archive/
   - Run tests to ensure specs reflect reality

### Integration Points

**Compound skill**: Should reference archive skill at the end:
- "After documentation and skills complete, consult opence-archive skill to finalize"

**Slash command templates**: Archive is a CLI command, not a workflow phase, so no new slash command needed.

## Alternative Considered: Keep Archive as CLI-only

**Option**: Don't create a skill, keep archive as pure CLI operation

**Rejected because**:
- Inconsistent with other workflow steps (all have skills)
- AI assistants lack structured guidance on pre/post verification
- Archive edge cases (incomplete tasks, validation warnings) need documentation
- Completing the skills set provides symmetry and completeness

## Risks / Trade-offs

**Risk**: Skill content may duplicate CLI help text
- **Mitigation**: Skill focuses on *workflow* (when/why/verification), CLI help focuses on *syntax* (flags/options)

**Risk**: Skill may become outdated if archive command changes
- **Mitigation**: `opence update` mechanism refreshes native skills

**Trade-off**: One more skill to maintain
- **Benefit**: Completes the workflow guidance, helps AI assistants handle the final step correctly

## Migration Plan

No migration needed - purely additive.

**Rollout**:
1. Add skill to templates
2. Existing projects get it via `opence update`
3. New projects get it via `opence init`

## Open Questions

None - the design follows established patterns for native skills.
