---
name: opence: plan
description: Create an opence plan and scaffold change artifacts.
category: opence
tags: [opence, plan]
---
<!-- OPENCE:START -->
**Guardrails**
- Favor straightforward, minimal implementations first and add complexity only when it is requested or clearly required.
- Keep changes tightly scoped to the requested outcome.
- Refer to `opence/AGENTS.md` (located inside the `opence/` directory—run `ls opence` or `opence update` if you don't see it) if you need additional opence conventions or clarifications.
- Identify any vague or ambiguous details and ask the necessary follow-up questions before editing files.
- Do not write any code during the planning stage. Only create design documents (proposal.md, tasks.md, design.md, and spec deltas). Implementation happens in the work stage after approval.

**Steps**
1. Review `opence/project.md`, run `opence list` and `opence list --specs`, and inspect related code or docs (e.g., via `rg`/`ls`) to ground the plan in current behaviour; note any gaps that require clarification.
2. Choose a unique verb-led `change-id` and scaffold `proposal.md`, `tasks.md`, and `design.md` (when needed) under `opence/changes/<id>/`.
3. Map the change into concrete capabilities or requirements, breaking multi-scope efforts into distinct spec deltas with clear relationships and sequencing.
4. Capture architectural reasoning in `design.md` when the solution spans multiple systems, introduces new patterns, or demands trade-off discussion before committing to specs.
5. Draft spec deltas in `changes/<id>/specs/<capability>/spec.md` (one folder per capability) using `## ADDED|MODIFIED|REMOVED Requirements` with at least one `#### Scenario:` per requirement and cross-reference related capabilities when relevant.
6. Draft `tasks.md` as an ordered list of small, verifiable work items that deliver user-visible progress, include validation (tests, tooling), and highlight dependencies or parallelizable work.
7. Validate with `opence validate <id> --strict` and resolve every issue before sharing the plan.

**Reference**
- Use `opence show <id> --json --deltas-only` or `opence show <spec> --type spec` to inspect details when validation fails.
- Search existing requirements with `rg -n "Requirement:|Scenario:" opence/specs` before writing new ones.
- Explore the codebase with `rg <keyword>`, `ls`, or direct file reads so plans align with current implementation realities.
<!-- OPENCE:END -->
