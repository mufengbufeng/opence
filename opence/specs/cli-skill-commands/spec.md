# cli-skill-commands Specification

## Purpose

Provides CLI commands for managing AI assistant skills in opence projects. Supports creating, listing, viewing, updating, and removing user-defined skills across multiple AI tools (Claude, OpenCode, Codex, GitHub Copilot). Includes both interactive and non-interactive modes to enable human users, AI assistants, and automation to manage skills programmatically.

## Requirements
### Requirement: Skill Command Group

The CLI SHALL provide a `skill` command group for managing skills in the project.

#### Scenario: Skill command group exists
- **WHEN** user runs `opence skill --help`
- **THEN** help text displays available subcommands: add, list, show, update, remove

#### Scenario: Skill command without subcommand
- **WHEN** user runs `opence skill` without a subcommand
- **THEN** CLI displays help text with available subcommands

### Requirement: Create New Skill

The CLI SHALL provide `opence skill add <name>` to create a new user-defined skill, supporting both interactive and non-interactive modes.

#### Scenario: Create skill interactively
- **WHEN** user runs `opence skill add project-guidelines`
- **AND** project has configured tools from `opence init`
- **THEN** CLI prompts for description
- **AND** CLI prompts for allowed-tools (Claude/Copilot only)
- **AND** CLI creates skill directories in `.claude/skills/project-guidelines/` and `.codex/skills/project-guidelines/`
- **AND** CLI generates SKILL.md with proper frontmatter for each tool
- **AND** CLI creates empty `references/` and `scripts/` directories
- **AND** CLI displays success message with file paths

#### Scenario: Create skill non-interactively with all parameters
- **WHEN** user runs `opence skill add api-testing --description "API testing guidelines" --allowed-tools "Read,Write,Bash" --non-interactive`
- **THEN** CLI creates skill without prompts
- **AND** skill is created in all configured tool directories

#### Scenario: Create skill non-interactively with minimal parameters
- **WHEN** user runs `opence skill add api-testing --non-interactive --description "API testing guidelines"`
- **AND** no `--allowed-tools` flag is provided
- **THEN** CLI uses default allowed-tools set: "Read,Write,Edit,Grep,Glob,Bash"
- **AND** CLI creates skill without prompts

#### Scenario: Create skill with flags but without non-interactive flag
- **WHEN** user runs `opence skill add api-testing --description "API testing guidelines" --allowed-tools "Read,Write,Bash"`
- **THEN** CLI creates skill without prompts (auto-detects non-interactive intent)
- **AND** skill is created in all configured tool directories

#### Scenario: Create skill non-interactively missing required description
- **WHEN** user runs `opence skill add api-testing --non-interactive`
- **AND** no `--description` flag is provided
- **THEN** CLI displays error: "Description is required in non-interactive mode. Use --description flag."
- **AND** CLI exits with non-zero status

#### Scenario: Create skill with invalid allowed-tools value
- **WHEN** user runs `opence skill add api-testing --description "Testing" --allowed-tools "Read,InvalidTool"`
- **THEN** CLI displays error: "Invalid tool name: InvalidTool. Valid tools: Read, Write, Edit, Grep, Glob, Bash, Task, TodoRead, TodoWrite, Question, Skill, WebFetch"
- **AND** CLI exits with non-zero status

#### Scenario: Create skill with invalid name
- **WHEN** user runs `opence skill add "My Skill"` (with spaces)
- **THEN** CLI displays error: "Skill name must be kebab-case (letters, numbers, hyphens only)"
- **AND** CLI exits with non-zero status

#### Scenario: Create skill with reserved name
- **WHEN** user runs `opence skill add opence-custom`
- **THEN** CLI displays error: "Skill names starting with 'opence-' are reserved"
- **AND** CLI exits with non-zero status

#### Scenario: Create skill when name already exists
- **WHEN** user runs `opence skill add api-testing`
- **AND** a skill named "api-testing" already exists
- **THEN** CLI displays error: "Skill 'api-testing' already exists"
- **AND** CLI suggests using `opence skill update` instead

#### Scenario: Create skill when no tools configured
- **WHEN** user runs `opence skill add my-skill`
- **AND** project hasn't run `opence init` yet
- **THEN** CLI displays error: "No AI tools configured. Run 'opence init' first."
- **AND** CLI exits with non-zero status

### Requirement: List All Skills

The CLI SHALL provide `opence skill list` to display all skills in the project.

#### Scenario: List skills with both native and user skills

- **WHEN** user runs `opence skill list`
- **AND** project has opence-native skills and user-defined skills
- **THEN** CLI displays section "Opence-native skills:" with opence-plan, opence-work, opence-review, opence-compound
- **AND** CLI displays which tools each native skill is installed for (Claude, OpenCode, or both)
- **AND** CLI displays section "User-defined skills:" with user skill names
- **AND** CLI displays which tools each user skill is installed for
- **AND** CLI displays hint: "Use 'opence skill show <name>' for details."

#### Scenario: List skills in JSON format

- **WHEN** user runs `opence skill list --json`
- **THEN** CLI outputs JSON object with "native" and "user" arrays
- **AND** each skill object contains "name" and "tools" fields
- **AND** "tools" field is an array like `["claude", "opencode"]`

#### Scenario: List skills when only native skills exist

- **WHEN** user runs `opence skill list`
- **AND** project has no user-defined skills
- **THEN** CLI displays opence-native skills with their configured tools
- **AND** CLI displays message: "No user-defined skills. Use 'opence skill add <name>' to create one."

#### Scenario: List skills when no tools configured

- **WHEN** user runs `opence skill list`
- **AND** project hasn't run `opence init`
- **THEN** CLI displays message: "No AI tools configured. Run 'opence init' to get started."
- **AND** CLI lists supported tools: "Supported tools: Claude, OpenCode"

### Requirement: Show Skill Details

The CLI SHALL provide `opence skill show <name>` to display detailed information about a specific skill.

#### Scenario: Show existing user skill

- **WHEN** user runs `opence skill show api-testing`
- **AND** skill exists in project
- **THEN** CLI displays skill name and description
- **AND** CLI displays configured tools (Claude, OpenCode, or both)
- **AND** CLI displays file path: `.claude/skills/api-testing/SKILL.md`
- **AND** CLI displays note: "Skill location: .claude/skills/ (shared by Claude and OpenCode)"
- **AND** CLI displays content preview (first 20 lines of SKILL.md)

#### Scenario: Show existing native skill

- **WHEN** user runs `opence skill show opence-plan`
- **THEN** CLI displays skill information
- **AND** CLI displays configured tools
- **AND** CLI displays note: "(opence-native skill)"

#### Scenario: Show skill in JSON format

- **WHEN** user runs `opence skill show api-testing --json`
- **THEN** CLI outputs JSON with name, description, tools (array), path, and full content
- **AND** "tools" field shows `["claude", "opencode"]` or subset

#### Scenario: Show non-existent skill

- **WHEN** user runs `opence skill show missing-skill`
- **AND** skill doesn't exist
- **THEN** CLI displays error: "Skill 'missing-skill' not found"
- **AND** CLI suggests running `opence skill list` to see available skills

### Requirement: Update Existing Skill

The CLI SHALL provide `opence skill update <name>` to modify an existing skill's metadata, supporting both interactive and non-interactive modes.

#### Scenario: Update skill interactively
- **WHEN** user runs `opence skill update api-testing`
- **AND** skill exists
- **THEN** CLI prompts for new description (showing current value as default)
- **AND** CLI prompts for allowed-tools if applicable (showing current value)
- **AND** CLI updates SKILL.md in all tool directories where skill exists
- **AND** CLI preserves the instructions section content
- **AND** CLI displays success message

#### Scenario: Update skill non-interactively
- **WHEN** user runs `opence skill update api-testing --description "Updated description" --non-interactive`
- **THEN** CLI updates skill without prompts
- **AND** only specified fields are updated

#### Scenario: Update skill with flags but without non-interactive flag
- **WHEN** user runs `opence skill update api-testing --description "Updated description"`
- **THEN** CLI updates skill without prompts (auto-detects non-interactive intent)
- **AND** only specified fields are updated

#### Scenario: Update skill non-interactively with no changes
- **WHEN** user runs `opence skill update api-testing --non-interactive`
- **AND** no update flags (--description, --allowed-tools) are provided
- **THEN** CLI displays error: "No update parameters provided. Use --description or --allowed-tools flags."
- **AND** CLI exits with non-zero status

#### Scenario: Update non-existent skill
- **WHEN** user runs `opence skill update missing-skill`
- **AND** skill doesn't exist
- **THEN** CLI displays error: "Skill 'missing-skill' not found"
- **AND** CLI suggests using `opence skill add` to create it

#### Scenario: Update opence-native skill
- **WHEN** user runs `opence skill update opence-plan`
- **THEN** CLI displays warning: "opence-native skills are managed by opence. Use 'opence update' to refresh them."
- **AND** CLI exits without making changes

### Requirement: Remove Skill

The CLI SHALL provide `opence skill remove <name>` to delete a skill from the project.

#### Scenario: Remove user skill with confirmation
- **WHEN** user runs `opence skill remove api-testing`
- **AND** skill exists
- **THEN** CLI prompts: "Remove skill 'api-testing' from all configured tools? (y/N)"
- **WHEN** user confirms with "y"
- **THEN** CLI removes skill directory from `.claude/skills/` and `.codex/skills/`
- **AND** CLI displays success message

#### Scenario: Remove skill without confirmation
- **WHEN** user runs `opence skill remove api-testing --yes`
- **THEN** CLI removes skill without prompting

#### Scenario: User declines removal confirmation
- **WHEN** user runs `opence skill remove api-testing`
- **AND** user responds "n" to confirmation prompt
- **THEN** CLI displays "Removal cancelled"
- **AND** skill is not removed

#### Scenario: Remove non-existent skill
- **WHEN** user runs `opence skill remove missing-skill`
- **THEN** CLI displays error: "Skill 'missing-skill' not found"

#### Scenario: Remove opence-native skill
- **WHEN** user runs `opence skill remove opence-plan`
- **THEN** CLI displays error: "Cannot remove opence-native skills"
- **AND** CLI exits without making changes

### Requirement: Tool Configuration Detection

The CLI SHALL detect which AI tools are configured in the project to determine where to create/manage skills.

#### Scenario: Detect configured tools

- **WHEN** skill command needs to determine configured tools
- **THEN** CLI checks for existence of `.claude/skills/opence-*/SKILL.md` with opence markers
- **AND** CLI checks for existence of `.opencode/` directory OR `opencode.json` file
- **AND** CLI considers Claude configured if at least one opence-native skill exists with markers
- **AND** CLI considers OpenCode configured if `.opencode/` directory or `opencode.json` file exists

#### Scenario: Multiple tools configured

- **WHEN** both Claude and OpenCode are configured
- **THEN** skill operations display both tools in output
- **AND** skills are created/managed in `.claude/skills/` (shared by both tools)
- **AND** tool list shows "Claude, OpenCode"

#### Scenario: Single tool configured - Claude

- **WHEN** only Claude is configured
- **THEN** skill operations only mention Claude
- **AND** skill operations only apply to `.claude/skills/` directory

#### Scenario: Single tool configured - OpenCode

- **WHEN** only OpenCode is configured (`.opencode/` exists but no `.claude/`)
- **THEN** skill operations only mention OpenCode
- **AND** skills are created in `.claude/skills/` (OpenCode reads from there)
- **AND** CLI creates `.claude/skills/` if it doesn't exist

#### Scenario: No tools configured

- **WHEN** neither Claude nor OpenCode is configured
- **THEN** CLI displays error: "No AI tools configured. Run 'opence init' first."
- **AND** CLI lists supported tools: "Supported tools: Claude, OpenCode"

### Requirement: Skill Naming Validation

The CLI SHALL validate skill names to ensure consistency and prevent conflicts.

#### Scenario: Valid skill name
- **WHEN** user provides skill name "project-guidelines"
- **THEN** validation passes

#### Scenario: Invalid characters in name
- **WHEN** user provides skill name containing spaces, underscores, or special characters
- **THEN** CLI displays error with expected format (kebab-case)

#### Scenario: Reserved prefix validation
- **WHEN** user provides skill name starting with "opence-"
- **THEN** CLI displays error about reserved prefix

#### Scenario: Name uniqueness check
- **WHEN** creating or renaming a skill
- **THEN** CLI checks if name already exists across all configured tools
- **AND** displays error if conflict found

### Requirement: Skill Directory Structure

The CLI SHALL create proper directory structure for new skills following skill-creator guidance.

#### Scenario: Scaffold skill structure
- **WHEN** creating a new skill
- **THEN** CLI creates `<skill-name>/SKILL.md` with frontmatter and placeholder instructions
- **AND** CLI creates `<skill-name>/references/` directory
- **AND** CLI creates `<skill-name>/scripts/` directory
- **AND** directories are created in all configured tool paths

### Requirement: Frontmatter Format Handling

The CLI SHALL generate appropriate frontmatter based on the target AI tool.

#### Scenario: Generate Claude/Copilot frontmatter
- **WHEN** creating skill for Claude or GitHub Copilot
- **THEN** frontmatter includes: name, description, allowed-tools, user-invocable

#### Scenario: Generate Codex frontmatter
- **WHEN** creating skill for Codex
- **THEN** frontmatter includes: name, description, metadata.short-description

#### Scenario: Different descriptions for different tools
- **WHEN** user provides description and short-description
- **THEN** Claude/Copilot uses full description
- **AND** Codex uses metadata.short-description field

### Requirement: Error Handling and User Guidance

The CLI SHALL provide clear error messages and helpful guidance when operations fail.

#### Scenario: Helpful error for missing opence init
- **WHEN** user tries skill command without configured tools
- **THEN** CLI displays error explaining opence init is required
- **AND** CLI provides example: "Run 'opence init' to configure AI tools"

#### Scenario: Helpful error for file system issues
- **WHEN** skill creation fails due to permissions or disk space
- **THEN** CLI displays clear error with the underlying issue
- **AND** CLI suggests potential fixes

#### Scenario: Helpful error for conflicts
- **WHEN** operation conflicts with existing files
- **THEN** CLI explains the conflict
- **AND** CLI suggests resolution steps

### Requirement: Non-Interactive Mode Detection

The CLI SHALL automatically detect when commands should run in non-interactive mode based on provided flags or environment.

#### Scenario: Auto-detect non-interactive from flags
- **WHEN** user provides any skill command with `--description` or `--allowed-tools` flags
- **THEN** CLI automatically runs in non-interactive mode without requiring `--non-interactive` flag

#### Scenario: Explicit non-interactive flag
- **WHEN** user provides `--non-interactive` flag
- **THEN** CLI runs in non-interactive mode regardless of other flags
- **AND** CLI exits with error if required parameters are missing

#### Scenario: Environment-based detection
- **WHEN** running in CI/CD environment (CI=true environment variable)
- **OR** stdin is not a TTY
- **THEN** CLI prefers non-interactive mode
- **AND** displays helpful error if interactive input would be required

### Requirement: Allowed Tools Validation

The CLI SHALL validate allowed-tools parameter values against a known set of valid tool names.

#### Scenario: Valid tool names accepted
- **WHEN** user provides `--allowed-tools "Read,Write,Bash"`
- **THEN** validation passes

#### Scenario: Case-insensitive validation
- **WHEN** user provides `--allowed-tools "read,write,bash"`
- **THEN** CLI normalizes to proper case (Read, Write, Bash)
- **AND** validation passes

#### Scenario: Whitespace handling
- **WHEN** user provides `--allowed-tools "Read, Write, Bash"` (with spaces)
- **THEN** CLI strips whitespace
- **AND** validation passes

#### Scenario: Invalid tool name rejected
- **WHEN** user provides `--allowed-tools "Read,FakeTool"`
- **THEN** CLI displays error listing the invalid tool name
- **AND** CLI displays list of valid tool names
- **AND** CLI exits with non-zero status

#### Scenario: Empty allowed-tools in non-interactive mode
- **WHEN** user provides `--allowed-tools ""`
- **THEN** CLI uses default tool set
- **OR** treats as if flag was not provided

### Requirement: Default Tool Configuration

The CLI SHALL provide sensible defaults for allowed-tools when not specified in non-interactive mode.

#### Scenario: Default allowed-tools for skill creation
- **WHEN** creating skill in non-interactive mode without `--allowed-tools` flag
- **THEN** CLI uses default set: "Read,Write,Edit,Grep,Glob,Bash"

#### Scenario: No defaults applied in interactive mode
- **WHEN** creating skill in interactive mode
- **AND** user is prompted for allowed-tools
- **THEN** CLI does not pre-select any tools by default
- **AND** user must explicitly select desired tools

### Requirement: Error Messages for AI Execution

The CLI SHALL provide helpful error messages when interactive prompts fail, guiding users toward non-interactive alternatives.

#### Scenario: Detect prompt cancellation
- **WHEN** interactive prompt is cancelled or fails
- **THEN** CLI detects the error condition
- **AND** CLI displays message: "Interactive prompt failed. For automated execution, use flags: --description 'Your description' --allowed-tools 'Read,Write,Bash' --non-interactive"
- **AND** CLI exits with non-zero status

#### Scenario: Suggest non-interactive mode in error output
- **WHEN** any skill command fails due to missing interactive input
- **THEN** error message includes example with non-interactive flags
- **AND** error message references documentation or help text

