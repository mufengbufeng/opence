# Frontmatter Formats

Skills use YAML frontmatter to provide metadata to AI tools. Different tools use different formats.

## Claude & GitHub Copilot Format

Claude Code and GitHub Copilot share the same format:

```yaml
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
```

### Fields

- **name**: Skill identifier (kebab-case)
- **description**: Brief description (shown in skill list)
- **allowed-tools**: List of tools the skill can use
  - Common: Read, Write, Bash, Grep, Glob, Task
  - Depends on skill needs
- **user-invocable**: Usually `true` for project skills

### Optional Fields

```yaml
context: fork  # For skills that work better in a forked conversation
```

## Codex Format

Codex uses a different structure:

```yaml
---
name: api-testing
description: Guidelines for testing API endpoints
metadata:
  short-description: API testing guidelines
---
```

### Fields

- **name**: Skill identifier
- **description**: Full description
- **metadata.short-description**: Concise version (< 100 chars)

## Side-by-Side Comparison

| Aspect | Claude/Copilot | Codex |
|--------|---------------|-------|
| Tool specification | `allowed-tools` array | Not used |
| Invocability | `user-invocable: true` | Implicit |
| Short description | Uses `description` | `metadata.short-description` |
| Context support | `context: fork` | Not used |

## CLI Handles Formats Automatically

When you use `opence skill add`, the CLI:

1. Detects configured tools (Claude, Codex, Copilot)
2. Generates correct frontmatter for each
3. Creates skill in appropriate directories

You don't need to write frontmatter manually unless you're creating skills outside the CLI.

## Full Examples

### Claude/Copilot Skill

```markdown
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
```

### Codex Skill

```markdown
---
name: deployment-guide
description: Step-by-step deployment procedures and rollback strategies
metadata:
  short-description: Deployment procedures and rollback
---

# deployment-guide

[Skill content here]
```