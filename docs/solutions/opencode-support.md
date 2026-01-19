# Solution: OpenCode Support

## Problem

OpenCode is a popular AI coding assistant that supports custom commands and skills, but opence only supported Claude's directory structure (`.claude/`). This limited adoption by OpenCode users who wanted to use the opence workflow (plan/work/review/compound/archive) with their preferred tool.

Users needed:
- OpenCode slash commands for opence workflow
- Skill integration for persistent instructions
- Dual-tool workflows (using both Claude and OpenCode)
- Consistent experience across tools

## Root Cause

opence's architecture was tightly coupled to Claude's conventions:
- Tool detection only checked for `.claude/` directories
- Skills were only created in `.claude/skills/`
- Command generation was Claude-specific
- Tool registry didn't include OpenCode as an option

The codebase needed to support multiple tools through a plugin-like architecture rather than being Claude-centric.

## Solution

Added OpenCode as a first-class supported tool alongside Claude, sharing skills while maintaining separate command directories.

### Core Implementation

**1. Configuration** (`src/core/config.ts`):
```typescript
export const AI_TOOLS: AIToolOption[] = [
  { name: 'Claude Code', value: 'claude', available: true },
  { name: 'OpenCode', value: 'opencode', available: true },
  // ...
];
```

**2. OpenCode Configurator** (`src/core/configurators/opencode.ts`):
- Creates `OPENCODE.md` instruction file at project root
- Implements `ToolConfigurator` interface
- Uses marker-based updates for maintainability

**3. Slash Command Support** (`src/core/configurators/slash/opencode.ts`):
- Generates commands in `.opencode/commands/opence/`
- Supports plan, work, review, compound, archive commands
- Uses same frontmatter format as Claude (OpenCode compatible)

**4. Skill Sharing** (`src/core/skill-manager.ts`):
```typescript
const SKILL_DIRECTORIES: Record<string, string> = {
  claude: '.claude/skills',
  opencode: '.claude/skills', // OpenCode reads from .claude/skills natively
  codex: '.codex/skills',
  'github-copilot': '.claude/skills',
};
```

**Key Insight**: OpenCode natively supports reading skills from `.claude/skills/`, eliminating the need for duplicate skill directories and keeping the implementation simple.

**5. Tool Detection** (`src/core/skill-manager.ts`):
- Detects OpenCode by checking for `OPENCODE.md` or `.opencode/` directory
- Supports multi-tool discovery for skill commands
- Maintains backward compatibility for Claude-only projects

### Design Decisions

1. **Shared Skills, Separate Commands**:
   - Skills: `.claude/skills/` (read by both Claude and OpenCode)
   - Commands: `.claude/commands/opence/` and `.opencode/commands/opence/`
   - Rationale: No duplication for skills, flexibility for tool-specific commands

2. **Registration Pattern**:
   - Added to `ToolRegistry` and `SlashCommandRegistry`
   - Automatically picked up by `opence init` and `opence update`
   - No changes needed to core workflow commands

3. **Template Reuse**:
   - OpenCode template uses same structure as Claude
   - Minimal new code (3 new files, 7 modified files)

### Testing

Manual testing verified:
- Single-tool setup: `opence init --tools opencode`
- Dual-tool setup: `opence init --tools claude,opencode`
- Skill listing: `opence skill list` shows both tools
- Update command: `opence update` syncs both directories
- Backward compatibility: Existing Claude projects unaffected

## Directory Structure (After Init)

```
project/
├── .claude/
│   ├── commands/opence/        # Claude commands
│   └── skills/                 # Shared by Claude + OpenCode
├── .opencode/
│   └── commands/opence/        # OpenCode commands
├── CLAUDE.md                   # Claude config
├── OPENCODE.md                 # OpenCode config
└── opence/                     # Specs and changes
```

## Usage Examples

```bash
# Initialize with OpenCode only
opence init --tools opencode

# Initialize with both tools
opence init --tools claude,opencode

# List skills (shows which tools have access)
opence skill list
# Output:
# Opence-native skills:
#   opence-plan     .claude, .opencode
#   opence-work     .claude, .opencode
#   ...

# Update syncs both tools automatically
opence update
```

## Related Files

- `src/core/configurators/opencode.ts` - OpenCode configurator
- `src/core/configurators/slash/opencode.ts` - Slash commands
- `src/core/templates/opencode-template.ts` - Instruction template
- `src/core/skill-manager.ts` - Multi-tool skill detection
- `opence/changes/add-opencode-support/` - Full change artifacts

## Lessons Learned

1. **Registry Pattern Works**: Using `ToolRegistry` and `SlashCommandRegistry` made adding OpenCode straightforward - no changes to core commands needed.

2. **Skill Sharing Simplifies**: Discovering that OpenCode reads `.claude/skills/` natively eliminated a major complexity. Always research tool capabilities before designing.

3. **Tool Detection Strategy**: Checking for config files (`OPENCODE.md`) or directories (`.opencode/`) provides flexible detection without tight coupling.

4. **Backward Compatibility Matters**: Existing Claude-only projects must continue working. Tool detection logic defaults to Claude when skills exist but no tool-specific config is found.

5. **Extensibility Through Registration**: The pattern scales well - adding future tools (VS Code extensions, other assistants) follows the same approach.

## Future Enhancements

Marked as optional/deferred in tasks.md:
- Global directory support (`~/.config/opencode/`)
- `opencode.json`/`opencode.jsonc` configuration file parsing
- JSON-based command definitions
- Comprehensive unit tests
- Detailed troubleshooting guide

These can be added when OpenCode users request specific features.
