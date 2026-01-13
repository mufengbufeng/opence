---
name: prompt-sync-workflow
description: Coordinate prompt and skill updates across related changes
metadata:
  short-description: Coordinate prompt and skill updates across related changes
---

# prompt-sync-workflow

Coordinate prompt and skill updates when implementing changes that affect opence workflow guidance.

## When to Use

Use this workflow when your change:
- Adds new native skills (plan, work, review, compound, skill-creator)
- Modifies workflow stages or their responsibilities
- Changes how AI assistants should behave during a phase
- Adds new CLI commands that should be referenced in prompts

**Triggering signals**:
- Creating or modifying files in `src/core/templates/`
- Adding entries to `OPENCE_SKILL_IDS`
- Updating how `opence init` or `opence update` works

## Workflow Steps

### 1. Update Source Templates First

Edit the canonical source in `src/core/templates/slash-command-templates.ts`:

```typescript
// Update the relevant step constants (planSteps, workSteps, etc.)
const compoundSteps = `**Steps**
1. ...
2. ...
3. New or modified step
4. ...`;
```

This is the single source of truth that generates all downstream files.

### 2. Update Matching Prompt Files

If you modify templates, also update the corresponding `.github/prompts/` files:

```bash
# These files are used by GitHub Copilot
.github/prompts/opence-plan.prompt.md
.github/prompts/opence-work.prompt.md
.github/prompts/opence-review.prompt.md
.github/prompts/opence-compound.prompt.md
```

Keep them in sync with `slash-command-templates.ts` content.

### 3. Build and Run Update

```bash
# Rebuild to compile template changes
npm run build

# Propagate to all tool directories
opence update
```

This will update:
- `.claude/commands/opence/*.md` (Claude slash commands)
- `.codex/prompts/opence-*.md` (Codex prompts)  
- `.github/prompts/opence-*.prompt.md` (GitHub Copilot prompts)
- `.claude/skills/opence-*/SKILL.md` (Claude skills)
- `.codex/skills/opence-*/SKILL.md` (Codex skills)

### 4. Verify Synchronization

Check that updates propagated correctly:

```bash
# Verify specific prompt updated
Select-String -Path .claude/skills/opence-compound/SKILL.md -Pattern "your-new-text"

# Or check all locations
rg "your-new-text" .claude/ .codex/ .github/prompts/
```

### 5. Test End-to-End

For new skills or commands:

```bash
# Test skill appears
opence skill list

# Test skill content
opence skill show opence-your-skill

# Test skill files exist
ls .claude/skills/opence-your-skill/
ls .codex/skills/opence-your-skill/
```

## Common Patterns

### Adding a New Native Skill

1. Add to `OpenceSkillId` type
2. Add to `OPENCE_SKILL_IDS` array
3. Add entry to `SKILLS` object
4. Implement content generation function
5. Update init.ts and update.ts if special handling needed
6. Build, run `opence update`, verify

### Modifying Existing Workflow Stage

1. Update source in `slash-command-templates.ts`
2. Update matching `.github/prompts/` file
3. Build and run `opence update`
4. Verify with `grep` or `Select-String`

### Adding CLI Command Reference

1. Document command in relevant skill (usually compound)
2. Update source template with command usage
3. Update `.github/prompts/` file
4. Build and update
5. Test command works as documented

## Pitfalls to Avoid

❌ **Don't edit generated files directly**
- Files in `.claude/`, `.codex/` are generated
- Edit source templates instead

❌ **Don't forget `npm run build`**
- Template changes need compilation
- Update won't pick up changes without build

❌ **Don't update only one tool**
- If you update Claude prompts, update Codex too
- Inconsistency confuses users with multiple tools

❌ **Don't skip verification**
- Always check at least one generated file
- Template typos propagate everywhere

## Verification Checklist

After changes:
- [ ] Source template updated
- [ ] `.github/prompts/` file updated
- [ ] `npm run build` successful
- [ ] `opence update` run
- [ ] Spot-check 2+ generated files
- [ ] New skills appear in `opence skill list`
- [ ] Content matches expectations
- [ ] Tests pass

## See Also

- `opence-skill-creator` - For creating project skills
- docs/solutions/skill-creator-native-skill.md - Example of this workflow
- docs/solutions/skill-management-commands.md - Another example


### When to use this skill

- [Scenario 1]
- [Scenario 2]
- [Scenario 3]

### How to use this skill

1. [Step 1]
2. [Step 2]
3. [Step 3]

### Examples

[Add examples of using this skill]

### Guidelines

- [Guideline 1]
- [Guideline 2]

### References

See the `references/` directory for additional documentation and context.

### Scripts

See the `scripts/` directory for reusable code and utilities.
