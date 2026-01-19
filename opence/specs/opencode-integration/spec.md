# opencode-integration Specification

## Purpose

This specification defines OpenCode integration for opence, enabling OpenCode users to utilize the opence workflow (plan/work/review/compound/archive) alongside or instead of Claude. OpenCode is supported as a first-class tool with:

- Shared skill format (`.claude/skills/`) compatible with both Claude and OpenCode
- Dedicated command directory (`.opencode/commands/`) for OpenCode-specific slash commands
- Tool detection via `.opencode/` directory or `opencode.json` configuration file
- Multi-tool configuration supporting both Claude and OpenCode simultaneously

This integration maintains backward compatibility with existing Claude-only projects while extending opence's reach to the OpenCode ecosystem.
## Requirements
### Requirement: OpenCode Tool Integration

The system SHALL support OpenCode as a first-class AI tool alongside Claude.

#### Scenario: Detect OpenCode configuration

- **WHEN** opence checks for configured tools
- **THEN** OpenCode is detected if `.opencode/` directory exists OR `opencode.json` file exists OR `opencode.jsonc` file exists
- **AND** tool list includes "OpenCode" when detected

#### Scenario: OpenCode uses Claude skills format

- **WHEN** OpenCode is configured in the project
- **THEN** skills are read from `.claude/skills/*/SKILL.md` directories
- **AND** no separate `.opencode/skills/` directory is created or used
- **AND** skills created by opence work for both Claude and OpenCode

### Requirement: OpenCode Command Directory Support

The system SHALL support OpenCode custom commands in `.opencode/commands/` directory.

#### Scenario: Create OpenCode command directory during init

- **WHEN** user runs `opence init` and selects OpenCode
- **THEN** `.opencode/commands/opence/` directory is created
- **AND** opence-native commands (plan, work, review, compound, archive) are generated as markdown files
- **AND** command format follows OpenCode conventions

#### Scenario: Sync commands to OpenCode during update

- **WHEN** user runs `opence update` and OpenCode is configured
- **THEN** opence-native commands are synced to `.opencode/commands/opence/`
- **AND** commands are generated with appropriate markdown frontmatter
- **AND** command content includes opence workflow instructions

#### Scenario: Read custom commands from OpenCode directory

- **WHEN** user creates custom commands in `.opencode/commands/`
- **THEN** commands are available for OpenCode to execute
- **AND** command naming follows kebab-case convention
- **AND** commands use markdown format with YAML frontmatter

### Requirement: OpenCode Configuration File Support

The system SHALL support `opencode.json` and `opencode.jsonc` configuration files for command definitions.

#### Scenario: Parse opencode.json for commands

- **WHEN** `opencode.json` exists in project root
- **THEN** system parses `command` object from JSON
- **AND** each command definition includes template, description, agent, and model fields
- **AND** commands are available alongside markdown-defined commands

#### Scenario: Parse opencode.jsonc with comments

- **WHEN** `opencode.jsonc` exists in project root
- **THEN** system parses JSON with comments support
- **AND** comments are ignored during parsing
- **AND** command definitions are processed same as opencode.json

#### Scenario: Merge JSON and markdown commands

- **WHEN** both `opencode.json` and `.opencode/commands/*.md` exist
- **THEN** commands from both sources are merged
- **AND** markdown files take precedence for conflicts (same command name)
- **AND** all commands are available for execution

#### Scenario: JSON schema validation

- **WHEN** parsing opencode.json
- **THEN** validate against OpenCode config schema
- **AND** display clear error messages for invalid schema
- **AND** continue with valid commands if partial validation fails

### Requirement: OpenCode Global Directory Support

The system SHALL support reading commands and skills from `~/.config/opencode/` global directory.

#### Scenario: Read global OpenCode commands

- **WHEN** `~/.config/opencode/commands/` directory exists
- **THEN** system reads command definitions from global directory
- **AND** global commands are available in addition to project-local commands
- **AND** project-local commands override global commands with same name

#### Scenario: Read global OpenCode skills

- **WHEN** `~/.config/opencode/skills/` directory exists
- **THEN** system reads skill definitions from global directory
- **AND** skills use same `.claude/skills/*/SKILL.md` format
- **AND** project-local skills override global skills with same name

#### Scenario: Global directory precedence

- **WHEN** same command exists in both global and project directories
- **THEN** project-local command takes precedence
- **AND** warning is logged about override
- **AND** user can see both versions with appropriate flags

### Requirement: Multi-Tool Configuration

The system SHALL support configuring both Claude and OpenCode in the same project.

#### Scenario: Init with dual-tool selection

- **WHEN** user runs `opence init`
- **THEN** user is prompted to select tools: "Claude", "OpenCode", or "Both"
- **AND** selected tools are configured independently
- **AND** commands are created in both `.claude/commands/` and `.opencode/commands/` if both selected

#### Scenario: List configured tools

- **WHEN** user runs `opence skill list` or similar command
- **THEN** output shows which tools are configured
- **AND** output format: "Configured tools: Claude, OpenCode"
- **AND** skill availability is shown per tool

#### Scenario: Update syncs to all configured tools

- **WHEN** user runs `opence update` with multiple tools configured
- **THEN** opence-native commands are synced to all tool directories
- **AND** opence-native skills are synced to `.claude/skills/` (shared by all)
- **AND** success message confirms sync to all tools

### Requirement: OpenCode Command Format

OpenCode commands SHALL use markdown format with YAML frontmatter following OpenCode conventions.

#### Scenario: Command markdown structure

- **WHEN** generating OpenCode command file
- **THEN** file contains YAML frontmatter with `---` delimiters
- **AND** frontmatter includes: `description`, `agent`, `model` fields
- **AND** command body contains prompt template after frontmatter
- **AND** format matches OpenCode documentation examples

#### Scenario: Command argument support

- **WHEN** command template uses `$ARGUMENTS` placeholder
- **THEN** OpenCode replaces with passed arguments at runtime
- **AND** command supports positional parameters `$1`, `$2`, etc.
- **AND** documentation explains argument substitution

#### Scenario: Command shell output injection

- **WHEN** command template uses `!`command`` syntax
- **THEN** OpenCode executes bash command and injects output
- **AND** commands run in project root directory
- **AND** documentation explains shell command syntax

#### Scenario: Command file references

- **WHEN** command template uses `@filepath` syntax
- **THEN** OpenCode includes file content in prompt
- **AND** file paths are relative to project root
- **AND** documentation explains file reference syntax

### Requirement: OpenCode Path Resolution

The system SHALL correctly resolve OpenCode paths for commands and skills across project and global locations.

#### Scenario: Resolve project OpenCode command path

- **WHEN** system needs to locate OpenCode project commands
- **THEN** path resolves to `.opencode/commands/` in project root
- **AND** path creation includes `opence/` subdirectory for native commands
- **AND** path validation ensures parent directories exist

#### Scenario: Resolve global OpenCode command path

- **WHEN** system needs to locate OpenCode global commands
- **THEN** path resolves to `~/.config/opencode/commands/`
- **AND** path expansion handles user home directory correctly
- **AND** missing global directory is handled gracefully (no error)

#### Scenario: Cross-platform path handling

- **WHEN** resolving paths on different operating systems
- **THEN** Windows uses `%USERPROFILE%\.config\opencode\`
- **AND** macOS/Linux uses `~/.config/opencode/`
- **AND** path separators use platform-specific conventions

### Requirement: Backward Compatibility

OpenCode support SHALL NOT break existing Claude-only configurations.

#### Scenario: Existing Claude projects unchanged

- **WHEN** existing project has only Claude configured
- **THEN** all opence commands continue working without changes
- **AND** no OpenCode directories are created automatically
- **AND** user can add OpenCode support by running `opence init` again

#### Scenario: Non-destructive init

- **WHEN** user runs `opence init` on existing project
- **THEN** existing tool configurations are preserved
- **AND** user can add additional tools without removing existing ones
- **AND** confirmation prompt shown before modifying configurations

#### Scenario: Graceful handling of missing OpenCode

- **WHEN** OpenCode-specific features are used but OpenCode not installed
- **THEN** clear error message explains OpenCode is not configured
- **AND** suggestion provided to run `opence init` to configure OpenCode
- **AND** other configured tools continue working normally

