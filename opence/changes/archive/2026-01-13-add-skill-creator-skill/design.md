# Design: opence-skill-creator Native Skill

## Context

Skills in opence follow the Agent Skills format, but have project-specific conventions:
- **Naming**: kebab-case, no `opence-` prefix for user skills
- **Structure**: SKILL.md (concise) + references/ (detailed docs) + scripts/ (reusable code)
- **Frontmatter**: Different formats for Claude/Copilot vs Codex
- **CLI integration**: `opence skill` commands automate creation

Currently this knowledge is implicit or scattered. AI assistants creating skills during compound need a single reference.

## Goals / Non-Goals

**Goals:**
- Provide authoritative skill creation guidance in a skill format
- Make guidance available immediately after `opence init`
- Include both "what to do" and "what to avoid"
- Reference the `opence skill` CLI commands
- Keep the main SKILL.md concise, details in references/

**Non-Goals:**
- Replace the `opence skill` CLI commands (they remain the primary tool)
- Provide interactive skill creation (that's what CLI does)
- Cover advanced skill patterns (keep it simple and practical)

## Decisions

### Skill ID and Metadata

- **Name**: `opence-skill-creator`
- **Description**: "Learn how to create effective project skills following opence conventions."
- **Allowed Tools**: `['Read', 'Write']` - minimal since it's mostly reference material
- **Context**: None (not fork-specific)

**Rationale**: Clear name indicates purpose. Read/Write sufficient for referencing the skill and creating files based on its guidance.

### Content Structure

**SKILL.md** (concise overview):
- When to create a skill (compound phase triggers)
- Quick reference: naming, structure, CLI commands
- Pointer to references/ for details

**references/directory-structure.md**:
- Detailed explanation of SKILL.md, references/, scripts/
- When to use each
- Size guidelines

**references/frontmatter-formats.md**:
- Claude/Copilot format (allowed-tools, user-invocable)
- Codex format (metadata.short-description)
- Examples for each

**references/naming-conventions.md**:
- kebab-case requirement
- Reserved prefix rules
- Good and bad examples

**references/best-practices.md**:
- Keep SKILL.md under 200 lines
- Use `opence skill` CLI first
- Test skills after creation
- Version control considerations

### Alternative Considered: Standalone Documentation

**Option**: Keep as markdown docs in `docs/skills/skill-creator-guide.md`

**Rejected because**:
- Skills are more discoverable to AI assistants (they're in the tools' skill directories)
- Skills can be invoked/referenced during conversation
- Consistent with other opence workflow guidance (plan, work, review, compound are all skills)

## Risks / Trade-offs

**Risk**: Duplication between this skill and CLI help text
- **Mitigation**: Skill focuses on *when* and *why*, CLI help focuses on *how* (flags, syntax)

**Risk**: Skill becomes outdated as conventions evolve
- **Mitigation**: `opence update` refreshes native skills, keeping them current

**Trade-off**: One more skill to maintain
- **Benefit**: Centralized, authoritative source reduces scattered documentation

## Migration Plan

No migration needed - this is purely additive.

**Rollout**:
1. Add skill spec to templates
2. Existing projects get it via `opence update`
3. New projects get it via `opence init`

## Open Questions

None - the design is straightforward given existing skill patterns.
