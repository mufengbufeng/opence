export const agentsRootStubTemplate = `# opence Instructions

These instructions are for AI assistants working in this project.

Always open \`@/opence/AGENTS.md\` when the request:
- Mentions planning or the workflow stages (plan/work/review/compound) or words like proposal, spec, change
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use \`@/opence/AGENTS.md\` to learn:
- How to run the Plan/Work/Review/Compound workflow
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'opence update' can refresh the instructions.
`;
