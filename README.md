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
- Compound: document learnings in docs/solutions/ and prompt to archive.

## Skills

opence generates skills using the Agent Skills format:

- .claude/skills/opence-{plan,work,review,compound}/SKILL.md (Claude Code and GitHub Copilot)
- .codex/skills/opence-{plan,work,review,compound}/SKILL.md (Codex repo scope)

See docs/skills/skills-interop.md for tool-specific differences and precedence rules.

## Example change

See docs/examples/opence-change/ for a complete Plan/Work/Review/Compound example.

## Command reference

```bash
opence list
opence show <item>
opence validate <item>
opence archive <change-id> --yes
opence update
```

## Telemetry (optional)

Opt out with OPENCE_TELEMETRY=0 or DO_NOT_TRACK=1.

## Contributing

- Install dependencies: pnpm install
- Build: pnpm run build
- Test: pnpm test
- Develop CLI locally: pnpm run dev or pnpm run dev:cli
