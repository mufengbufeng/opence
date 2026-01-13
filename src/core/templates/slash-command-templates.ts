export type SlashCommandId = 'plan' | 'work' | 'review' | 'compound' | 'archive';

const baseGuardrails = `**Guardrails**
- Favor straightforward, minimal implementations first and add complexity only when it is requested or clearly required.
- Keep changes tightly scoped to the requested outcome.
- Refer to \`opence/AGENTS.md\` (located inside the \`opence/\` directory—run \`ls opence\` or \`opence update\` if you don't see it) if you need additional opence conventions or clarifications.`;

const planGuardrails = `${baseGuardrails}\n- Identify any vague or ambiguous details and ask the necessary follow-up questions before editing files.
- Do not write any code during the planning stage. Only create design documents (proposal.md, tasks.md, design.md, and spec deltas). Implementation happens in the work stage after approval.`;

const planSteps = `**Steps**
1. Review \`opence/project.md\`, run \`opence list\` and \`opence list --specs\`, and inspect related code or docs (e.g., via \`rg\`/\`ls\`) to ground the plan in current behaviour; note any gaps that require clarification.
2. Choose a unique verb-led \`change-id\` and scaffold \`proposal.md\`, \`tasks.md\`, and \`design.md\` (when needed) under \`opence/changes/<id>/\`.
3. Map the change into concrete capabilities or requirements, breaking multi-scope efforts into distinct spec deltas with clear relationships and sequencing.
4. Capture architectural reasoning in \`design.md\` when the solution spans multiple systems, introduces new patterns, or demands trade-off discussion before committing to specs.
5. Draft spec deltas in \`changes/<id>/specs/<capability>/spec.md\` (one folder per capability) using \`## ADDED|MODIFIED|REMOVED Requirements\` with at least one \`#### Scenario:\` per requirement and cross-reference related capabilities when relevant.
6. Draft \`tasks.md\` as an ordered list of small, verifiable work items that deliver user-visible progress, include validation (tests, tooling), and highlight dependencies or parallelizable work.
7. Validate with \`opence validate <id> --strict\` and resolve every issue before sharing the plan.`;

const planReferences = `**Reference**
- Use \`opence show <id> --json --deltas-only\` or \`opence show <spec> --type spec\` to inspect details when validation fails.
- Search existing requirements with \`rg -n "Requirement:|Scenario:" opence/specs\` before writing new ones.
- Explore the codebase with \`rg <keyword>\`, \`ls\`, or direct file reads so plans align with current implementation realities.`;

const workSteps = `**Steps**
Track these steps as TODOs and complete them one by one.
1. Read \`changes/<id>/proposal.md\`, \`design.md\` (if present), and \`tasks.md\` to confirm scope and acceptance criteria.
2. Work through tasks sequentially, keeping edits minimal and focused on the requested change.
3. Confirm completion before updating statuses—make sure every item in \`tasks.md\` is finished.
4. Update the checklist after all work is done so each task is marked \`- [x]\` and reflects reality.
5. Reference \`opence list\` or \`opence show <item>\` when additional context is required.`;

const workReferences = `**Reference**
- Use \`opence show <id> --json --deltas-only\` if you need additional context from the plan while implementing.`;

const reviewSteps = `**Steps**
1. Inspect the change outputs and identify issues in priority order (severity high to low).
2. Cite file paths for each finding and explain expected vs actual behavior.
3. Call out any remaining risks, edge cases, or test gaps explicitly.`;

const reviewReferences = `**Reference**
- Use \`opence show <id>\`, \`opence list\`, and targeted file reads to ground the review.`;

const compoundSteps = `**Steps**
1. Determine the change ID:
   - If this prompt already includes a specific change ID (for example inside a \`<ChangeId>\` block populated by slash-command arguments), use that value after trimming whitespace.
   - If the conversation references a change loosely, run \`opence list\` to surface likely IDs, share the relevant candidates, and confirm which one the user intends.
   - Otherwise, ask the user which change to compound and wait for a confirmed change ID before proceeding.
2. Create a documentation entry under \`docs/solutions/\` summarizing the problem, root cause, and fix.
3. Skill memory checkpoint:
   - If the change revealed a repeatable workflow, recurring pitfalls, or manual checks, create or update a skill to encode it.
   - Consult the \`opence-skill-creator\` skill for guidance on skill structure, naming, and best practices.
   - Use \`opence skill add <skill-name> --description "..."\` to create new skills; the command automatically creates proper structure in all configured tool directories.
   - After creation, edit the SKILL.md file to add detailed instructions, examples, and guidelines.
   - Move extensive documentation to \`references/\` and reusable code to \`scripts/\` as described in skill-creator skill.
4. After documentation and any skill updates are complete, consult the \`opence-archive\` skill to finalize the change. The skill provides guidance on pre-archive verification, running \`opence archive <change-id>\`, and post-archive verification.`;

const compoundReferences = `**Reference**
- Use \`opence list\` to confirm change IDs before documenting.
- Use \`opence skill list\` to see existing skills and avoid duplicates.
- Keep documentation concise and focused on future reuse.`;

const archiveSteps = `**Steps**
1. Consult the \`opence-archive\` skill for comprehensive guidance on the archive workflow.
2. Complete pre-archive verification:
   - Run \`opence validate <change-id> --strict\` and ensure it passes.
   - Run all tests and ensure they pass.
   - Verify all tasks in \`tasks.md\` are marked [x] and reflect reality.
   - Confirm proposal matches implementation.
3. Run \`opence archive <change-id>\` to finalize the change.
4. Review archive command output and confirm spec updates.
5. Complete post-archive verification as guided by the skill.`;

const archiveReferences = `**Reference**
- The \`opence-archive\` skill provides detailed guidance on verification steps, command flags, output interpretation, and troubleshooting.
- Use \`opence list\` to confirm the correct change ID before archiving.`;

export const slashCommandBodies: Record<SlashCommandId, string> = {
  plan: [planGuardrails, planSteps, planReferences].join('\n\n'),
  work: [baseGuardrails, workSteps, workReferences].join('\n\n'),
  review: [baseGuardrails, reviewSteps, reviewReferences].join('\n\n'),
  compound: [baseGuardrails, compoundSteps, compoundReferences].join('\n\n'),
  archive: [baseGuardrails, archiveSteps, archiveReferences].join('\n\n'),
};

export function getSlashCommandBody(id: SlashCommandId): string {
  return slashCommandBodies[id];
}
