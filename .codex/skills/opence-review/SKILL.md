---
name: opence-review
description: Review an opence change with prioritized findings.
metadata:
  short-description: Review opence changes.
---

<!-- OPENCE:START -->
**Guardrails**
- Favor straightforward, minimal implementations first and add complexity only when it is requested or clearly required.
- Keep changes tightly scoped to the requested outcome.
- Refer to `opence/AGENTS.md` (located inside the `opence/` directory—run `ls opence` or `opence update` if you don't see it) if you need additional opence conventions or clarifications.

**Steps**
1. Inspect the change outputs and identify issues in priority order (severity high to low).
2. Cite file paths for each finding and explain expected vs actual behavior.
3. Call out any remaining risks, edge cases, or test gaps explicitly.

**Reference**
- Use `opence show <id>`, `opence list`, and targeted file reads to ground the review.
<!-- OPENCE:END -->
