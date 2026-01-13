# opence

Compound engineering workflow for AI-assisted development.

opence keeps Plan/Work/Review/Compound instructions, spec artifacts, and skills aligned across Claude Code, Codex, and GitHub Copilot.

## Why opence

- Plan first: produce proposal/tasks/spec deltas before coding.
- Skills as memory: persistent Agent Skills for plan/work/review/compound.
- Same workflow across tools with consistent artifacts.

## Supported tools

- Claude Code (slash commands + skills)
- Codex (global prompts + repo-scoped skills)
- GitHub Copilot (slash prompts + shared .claude/skills)
- AGENTS.md-compatible tools (read opence/AGENTS.md)

## Install

```bash
npm install -g opence@latest
```

Verify:

```bash
opence --version
```

## Initialize

```bash
opence init
```

This creates:

```
opence/
├── project.md
├── AGENTS.md
├── specs/
└── changes/
    └── archive/
```

It also generates opence Plan/Work/Review/Compound commands and skills for the tools you select.

## Workflow overview

- Plan: create proposal/tasks/spec deltas under opence/changes/<change-id>/.
- Work: implement tasks in order and update task checkboxes.
- Review: report prioritized findings with file references and test gaps.
- Compound: document learnings in docs/solutions/, capture repeatable workflows as skills, and finalize with archive.

## Skills

opence generates native skills using the Agent Skills format:

- .claude/skills/opence-{plan,work,review,compound,archive,skill-creator}/SKILL.md (Claude Code and GitHub Copilot)
- .codex/skills/opence-{plan,work,review,compound,archive,skill-creator}/SKILL.md (Codex repo scope)

The `opence-skill-creator` skill provides guidance on creating effective project skills, including naming conventions, directory structure, and best practices. The `opence-archive` skill guides the final workflow step: archiving completed changes and applying spec updates.

See docs/skills/skills-interop.md for tool-specific differences and precedence rules.

### Managing custom skills

opence provides commands to manage your own project skills:

```bash
# Create a new skill
opence skill add my-skill --description "Description here"

# List all skills (native + user-defined)
opence skill list

# Show skill details
opence skill show my-skill

# Update skill metadata
opence skill update my-skill --description "New description"

# Remove a skill
opence skill remove my-skill
```

Skills are created in all configured AI tool directories (.claude/skills/, .codex/skills/) with proper frontmatter for each tool.

## Example change

See docs/examples/opence-change/ for a complete Plan/Work/Review/Compound example.

## Command reference

```bash
# Change management
opence list
opence show <item>
opence validate <item>
opence archive <change-id> --yes

# Skill management
opence skill add <name>
opence skill list
opence skill show <name>
opence skill update <name>
opence skill remove <name>

# Project maintenance
opence update
```

## Telemetry (optional)

Opt out with OPENCE_TELEMETRY=0 or DO_NOT_TRACK=1.

## Contributing

- Install dependencies: pnpm install
- Build: pnpm run build
- Test: pnpm test
- Develop CLI locally: pnpm run dev or pnpm run dev:cli
