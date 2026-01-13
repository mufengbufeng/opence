# Skills interop guide

This guide explains how opence skills map to Claude Code, Codex, and GitHub Copilot.

## Summary

Tool | Storage path | Invocation | Metadata notes
--- | --- | --- | ---
Claude Code | .claude/skills/opence-*/SKILL.md | Auto-discovered; user-invocable | Supports allowed-tools, user-invocable, and context
GitHub Copilot | .claude/skills/opence-*/SKILL.md | Auto-discovered in repo scope | Uses the Agent Skills format; shares Claude skill files
Codex | .codex/skills/opence-*/SKILL.md | Repo-scoped skills | Uses metadata.short-description in frontmatter

## Storage paths

- Claude Code and GitHub Copilot share .claude/skills/ in the repo.
- Codex uses repo-scoped .codex/skills/ for opence skills.

## Invocation

- Claude Code and GitHub Copilot discover Agent Skills in .claude/skills and surface them as named skills.
- Codex discovers repo-scoped skills in .codex/skills.

## Metadata differences

- Claude/Copilot skills include:
  - name
  - description
  - allowed-tools
  - user-invocable
  - context: fork (opence-review only)
- Codex skills include:
  - name
  - description
  - metadata.short-description

## Codex skill precedence

Codex resolves skills by scope in this order:

1. Repo scope: .codex/skills (highest priority)
2. User scope: ~/.codex/skills or $CODEX_HOME/skills
3. System/Admin scope (lowest priority)

If a skill name exists in multiple scopes, the higher-precedence version is used. opence only writes repo-scoped skills.
