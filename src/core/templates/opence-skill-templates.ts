import * as yaml from 'yaml';
import { OPENCE_MARKERS } from '../config.js';
import { getSlashCommandBody, SlashCommandId } from './slash-command-templates.js';

export type OpenceSkillId = SlashCommandId | 'skill-creator';
export type OpenceSkillVariant = 'claude' | 'codex';

type SkillSpec = {
  id: OpenceSkillId;
  name: string;
  description: string;
  shortDescription: string;
  allowedTools: string[];
  context?: 'fork';
};

const PLAN_TOOLS = ['Read', 'Grep', 'Glob'];
const WORK_TOOLS = ['Read', 'Write', 'Bash', 'Grep', 'Glob'];
const REVIEW_TOOLS = ['Read', 'Grep', 'Glob'];
const COMPOUND_TOOLS = ['Read', 'Write', 'Bash', 'Grep', 'Glob'];
const SKILL_CREATOR_TOOLS = ['Read', 'Write'];
const ARCHIVE_TOOLS = ['Read', 'Write', 'Bash'];

const SKILLS: Record<OpenceSkillId, SkillSpec> = {
  plan: {
    id: 'plan',
    name: 'opence-plan',
    description: 'Create an opence plan and scaffold change artifacts.',
    shortDescription: 'Plan opence change artifacts.',
    allowedTools: PLAN_TOOLS,
  },
  work: {
    id: 'work',
    name: 'opence-work',
    description: 'Implement an opence change and keep tasks in sync.',
    shortDescription: 'Implement opence tasks.',
    allowedTools: WORK_TOOLS,
  },
  review: {
    id: 'review',
    name: 'opence-review',
    description: 'Review an opence change with prioritized findings.',
    shortDescription: 'Review opence changes.',
    allowedTools: REVIEW_TOOLS,
    context: 'fork',
  },
  compound: {
    id: 'compound',
    name: 'opence-compound',
    description: 'Document learnings, capture repeatable workflows as skills, and prepare to compound an opence change.',
    shortDescription: 'Document learnings, capture skills, and archive.',
    allowedTools: COMPOUND_TOOLS,
  },
  'skill-creator': {
    id: 'skill-creator',
    name: 'opence-skill-creator',
    description: 'Learn how to create effective project skills following opence conventions.',
    shortDescription: 'Learn skill creation conventions.',
    allowedTools: SKILL_CREATOR_TOOLS,
  },
  archive: {
    id: 'archive',
    name: 'opence-archive',
    description: 'Archive a completed change and apply spec updates to the main specifications.',
    shortDescription: 'Archive changes and apply spec updates.',
    allowedTools: ARCHIVE_TOOLS,
  },
};

export const OPENCE_SKILL_IDS: OpenceSkillId[] = ['plan', 'work', 'review', 'compound', 'skill-creator', 'archive'];

export function getOpenceSkillSpec(id: OpenceSkillId): SkillSpec {
  return SKILLS[id];
}

function normalizeFrontmatterData(value: unknown): Record<string, unknown> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return { ...(value as Record<string, unknown>) };
  }
  return {};
}

function buildFrontmatterData(
  spec: SkillSpec,
  variant: OpenceSkillVariant,
  existing: Record<string, unknown>
): Record<string, unknown> {
  const data = { ...existing };
  data.name = spec.name;
  data.description = spec.description;

  if (variant === 'claude') {
    data['allowed-tools'] = spec.allowedTools;
    data['user-invocable'] = true;
    if (spec.context) {
      data.context = spec.context;
    } else if ('context' in data) {
      delete data.context;
    }
  } else {
    const metadata = normalizeFrontmatterData(data.metadata);
    metadata['short-description'] = spec.shortDescription;
    data.metadata = metadata;
  }

  return data;
}

function stringifyFrontmatter(data: Record<string, unknown>): string {
  const yamlBody = yaml.stringify(data).trimEnd();
  return `---\n${yamlBody}\n---`;
}

function splitFrontmatter(content: string): {
  frontmatter: Record<string, unknown>;
  body: string;
} {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/u);
  if (!match) {
    return { frontmatter: {}, body: content };
  }

  let parsed: Record<string, unknown> = {};
  try {
    parsed = normalizeFrontmatterData(yaml.parse(match[1]));
  } catch {
    parsed = {};
  }

  return {
    frontmatter: parsed,
    body: content.slice(match[0].length),
  };
}

function updateManagedBlock(content: string, body: string): string {
  const startMarker = OPENCE_MARKERS.start;
  const endMarker = OPENCE_MARKERS.end;
  const managedBlock = `${startMarker}\n${body}\n${endMarker}`;

  const startIndex = content.indexOf(startMarker);
  if (startIndex === -1) {
    const trimmed = content.trimStart();
    if (!trimmed) {
      return `${managedBlock}\n`;
    }
    return `${managedBlock}\n\n${trimmed}`;
  }

  const endIndex = content.indexOf(endMarker, startIndex + startMarker.length);
  if (endIndex === -1) {
    const trimmed = content.trimStart();
    return `${managedBlock}\n\n${trimmed}`;
  }

  const before = content.slice(0, startIndex);
  const after = content.slice(endIndex + endMarker.length);
  return `${before}${managedBlock}${after}`;
}

function getSkillBody(id: OpenceSkillId): string {
  if (id === 'skill-creator') {
    return generateSkillCreatorBody();
  }
  if (id === 'archive') {
    return generateArchiveBody();
  }
  return getSlashCommandBody(id as SlashCommandId);
}

function generateSkillCreatorBody(): string {
  return `# opence-skill-creator

Learn how to create effective project skills following opence conventions.

## When to Create a Skill

Create a skill during the **compound phase** when you identify:
- Repeatable workflows that can be encoded as instructions
- Recurring pitfalls or manual checks that need documentation
- Domain-specific knowledge that will be useful in future changes

Don't create a skill for one-off solutions or highly specific edge cases.

## Quick Start

Use the CLI to create skills (recommended):

\`\`\`bash
# Create a new skill
opence skill add api-testing --description "Guidelines for testing API endpoints"

# List all skills
opence skill list

# Show skill details
opence skill show api-testing
\`\`\`

The CLI automatically:
- Creates proper directory structure
- Generates correct frontmatter for each tool
- Validates naming conventions
- Creates references/ and scripts/ directories

## Skill Structure

\`\`\`
.claude/skills/my-skill/
├── SKILL.md           # Concise entry point (< 200 lines)
├── references/        # Detailed documentation
│   └── *.md          # Extended guides, examples
└── scripts/          # Reusable code
    └── *.sh, *.py    # Helper scripts
\`\`\`

**SKILL.md**: Keep concise. Include "When to use", key steps, and pointers to references/.

**references/**: Put detailed docs, long examples, API references here.

**scripts/**: Add reusable code that users can copy or execute.

## Naming Rules

- **Format**: kebab-case (e.g., \`api-testing\`, \`deploy-prod\`)
- **Reserved**: Don't use \`opence-\` prefix (reserved for native skills)
- **Unique**: Check with \`opence skill list\` to avoid duplicates

**Valid**: \`api-testing\`, \`error-recovery\`, \`db-migration\`
**Invalid**: \`api testing\` (spaces), \`api_testing\` (underscores), \`opence-custom\` (reserved)

## Next Steps

After creating a skill:
1. Edit SKILL.md to add instructions and examples
2. Add detailed docs to references/ if needed
3. Add helper scripts to scripts/ if applicable
4. Test the skill in actual usage
5. Commit to version control

See references/ for detailed guidance on:
- Directory structure and sizing
- Frontmatter formats for different tools
- Best practices and anti-patterns`;
}

function generateArchiveBody(): string {
  return `# opence-archive

Archive a completed change and apply spec updates to the main specifications.

## When to Archive

Archive a change when:
- The compound phase is complete (documentation and skills created)
- All tasks in tasks.md are marked [x] complete
- Review has been done and no blockers remain
- You're ready to finalize the change

**Triggering signals**:
- Compound step says "prompt to run \`opence archive <change-id>\`"
- All documentation in docs/solutions/ is complete
- Any repeatable workflows have been captured as skills
- Change is ready to become part of the project's specs

## Pre-Archive Verification

Before archiving, verify:

\`\`\`bash
# 1. Validation passes
opence validate <change-id> --strict

# 2. All tests pass
npm test  # or your test command

# 3. Review tasks.md
# Ensure all items are [x] checked and reflect reality

# 4. Confirm correct change
opence list  # Verify you're archiving the right change
\`\`\`

**Critical checks**:
- [ ] \`opence validate <id> --strict\` passes with no errors
- [ ] All tests pass
- [ ] tasks.md items all marked [x]
- [ ] Proposal matches implementation
- [ ] Documentation complete in docs/solutions/
- [ ] Skills created if applicable

## Archive Command

Basic usage:

\`\`\`bash
# Archive with confirmation prompts
opence archive <change-id>

# Archive without prompts (for scripts)
opence archive <change-id> --yes

# Archive without updating specs (infrastructure/docs only changes)
opence archive <change-id> --skip-specs

# Skip validation (not recommended)
opence archive <change-id> --no-validate
\`\`\`

**When to use flags**:
- \`--yes\`: Use in scripts or when you're confident
- \`--skip-specs\`: For changes that don't affect specifications
- \`--no-validate\`: Only if validation has false positives (requires confirmation)

## Understanding Output

Archive command shows:

1. **Task status check**:
   \`\`\`
   Task status: 37/57 tasks
   ⚠ Warning: 20 incomplete task(s) found. Continue? Yes/No
   \`\`\`
   - Warns if tasks.md has unchecked items
   - You can proceed, but review why tasks are incomplete

2. **Spec delta summary**:
   \`\`\`
   Specs to update:
     opence-native-skills: create
   
   Applying changes to opence/specs/opence-native-skills/spec.md:
     + 6 added
     ~ 2 modified
     - 1 removed
   Totals: + 6, ~ 2, - 1, → 0
   \`\`\`
   - Shows which specs will be updated
   - \`+\` = added requirements
   - \`~\` = modified requirements
   - \`-\` = removed requirements
   - \`→\` = renamed requirements

3. **Confirmation prompt**:
   \`\`\`
   ✔ Proceed with spec updates? Yes
   \`\`\`
   - Final confirmation before applying changes

4. **Archive location**:
   \`\`\`
   Change 'add-feature' archived as '2026-01-13-add-feature'
   \`\`\`
   - Change moved to \`opence/changes/archive/YYYY-MM-DD-change-id/\`

## Post-Archive Verification

After archiving, verify:

\`\`\`bash
# 1. No active changes
opence list
# Should show: "No active changes found."

# 2. Specs updated
ls opence/specs/  # Check for new/updated spec directories
cat opence/specs/your-capability/spec.md  # Verify content

# 3. Change archived
ls opence/changes/archive/  # Find YYYY-MM-DD-change-id

# 4. Tests still pass
npm test  # Ensure specs reflect code reality
\`\`\`

**Post-archive tasks**:
- Update spec Purpose fields (replace "TBD - created by archiving...")
- Run tests to verify specs match implementation
- Commit the changes to version control

## Troubleshooting

### Incomplete Tasks Warning

**Issue**: Archive warns about unchecked tasks
- **Cause**: tasks.md has \`- [ ]\` items
- **Fix**: Mark completed tasks [x] or remove legitimately skipped items
- **Proceed?**: Yes if tasks are actually done, No if work remains

### Validation Fails

**Issue**: \`opence validate\` fails before archive
- **Cause**: Spec deltas have format errors
- **Fix**: Run \`opence validate <id> --strict\` and fix issues
- **Tip**: Use \`opence show <id> --json --deltas-only\` to debug

### Multiple Active Changes

**Issue**: Multiple changes listed in \`opence list\`
- **Cause**: Working on multiple changes simultaneously
- **Fix**: Verify you're archiving the correct change-id
- **Tip**: Archive changes one at a time

### Spec Updates Fail

**Issue**: Archive fails during spec application
- **Cause**: Spec delta format errors or file system issues
- **Fix**: Check error message, fix delta format
- **Recovery**: Changes not moved yet, safe to retry

## See Also

- \`opence-compound\` - Previous workflow step
- \`opence-plan\` - How to create changes
- docs/solutions/ - Examples of archived changes`;
}

export function renderOpenceSkillContent(
  id: OpenceSkillId,
  variant: OpenceSkillVariant
): string {
  const spec = getOpenceSkillSpec(id);
  const body = getSkillBody(id).trim();
  const frontmatter = stringifyFrontmatter(buildFrontmatterData(spec, variant, {}));
  return `${frontmatter}\n\n${OPENCE_MARKERS.start}\n${body}\n${OPENCE_MARKERS.end}\n`;
}

export function updateOpenceSkillContent(
  existingContent: string,
  id: OpenceSkillId,
  variant: OpenceSkillVariant
): string {
  const spec = getOpenceSkillSpec(id);
  const body = getSkillBody(id).trim();

  const { frontmatter, body: existingBody } = splitFrontmatter(existingContent);
  const updatedFrontmatter = buildFrontmatterData(spec, variant, frontmatter);
  const frontmatterBlock = stringifyFrontmatter(updatedFrontmatter);

  const updatedBody = updateManagedBlock(existingBody, body);
  const normalizedBody = updatedBody.replace(/^\s*\n/u, '').trimEnd();

  return `${frontmatterBlock}\n\n${normalizedBody}\n`;
}

export function getSkillCreatorReferences(): Record<string, string> {
  return {
    'directory-structure.md': `# Skill Directory Structure

## Overview

Each skill follows a three-part structure:

\`\`\`
.claude/skills/my-skill/
├── SKILL.md           # Entry point
├── references/        # Extended docs
└── scripts/           # Reusable code
\`\`\`

## SKILL.md Purpose

The main SKILL.md file is the entry point AI assistants read first. Keep it:

- **Concise**: Under 200 lines (ideally < 150)
- **Actionable**: Focus on "when" and "what" not "why"
- **Structured**: Use clear sections with consistent headers

### What to Include

- **When to use this skill**: Triggering conditions
- **Quick reference**: Key steps or commands
- **Examples**: 2-3 concrete usage examples
- **Pointers**: Links to references/ for details

### What to Avoid

- Long explanations (move to references/)
- API documentation (move to references/)
- Historical context (move to references/)
- Large code blocks (move to scripts/)

## references/ Purpose

Use this directory for content that's too detailed for SKILL.md:

- **Extended guides**: Step-by-step tutorials
- **API references**: Detailed parameter docs
- **Examples**: Multiple comprehensive examples
- **Background**: Why certain approaches are used
- **Troubleshooting**: Common issues and fixes

Each file should be self-contained and focused on one topic.

## scripts/ Purpose

Store reusable code that users can copy or execute:

- **Helper scripts**: Shell, Python, Node.js scripts
- **Templates**: Code scaffolding
- **Configuration**: Example config files

Add a README.md in scripts/ explaining what each script does.

## Size Guidelines

- **SKILL.md**: 50-200 lines (sweet spot: 100-150)
- **references/*.md**: 100-500 lines each
- **scripts/***: Keep scripts under 200 lines each

If SKILL.md grows beyond 200 lines, split content into references/.

## Before/After Example

**❌ Bad: Everything in SKILL.md** (300+ lines)
\`\`\`
SKILL.md contains:
- Long historical explanation
- Complete API docs
- 10+ examples
- Troubleshooting guide
- Helper scripts inline
\`\`\`

**✅ Good: Split appropriately**
\`\`\`
SKILL.md (120 lines):
- When to use (20 lines)
- Quick reference (40 lines)
- 2 key examples (50 lines)
- See references/ for details (10 lines)

references/api-reference.md (300 lines):
- Complete API documentation

references/examples.md (250 lines):
- 10+ comprehensive examples

references/troubleshooting.md (200 lines):
- Common issues and solutions

scripts/helper.sh (80 lines):
- Automation script
\`\`\``,

    'frontmatter-formats.md': `# Frontmatter Formats

Skills use YAML frontmatter to provide metadata to AI tools. Different tools use different formats.

## Claude & GitHub Copilot Format

Claude Code and GitHub Copilot share the same format:

\`\`\`yaml
---
name: api-testing
description: Guidelines for testing API endpoints
allowed-tools:
  - Read
  - Write
  - Bash
  - Grep
  - Glob
user-invocable: true
---
\`\`\`

### Fields

- **name**: Skill identifier (kebab-case)
- **description**: Brief description (shown in skill list)
- **allowed-tools**: List of tools the skill can use
  - Common: Read, Write, Bash, Grep, Glob, Task
  - Depends on skill needs
- **user-invocable**: Usually \`true\` for project skills

### Optional Fields

\`\`\`yaml
context: fork  # For skills that work better in a forked conversation
\`\`\`

## Codex Format

Codex uses a different structure:

\`\`\`yaml
---
name: api-testing
description: Guidelines for testing API endpoints
metadata:
  short-description: API testing guidelines
---
\`\`\`

### Fields

- **name**: Skill identifier
- **description**: Full description
- **metadata.short-description**: Concise version (< 100 chars)

## Side-by-Side Comparison

| Aspect | Claude/Copilot | Codex |
|--------|---------------|-------|
| Tool specification | \`allowed-tools\` array | Not used |
| Invocability | \`user-invocable: true\` | Implicit |
| Short description | Uses \`description\` | \`metadata.short-description\` |
| Context support | \`context: fork\` | Not used |

## CLI Handles Formats Automatically

When you use \`opence skill add\`, the CLI:

1. Detects configured tools (Claude, Codex, Copilot)
2. Generates correct frontmatter for each
3. Creates skill in appropriate directories

You don't need to write frontmatter manually unless you're creating skills outside the CLI.

## Full Examples

### Claude/Copilot Skill

\`\`\`markdown
---
name: deployment-guide
description: Step-by-step deployment procedures and rollback strategies
allowed-tools:
  - Read
  - Write
  - Bash
user-invocable: true
---

# deployment-guide

[Skill content here]
\`\`\`

### Codex Skill

\`\`\`markdown
---
name: deployment-guide
description: Step-by-step deployment procedures and rollback strategies
metadata:
  short-description: Deployment procedures and rollback
---

# deployment-guide

[Skill content here]
\`\`\``,

    'naming-conventions.md': `# Naming Conventions

## Rules

1. **Use kebab-case**: all lowercase with hyphens
2. **No reserved prefixes**: \`opence-\` is reserved for native skills
3. **Be descriptive**: Name should hint at skill's purpose
4. **Keep it short**: 2-4 words ideal
5. **Use unique names**: Check \`opence skill list\` first

## Validation Pattern

Skills are validated against this regex:

\`\`\`
^[a-z0-9]+(-[a-z0-9]+)*$
\`\`\`

## Good Examples

- \`api-testing\` - Clear purpose
- \`error-recovery\` - Specific domain
- \`db-migration\` - Concise and clear
- \`deploy-prod\` - Action-oriented
- \`code-review\` - Standard practice
- \`perf-optimization\` - Abbreviated but clear
- \`security-audit\` - Domain-specific
- \`data-validation\` - Clear scope
- \`cache-strategy\` - Technical focus
- \`monitoring-setup\` - Installation guide

## Bad Examples

| Name | Problem | Fix |
|------|---------|-----|
| \`api testing\` | Has spaces | \`api-testing\` |
| \`api_testing\` | Uses underscores | \`api-testing\` |
| \`APITesting\` | Not lowercase | \`api-testing\` |
| \`opence-custom\` | Reserved prefix | \`custom-workflow\` |
| \`test\` | Too generic | \`integration-testing\` |
| \`my-project-specific-api-testing-guide\` | Too long | \`api-testing\` |
| \`skill1\` | Not descriptive | \`error-handling\` |
| \`temp\` | Unclear purpose | \`cache-warmup\` |
| \`fix-bug\` | Too general | \`null-pointer-fixes\` |
| \`123-test\` | Starts with number (invalid) | \`test-automation\` |

## Reserved Names

The following prefixes are reserved:

- \`opence-*\` - Native skills (plan, work, review, compound, skill-creator)

Don't create skills with these names.

## Checking for Duplicates

Before creating a skill:

\`\`\`bash
opence skill list
\`\`\`

Ensure your name doesn't conflict with:
- Existing user skills
- Native opence skills
- Common vocabulary that might be confusing

## Naming by Domain

### API/Backend
- \`api-testing\`
- \`api-versioning\`
- \`endpoint-security\`

### Database
- \`db-migration\`
- \`query-optimization\`
- \`schema-design\`

### Frontend
- \`component-testing\`
- \`ui-accessibility\`
- \`perf-profiling\`

### DevOps
- \`deploy-prod\`
- \`rollback-procedure\`
- \`ci-pipeline\`

### General
- \`error-recovery\`
- \`code-review\`
- \`security-audit\``,

    'best-practices.md': `# Best Practices for Skill Creation

## Creation Workflow

### 1. Identify the Need

Create skills during the compound phase when you find:

- ✅ Repeatable processes (e.g., deployment checklist)
- ✅ Recurring pitfalls (e.g., common bugs to avoid)
- ✅ Domain knowledge (e.g., API testing patterns)
- ✅ Manual checks (e.g., security review steps)

Don't create skills for:

- ❌ One-off solutions
- ❌ Highly project-specific code (put in project docs instead)
- ❌ Trivial tasks (e.g., "how to run npm install")

### 2. Use the CLI First

Always start with:

\`\`\`bash
opence skill add my-skill --description "Brief description"
\`\`\`

This ensures:
- Correct directory structure
- Proper frontmatter for all tools
- Valid naming
- references/ and scripts/ directories created

### 3. Write Clear Content

**Do:**
- Start with "When to use this skill"
- Provide concrete examples
- Use bullet points and short paragraphs
- Include commands users can copy-paste
- Point to references/ for details

**Don't:**
- Write long paragraphs without structure
- Assume user knows the context
- Mix multiple unrelated topics
- Forget to provide examples

### 4. Structure for Scanning

AI assistants scan quickly. Make it easy:

\`\`\`markdown
# skill-name

Brief one-line description.

## When to Use

- Trigger condition 1
- Trigger condition 2

## Quick Reference

1. Step 1 with command
2. Step 2 with command
3. Step 3 with command

## Examples

### Example 1: Common case
\`\`\`bash
command here
\`\`\`

### Example 2: Edge case
\`\`\`bash
command here
\`\`\`

## See Also

- references/detailed-guide.md
- scripts/helper.sh
\`\`\`

### 5. Test the Skill

After creating:

1. **Verify structure**:
   \`\`\`bash
   opence skill show my-skill
   \`\`\`

2. **Check in actual usage**:
   - Ask an AI assistant to use the skill
   - Verify the instructions are clear
   - Fix any confusion

3. **Validate naming**:
   \`\`\`bash
   opence skill list
   \`\`\`
   Ensure no duplicates or conflicts

## Content Guidelines

### Keep SKILL.md Concise

Target: 100-150 lines

If you're over 200 lines:
- Move API docs to references/api-reference.md
- Move examples to references/examples.md
- Move troubleshooting to references/troubleshooting.md
- Move code to scripts/

### Provide Actionable Instructions

**❌ Vague:**
"Consider checking the API response"

**✅ Specific:**
\`\`\`bash
# Check API response status
curl -i https://api.example.com/health
# Look for: HTTP/1.1 200 OK
\`\`\`

### Include Examples

Every skill should have:
- At least 2 concrete examples
- Copy-pasteable commands
- Expected output when relevant

### Reference Other Skills

If your skill relates to others:

\`\`\`markdown
## Related Skills

- \`api-testing\` - For API endpoint validation
- \`error-recovery\` - For handling failures
\`\`\`

## Version Control

### Commit Skills

Skills are part of your project:

\`\`\`bash
git add .claude/skills/my-skill
git add .codex/skills/my-skill
git commit -m "Add my-skill for [purpose]"
\`\`\`

### Update with opence update

When opence conventions change:

\`\`\`bash
opence update
\`\`\`

This refreshes native skills. User skills are left unchanged.

## Anti-Patterns

### ❌ Tutorial Dump

Don't copy-paste entire tutorials. Extract key steps.

### ❌ Over-Abstraction

Skills should be practical, not theoretical. Focus on "how" not "why."

### ❌ Duplication

Check existing skills before creating:

\`\`\`bash
opence skill list
opence skill show existing-skill
\`\`\`

### ❌ Scope Creep

Each skill should focus on one clear purpose. If it does too much, split it.

### ❌ Forgetting Updates

If conventions change, update your skills. Don't let them become stale.

## Maintenance

### Review Periodically

Every few months:
- Check if skills are still relevant
- Update for new tools or practices
- Remove obsolete skills

### Document Changes

When updating a skill, note what changed:

\`\`\`bash
git commit -m "Update api-testing skill to include new auth flow"
\`\`\`

### Share with Team

Skills benefit everyone. Document them and encourage team to use them:

- Mention in README
- Link in relevant docs
- Demonstrate in onboarding`,
  };
}
