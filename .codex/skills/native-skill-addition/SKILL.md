---
name: native-skill-addition
description: Guide for adding new opence native skills to the workflow
metadata:
  short-description: Guide for adding new opence native skills to the workflow
---

# native-skill-addition

Guide for adding new opence native skills to the workflow (plan, work, review, compound, archive, skill-creator).

## When to Use

Use this workflow when:
- Adding a new workflow stage that needs AI guidance
- Creating a skill that all opence users should have (not project-specific)
- Completing an existing workflow set (like adding archive after compound)
- Providing authoritative guidance on opence conventions

**Examples of native skills**:
- Workflow stages: plan, work, review, compound, archive
- Meta-skills: skill-creator (teaches how to create skills)

**Not for**:
- Project-specific skills (use `opence skill add` instead)
- One-off guidance (document in docs/ or AGENTS.md)
- Experimental features (start as project skill first)

## Implementation Steps

### 1. Update Type Definitions

Edit `src/core/templates/opence-skill-templates.ts`:

```typescript
// Add to OpenceSkillId union type
export type OpenceSkillId = SlashCommandId | 'skill-creator' | 'archive' | 'your-skill';

// Define tools needed
const YOUR_SKILL_TOOLS = ['Read', 'Write', 'Bash']; // Adjust as needed

// Add to OPENCE_SKILL_IDS array
export const OPENCE_SKILL_IDS: OpenceSkillId[] = [
  'plan', 'work', 'review', 'compound', 'skill-creator', 'archive', 'your-skill'
];
```

**Tool selection guidelines**:
- `Read`: Skill reads files (specs, tasks, proposals)
- `Write`: Skill writes files (documentation, code)
- `Bash`: Skill runs commands (`opence`, `npm test`, etc.)
- `Grep`: Skill searches code patterns
- `Glob`: Skill finds files by pattern

### 2. Add Skill Metadata

In the `SKILLS` object:

```typescript
const SKILLS: Record<OpenceSkillId, SkillSpec> = {
  // ... existing skills
  'your-skill': {
    id: 'your-skill',
    name: 'opence-your-skill',
    description: 'One-sentence description of what the skill does.',
    shortDescription: 'Shorter version for Codex.',
    allowedTools: YOUR_SKILL_TOOLS,
  },
};
```

**Naming conventions**:
- ID: kebab-case, no `opence-` prefix (e.g., 'archive', 'skill-creator')
- Name: `opence-` prefix for display (e.g., 'opence-archive')
- Description: Clear, action-oriented, one sentence
- Short description: <50 characters for Codex metadata

### 3. Implement Content Generation

Add a function to generate skill body:

```typescript
function generateYourSkillBody(): string {
  return `# opence-your-skill

One-sentence description.

## When to Use

- Triggering condition 1
- Triggering condition 2

## Section 1

Content...

## Section 2

Content...
`;
}
```

Update `getSkillBody()` to call your function:

```typescript
function getSkillBody(id: OpenceSkillId): string {
  if (id === 'skill-creator') {
    return generateSkillCreatorBody();
  }
  if (id === 'archive') {
    return generateArchiveBody();
  }
  if (id === 'your-skill') {
    return generateYourSkillBody();
  }
  return getSlashCommandBody(id as SlashCommandId);
}
```

### 4. Skill Content Guidelines

**Structure** (keep <200 lines):
1. **Title and description** - One sentence
2. **When to Use** - Clear triggering conditions
3. **Main workflow** - Step-by-step instructions
4. **Command examples** - Copy-pasteable code blocks
5. **Troubleshooting** - Common issues and solutions

**Style**:
- Use code blocks for commands: \`\`\`bash ... \`\`\`
- Use checklists for verification: `- [ ] Item`
- Use bullet points for options: `- Option 1`
- Keep paragraphs short (2-3 sentences)
- Focus on *how* and *when*, not *why* (that's in docs/)

**Avoid**:
- Creating references/ unless content >200 lines
- Duplicating information from other skills
- Including implementation details (that's in code comments)
- Overly generic advice (be specific to opence)

### 5. Integration with Existing Skills

If your skill is referenced by other workflow stages:

**Update slash-command-templates.ts**:
```typescript
const compoundSteps = `**Steps**
...
4. After X, consult the \`opence-your-skill\` skill for Y.`;
```

**Update corresponding .github/prompts/ files**:
```markdown
4. After X, consult the `opence-your-skill` skill for Y.
```

**Common integration points**:
- Plan → Design skills
- Work → Implementation skills  
- Review → Quality check skills
- Compound → Documentation/memory skills

### 6. Build and Update

```bash
# Build TypeScript
npm run build

# Generate skill files in all tool directories
opence update
```

Verify:
```bash
# Check skill appears
opence skill list

# View generated content
opence skill show opence-your-skill

# Check files created
ls .claude/skills/opence-your-skill/
ls .codex/skills/opence-your-skill/
```

### 7. Update Documentation

**README.md**:
- Add to skills list: `.claude/skills/opence-{...,your-skill}/`
- Update workflow description if adding new stage

**If workflow stage**:
- Update workflow diagram/description
- Update any getting started guides

### 8. Testing

```bash
# Run test suite
npm test

# Validation
opence validate <change-id> --strict

# Manual testing
# 1. Create test scenario
# 2. Invoke skill (read SKILL.md)
# 3. Follow instructions
# 4. Verify expected outcome
```

## Common Patterns

### Workflow Stage Skills (plan, work, review, compound, archive)

These guide AI through workflow phases:
- **Content**: Steps, guardrails, references
- **Tools**: Read, Write, Bash, Grep, Glob (comprehensive)
- **Integration**: Referenced by previous/next stages
- **Length**: Can be longer (~50-100 lines)

### Meta Skills (skill-creator)

These teach concepts or processes:
- **Content**: Guidelines, examples, best practices
- **Tools**: Read, Write (focused)
- **Integration**: Referenced from compound phase
- **Length**: Keep concise (<150 lines) + references/ for details

### Command Helper Skills (archive)

These guide using specific commands:
- **Content**: When to use, flags, output interpretation
- **Tools**: Read, Write, Bash (to run commands)
- **Integration**: Referenced when command is needed
- **Length**: Medium (~100-150 lines)

## Verification Checklist

Before submitting:
- [ ] Type definitions updated (OpenceSkillId, OPENCE_SKILL_IDS)
- [ ] Tools constant defined
- [ ] SKILLS object entry added
- [ ] Content generation function implemented
- [ ] getSkillBody() updated
- [ ] Content <200 lines (or references/ created)
- [ ] Integration points updated (if applicable)
- [ ] npm run build successful
- [ ] opence update run
- [ ] Skill appears in opence skill list
- [ ] Content in both .claude and .codex
- [ ] Frontmatter correct for each tool
- [ ] README updated
- [ ] npm test passes
- [ ] Validation strict passes

## Troubleshooting

### Build Errors

**Issue**: TypeScript compilation fails
- **Cause**: Type mismatch or missing export
- **Fix**: Check OpenceSkillId union includes your ID
- **Tip**: Run `npm run build` to see exact error

### Skill Not Appearing

**Issue**: `opence skill list` doesn't show skill
- **Cause**: OPENCE_SKILL_IDS array not updated
- **Fix**: Add skill ID to array
- **Recovery**: Run `opence update` after fixing

### Content Not Generated

**Issue**: SKILL.md empty or missing
- **Cause**: getSkillBody() doesn't call your function
- **Fix**: Add condition for your skill ID
- **Debug**: Check function name matches and returns string

### Frontmatter Issues

**Issue**: Skill won't load in AI tool
- **Cause**: Invalid YAML frontmatter
- **Fix**: Verify tool renders correct format (Claude vs Codex)
- **Test**: Open .claude/skills/*/SKILL.md and check ---...--- block

## See Also

- `opence-skill-creator` - For creating project skills
- `prompt-sync-workflow` - For updating prompts/skills
- docs/solutions/skill-creator-native-skill.md - Example of this workflow
- docs/solutions/archive-native-skill.md - Another example

## Instructions

[Add detailed instructions for when and how to use this skill]

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
