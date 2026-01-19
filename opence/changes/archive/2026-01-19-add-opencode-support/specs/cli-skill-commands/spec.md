## MODIFIED Requirements

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
