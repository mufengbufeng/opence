# Solution: opence-skill-creator Native Skill

## Problem

When AI assistants needed to create project skills during the compound phase, they had to piece together guidance from multiple sources:
- Generic "skill-creator guidance" references in prompts
- Examples in docs/examples/skill-management.md
- Implicit conventions in the codebase

This led to:
- Inconsistent skill structure across projects
- Missing or incorrect frontmatter
- Unclear when to use references/ vs scripts/ directories
- Forgetting naming conventions (kebab-case, no opence- prefix)

## Root Cause

Skill creation best practices were documented as scattered prose rather than as a reusable, discoverable skill that AI assistants could reference directly.

## Solution

Created `opence-skill-creator` as a fifth opence-native skill alongside plan, work, review, and compound.

### Implementation

**Core Template** (`src/core/templates/opence-skill-templates.ts`):
- Extended `OpenceSkillId` type to include `'skill-creator'`
- Added to `OPENCE_SKILL_IDS` array
- Implemented `generateSkillCreatorBody()` for main content (~120 lines)
- Implemented `getSkillCreatorReferences()` for detailed documentation

**Content Structure**:

**SKILL.md** (concise, scannable):
- When to create a skill (triggering conditions)
- Quick start with CLI commands
- Directory structure overview
- Naming rules summary
- Pointers to references/

**references/** (detailed documentation):
- `directory-structure.md` - SKILL.md vs references/ vs scripts/ sizing
- `frontmatter-formats.md` - Claude/Copilot vs Codex format comparison
- `naming-conventions.md` - Rules, 10+ good/bad examples
- `best-practices.md` - Workflow, content guidelines, testing, anti-patterns

### Integration Updates

**Init & Update** (`src/core/init.ts`, `src/core/update.ts`):
- Init creates skill-creator with all references automatically
- Update creates missing native skills (including skill-creator)
- Both generate references/ files for skill-creator

**Prompt Updates**:
- Updated compound prompts to reference `opence-skill-creator` skill
- Changed from "follow skill-creator guidance" to "Consult the opence-skill-creator skill"
- All tools (Claude, Codex, Copilot) now have synchronized guidance

**Documentation**:
- Updated README to list skill-creator in native skills
- Compound phase now explicitly points to the skill

### Key Design Decisions

1. **Why a skill vs standalone docs?**
   - Skills are more discoverable to AI assistants
   - Consistent with other workflow guidance (all are skills)
   - Can be referenced/invoked during conversation

2. **Why split SKILL.md and references/?**
   - SKILL.md stays scannable (<200 lines)
   - Detailed examples and edge cases go to references/
   - Matches the pattern we're teaching users

3. **Why auto-generate references/?**
   - Ensures consistency across all tool directories
   - Makes updates via `opence update` seamless
   - Prevents references/ from diverging from conventions

## Usage

AI assistants now:
1. See "Consult the opence-skill-creator skill" in compound prompts
2. Read SKILL.md for quick overview
3. Reference specific files in references/ for details
4. Use `opence skill add` with confidence

## Validation

```bash
# Skill appears in list
opence skill list
# → opence-skill-creator      .claude, .codex

# References are created
ls .claude/skills/opence-skill-creator/references/
# → best-practices.md, directory-structure.md, 
#   frontmatter-formats.md, naming-conventions.md

# Content is accessible
opence skill show opence-skill-creator
```

## Related Changes

- `add-skill-management-commands` - Provides the `opence skill` CLI commands referenced by this skill

## Lessons Learned

1. **Documentation as code**: Encoding guidelines in discoverable formats (skills) is more effective than prose
2. **Managed blocks strategy**: Using `<!-- OPENCE:START -->` markers allows seamless updates
3. **References pattern works**: Splitting concise entry point + detailed references scales well
4. **Tool-specific generation**: Handling format differences (Claude vs Codex) at generation time simplifies maintenance
