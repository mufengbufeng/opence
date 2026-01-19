## MODIFIED Requirements

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

## ADDED Requirements

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
