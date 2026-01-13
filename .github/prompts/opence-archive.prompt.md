---
description: Archive a completed change and apply spec updates.
---

$ARGUMENTS
<!-- OPENCE:START -->
**Guardrails**
- Favor straightforward, minimal implementations first and add complexity only when it is requested or clearly required.
- Keep changes tightly scoped to the requested outcome.
- Refer to `opence/AGENTS.md` (located inside the `opence/` directory—run `ls opence` or `opence update` if you don't see it) if you need additional opence conventions or clarifications.

**Steps**
1. Consult the `opence-archive` skill for comprehensive guidance on the archive workflow.
2. Complete pre-archive verification:
   - Run `opence validate <change-id> --strict` and ensure it passes.
   - Run all tests and ensure they pass.
   - Verify all tasks in `tasks.md` are marked [x] and reflect reality.
   - Confirm proposal matches implementation.
3. Run `opence archive <change-id>` to finalize the change.
4. Review archive command output and confirm spec updates.
5. Complete post-archive verification as guided by the skill.

**Reference**
- The `opence-archive` skill provides detailed guidance on verification steps, command flags, output interpretation, and troubleshooting.
- Use `opence list` to confirm the correct change ID before archiving.
<!-- OPENCE:END -->
