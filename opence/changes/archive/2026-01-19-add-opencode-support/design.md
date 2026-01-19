# Design Document: OpenCode Integration

## Context

OpenCode is an AI coding assistant that supports:
- Custom commands via `.opencode/commands/*.md` or `opencode.json`
- Agent skills via `.claude/skills/*/SKILL.md` (Claude-compatible format)
- Global configuration in `~/.config/opencode/`
- JSON-based configuration in `opencode.json` or `opencode.jsonc`

The opence project currently only supports Claude (`.claude/` directory structure). This change adds OpenCode as a first-class supported tool.

**Key Insight from OpenCode Docs**: OpenCode Skills already support the `.claude/skills/*` format natively, so we don't need separate `.opencode/skills/` - we can reuse existing Claude skills.

## Goals / Non-Goals

**Goals:**
- Support OpenCode commands in `.opencode/commands/`
- Support `opencode.json`/`opencode.jsonc` configuration files
- Support global OpenCode directory `~/.config/opencode/`
- Enable dual-tool workflows (Claude + OpenCode in same project)
- Reuse existing Claude skills format for OpenCode (no duplication)
- Make OpenCode a first-class citizen alongside Claude

**Non-Goals:**
- Separate `.opencode/skills/` directory (OpenCode reads `.claude/skills/` natively)
- Support for OpenCode-specific features beyond commands and skills
- Migration of existing Claude configurations to OpenCode format
- Support for other AI tools (Cursor, GitHub Copilot, etc.) in this change

## Decisions

### Decision 1: Reuse Claude Skills Format

**Decision:** OpenCode will use the existing `.claude/skills/*/SKILL.md` structure. No separate `.opencode/skills/` directory needed.

**Rationale:** 
- OpenCode documentation states it supports `.claude/skills/*` natively
- Avoids duplication and sync complexity
- Simplifies skill management commands
- Users can share skills between Claude and OpenCode seamlessly

**Alternatives considered:**
- Create separate `.opencode/skills/` directory → Rejected (unnecessary duplication)
- Use different SKILL.md format for OpenCode → Rejected (breaks compatibility)

### Decision 2: Commands in .opencode/commands/

**Decision:** OpenCode-specific commands go in `.opencode/commands/`, mirroring Claude's `.claude/commands/` structure.

**Rationale:**
- Follows OpenCode's official convention
- Allows tool-specific customizations if needed
- Clear separation between Claude and OpenCode commands
- Enables users to customize commands per tool

**Alternatives considered:**
- Share single command directory → Rejected (tools have different command formats/capabilities)
- Use only opencode.json → Rejected (markdown files are more maintainable)

### Decision 3: Support opencode.json for Commands

**Decision:** Support `opencode.json`/`opencode.jsonc` files for command definitions, in addition to markdown files.

**Rationale:**
- Official OpenCode configuration format
- Allows programmatic command generation
- Some users prefer JSON over markdown
- Can coexist with markdown command files

**Schema:**
```json
{
  "command": {
    "test": {
      "template": "Run tests...",
      "description": "Run tests",
      "agent": "build",
      "model": "anthropic/claude-3-5-sonnet-20241022"
    }
  }
}
```

### Decision 4: Tool Detection Strategy

**Decision:** Detect OpenCode by checking for:
1. `.opencode/` directory exists, OR
2. `opencode.json` or `opencode.jsonc` file exists

**Rationale:**
- Simple and reliable detection
- Aligns with how we detect Claude (check for `.claude/`)
- Users can signal OpenCode support explicitly

**Implementation:**
```typescript
function isOpenCodeConfigured(): boolean {
  return fs.existsSync('.opencode') || 
         fs.existsSync('opencode.json') || 
         fs.existsSync('opencode.jsonc');
}
```

### Decision 5: opence init Workflow

**Decision:** During `opence init`, prompt user to select which tools to configure (Claude, OpenCode, or both).

**Prompt example:**
```
Which AI tools do you want to configure?
❯ Claude (uses .claude/ directory)
  OpenCode (uses .opencode/ directory and opencode.json)
  Both
```

**Rationale:**
- Gives users explicit control
- Supports single-tool and dual-tool setups
- Future-proof for adding more tools

### Decision 6: Multi-Tool Sync Strategy

**Decision:** When both tools are configured, `opence update` and skill commands operate on both directories independently.

**Behavior:**
- `opence update` → syncs to `.claude/commands/opence/` AND `.opencode/commands/opence/`
- `opence skill add` → creates in `.claude/skills/` (shared by both tools)
- `opence skill list` → shows "Configured tools: Claude, OpenCode"

**Rationale:**
- Commands need separate directories (different formats)
- Skills can be shared (same format)
- Clear mental model for users

## Architecture Changes

### Directory Structure (after init with both tools)

```
project/
├── .claude/
│   ├── commands/
│   │   └── opence/
│   │       ├── plan.md
│   │       ├── work.md
│   │       └── ...
│   └── skills/
│       ├── opence-plan/
│       ├── opence-work/
│       └── ...
├── .opencode/
│   └── commands/
│       └── opence/
│           ├── plan.md
│           ├── work.md
│           └── ...
├── opencode.json (optional)
└── opence/
    └── ...
```

**Note:** Skills are only in `.claude/skills/` because OpenCode reads them from there.

### Code Changes

**New modules:**
- `src/lib/opencode-config.ts` - OpenCode configuration parsing
- `src/lib/opencode-templates.ts` - OpenCode-specific command templates
- `src/lib/opencode-paths.ts` - Path utilities for OpenCode

**Modified modules:**
- `src/commands/init.ts` - Add OpenCode tool selection
- `src/commands/update.ts` - Sync to OpenCode directories
- `src/commands/skill/*.ts` - Support OpenCode in skill management
- `src/lib/tool-detection.ts` - Detect OpenCode alongside Claude

## Data Model Changes

**ToolConfig interface:**
```typescript
interface ToolConfig {
  claude: boolean;
  opencode: boolean;
  // Future: cursor, copilot, etc.
}
```

**CommandSource enum:**
```typescript
enum CommandSource {
  ClaudeMarkdown = 'claude-md',
  OpenCodeMarkdown = 'opencode-md',
  OpenCodeJson = 'opencode-json',
}
```

## Risks / Trade-offs

### Risk 1: Command Format Differences

**Risk:** OpenCode and Claude might have slightly different command markdown formats or capabilities.

**Mitigation:** 
- Start with basic command features (template, description)
- Test thoroughly with OpenCode
- Document any known differences
- Allow tool-specific customizations via separate files

### Risk 2: Global Directory Conflicts

**Risk:** `~/.config/opencode/` might conflict with user's existing OpenCode global config.

**Mitigation:**
- Only read from global directory, never write
- Document global directory behavior clearly
- Prioritize project-local config over global

### Risk 3: Skill Format Evolution

**Risk:** OpenCode might diverge from Claude's SKILL.md format in the future.

**Mitigation:**
- Monitor OpenCode releases for format changes
- Keep skill format abstraction layer
- Document supported skill features clearly

## Migration Plan

### For Existing Users (Claude only)

**No migration needed.** Existing Claude-only projects continue working unchanged.

To add OpenCode support:
1. Run `opence init` again (non-destructive)
2. Select "OpenCode" when prompted
3. OpenCode commands are created in `.opencode/commands/opence/`
4. Skills are already available (shared from `.claude/skills/`)

### For New Users

1. Run `opence init`
2. Select desired tools (Claude, OpenCode, or both)
3. Commands and skills are created for selected tools
4. Start using opence workflow with chosen tool(s)

### Rollback Strategy

If OpenCode support causes issues:
1. Delete `.opencode/` directory
2. Delete `opencode.json` if created
3. Continue using Claude-only setup
4. No data loss (Claude files untouched)

## Testing Strategy

### Unit Tests
- OpenCode path resolution
- opencode.json parsing
- Tool detection logic
- Command template generation

### Integration Tests
- `opence init` with OpenCode selection
- `opence update` with OpenCode configured
- `opence skill add` with dual-tool setup
- Command execution in OpenCode

### Manual Testing
- Install OpenCode and test with real opence project
- Verify skills load correctly in OpenCode
- Verify commands work in OpenCode TUI
- Test dual-tool workflow (switch between Claude and OpenCode)

## Open Questions

1. **Q:** Does OpenCode support all Claude skill frontmatter fields (`allowed-tools`, `user-invocable`, etc.)?
   **A:** Need to verify with OpenCode testing. If not, may need to document unsupported fields.

2. **Q:** Should we support `~/.opencode/` in addition to `~/.config/opencode/`?
   **A:** Check OpenCode docs/behavior. Likely `~/.config/opencode/` is the standard.

3. **Q:** What's the precedence order for command loading (JSON vs markdown)?
   **A:** Follow OpenCode's behavior: JSON config merged with markdown files, markdown files take precedence for conflicts.

4. **Q:** Should opence-native commands have different content for OpenCode vs Claude?
   **A:** Start with identical content. Customize only if tools have different capabilities/limitations.
