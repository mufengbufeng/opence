# Skill Management Examples

This guide shows how to use opence skill commands to manage your project skills.

## Prerequisites

First, initialize opence in your project:

```bash
opence init
```

Select which AI tools you use (Claude, Codex, GitHub Copilot). opence tracks this configuration.

## Creating a skill

### Interactive mode

```bash
opence skill add api-testing
```

You'll be prompted for:
- Description
- Allowed tools (for Claude/Copilot)

### Non-interactive mode

```bash
opence skill add deployment-guide \
  --description "Guidelines for deploying to production" \
  --allowed-tools "Read,Write,Bash"
```

### What gets created

For each configured tool, opence creates:

```
.claude/skills/api-testing/
  ├── SKILL.md           # Skill file with frontmatter
  ├── references/        # For extended documentation
  └── scripts/           # For reusable code

.codex/skills/api-testing/
  ├── SKILL.md
  ├── references/
  └── scripts/
```

## Listing skills

### Default format

```bash
opence skill list
```

Output:
```
Opence-native skills:
  opence-compound           .claude, .codex
  opence-plan               .claude, .codex
  opence-review             .claude, .codex
  opence-work               .claude, .codex

User-defined skills:
  api-testing               .claude, .codex
  deployment-guide          .claude

Use 'opence skill show <name>' for details.
```

### JSON format

```bash
opence skill list --json
```

Output:
```json
{
  "native": [
    {"name": "opence-plan", "tools": ["claude", "codex"]},
    ...
  ],
  "user": [
    {"name": "api-testing", "tools": ["claude", "codex"]},
    ...
  ]
}
```

## Viewing skill details

```bash
opence skill show api-testing
```

Output:
```
api-testing

Description:
  Guidelines for testing API endpoints

Tools:
  claude, codex

Paths:
  claude          /project/.claude/skills/api-testing/SKILL.md
  codex           /project/.codex/skills/api-testing/SKILL.md

Content preview (first 20 lines):
  │ ---
  │ name: api-testing
  │ description: Guidelines for testing API endpoints
  │ allowed-tools:
  │   - Read
  │   - Write
  │ user-invocable: true
  │ ---
  │
  │ # api-testing
  │ ...
```

### JSON format

```bash
opence skill show api-testing --json
```

Returns full skill metadata, paths, and content.

## Updating a skill

### Interactive mode

```bash
opence skill update api-testing
```

Prompts show current values as defaults. Press Enter to keep unchanged.

### Non-interactive mode

```bash
opence skill update api-testing \
  --description "Updated guidelines for API testing" \
  --allowed-tools "Read,Write,Bash,Grep"
```

Changes are applied to all tool directories where the skill exists.

## Removing a skill

### With confirmation

```bash
opence skill remove api-testing
```

Prompts: `Remove skill 'api-testing' from all configured tools? (y/N)`

### Skip confirmation

```bash
opence skill remove api-testing --yes
```

## Skill naming rules

✅ Valid names:
- `api-testing`
- `deploy-prod`
- `project-guidelines`

❌ Invalid names:
- `api testing` (no spaces)
- `api_testing` (no underscores)
- `opence-custom` (reserved prefix)

## Editing skill content

After creating a skill, edit the SKILL.md file directly:

```bash
code .claude/skills/api-testing/SKILL.md
```

### Recommended structure

```markdown
---
name: api-testing
description: Guidelines for testing API endpoints
allowed-tools:
  - Read
  - Write
  - Bash
user-invocable: true
---

# api-testing

Guidelines for testing API endpoints

## When to use this skill

- [Scenario 1]
- [Scenario 2]

## Instructions

1. [Step 1]
2. [Step 2]

## Examples

[Add examples]

## References

See `references/` directory for:
- API documentation
- Test case templates
- Common issues

## Scripts

See `scripts/` directory for:
- Test runners
- Mock data generators
```

## Multi-tool considerations

### Claude and GitHub Copilot

Share the same `.claude/skills/` directory. Both use:
- `allowed-tools` list
- `user-invocable: true`

### Codex

Uses separate `.codex/skills/` directory with:
- `metadata.short-description` field
- Repo-scoped precedence

opence handles these differences automatically.

## Integration with opence workflow

When completing a change, consider whether it revealed:
- Repeatable workflows
- Recurring pitfalls
- Manual checks that could be automated

If yes, create a skill to encode that knowledge:

```bash
opence skill add error-recovery \
  --description "Steps for recovering from deployment failures"
```

Then reference it in your `docs/solutions/` documentation.

## Troubleshooting

### "No AI tools configured"

Run `opence init` first to configure at least one AI tool.

### Skill not appearing in IDE

Restart your IDE after creating skills. Most tools load skills at startup.

### Different frontmatter formats

opence automatically generates the correct format for each tool:
- Claude/Copilot: allowed-tools, user-invocable
- Codex: metadata.short-description

You don't need to worry about these differences.

## Advanced usage

### Scripting with JSON output

```bash
# Get all user skills as JSON
opence skill list --json | jq '.user[].name'

# Export skill content
opence skill show my-skill --json | jq -r '.content' > backup.md
```

### Bulk operations

```bash
# Create multiple skills
for skill in api-testing db-migration error-recovery; do
  opence skill add $skill --description "Description for $skill"
done

# List skills by tool
opence skill list --json | jq '.user[] | select(.tools | contains(["claude"]))'
```
