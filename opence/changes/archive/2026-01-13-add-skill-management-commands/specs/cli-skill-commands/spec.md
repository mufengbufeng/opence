# CLI Skill Commands Specification

## ADDED Requirements

### Requirement: Skill Command Group

The CLI SHALL provide a `skill` command group for managing skills in the project.

#### Scenario: Skill command group exists
- **WHEN** user runs `opence skill --help`
- **THEN** help text displays available subcommands: add, list, show, update, remove

#### Scenario: Skill command without subcommand
- **WHEN** user runs `opence skill` without a subcommand
- **THEN** CLI displays help text with available subcommands

### Requirement: Create New Skill

The CLI SHALL provide `opence skill add <name>` to create a new user-defined skill.

#### Scenario: Create skill interactively
- **WHEN** user runs `opence skill add project-guidelines`
- **AND** project has configured tools from `opence init`
- **THEN** CLI prompts for description
- **AND** CLI prompts for allowed-tools (Claude/Copilot only)
- **AND** CLI creates skill directories in `.claude/skills/project-guidelines/` and `.codex/skills/project-guidelines/`
- **AND** CLI generates SKILL.md with proper frontmatter for each tool
- **AND** CLI creates empty `references/` and `scripts/` directories
- **AND** CLI displays success message with file paths

#### Scenario: Create skill non-interactively
- **WHEN** user runs `opence skill add api-testing --description "API testing guidelines" --allowed-tools "Read,Write,Bash"`
- **THEN** CLI creates skill without prompts
- **AND** skill is created in all configured tool directories

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
- **AND** CLI displays which tools each native skill is installed for
- **AND** CLI displays section "User-defined skills:" with user skill names
- **AND** CLI displays which tools each user skill is installed for
- **AND** CLI displays hint: "Use 'opence skill show <name>' for details."

#### Scenario: List skills in JSON format
- **WHEN** user runs `opence skill list --json`
- **THEN** CLI outputs JSON object with "native" and "user" arrays
- **AND** each skill object contains "name" and "tools" fields

#### Scenario: List skills when only native skills exist
- **WHEN** user runs `opence skill list`
- **AND** project has no user-defined skills
- **THEN** CLI displays opence-native skills
- **AND** CLI displays message: "No user-defined skills. Use 'opence skill add <name>' to create one."

#### Scenario: List skills when no tools configured
- **WHEN** user runs `opence skill list`
- **AND** project hasn't run `opence init`
- **THEN** CLI displays message: "No AI tools configured. Run 'opence init' to get started."

### Requirement: Show Skill Details

The CLI SHALL provide `opence skill show <name>` to display detailed information about a specific skill.

#### Scenario: Show existing user skill
- **WHEN** user runs `opence skill show api-testing`
- **AND** skill exists in project
- **THEN** CLI displays skill name and description
- **AND** CLI displays configured tools
- **AND** CLI displays file paths for each tool
- **AND** CLI displays content preview (first 20 lines of SKILL.md)

#### Scenario: Show existing native skill
- **WHEN** user runs `opence skill show opence-plan`
- **THEN** CLI displays skill information
- **AND** CLI displays note: "(opence-native skill)"

#### Scenario: Show skill in JSON format
- **WHEN** user runs `opence skill show api-testing --json`
- **THEN** CLI outputs JSON with name, description, tools, paths, and full content

#### Scenario: Show non-existent skill
- **WHEN** user runs `opence skill show missing-skill`
- **AND** skill doesn't exist
- **THEN** CLI displays error: "Skill 'missing-skill' not found"
- **AND** CLI suggests running `opence skill list` to see available skills

### Requirement: Update Existing Skill

The CLI SHALL provide `opence skill update <name>` to modify an existing skill's metadata.

#### Scenario: Update skill interactively
- **WHEN** user runs `opence skill update api-testing`
- **AND** skill exists
- **THEN** CLI prompts for new description (showing current value as default)
- **AND** CLI prompts for allowed-tools if applicable (showing current value)
- **AND** CLI updates SKILL.md in all tool directories where skill exists
- **AND** CLI preserves the instructions section content
- **AND** CLI displays success message

#### Scenario: Update skill non-interactively
- **WHEN** user runs `opence skill update api-testing --description "Updated description"`
- **THEN** CLI updates skill without prompts
- **AND** only specified fields are updated

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
- **AND** CLI checks for existence of `.codex/skills/opence-*/SKILL.md` with opence markers
- **AND** CLI considers a tool configured if at least one opence-native skill exists with markers

#### Scenario: Multiple tools configured
- **WHEN** both Claude and Codex are configured
- **THEN** skill operations apply to both `.claude/skills/` and `.codex/skills/` directories

#### Scenario: Single tool configured
- **WHEN** only Claude is configured
- **THEN** skill operations only apply to `.claude/skills/` directory

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
