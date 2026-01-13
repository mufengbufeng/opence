## MODIFIED Requirements

### Requirement: Skill Creator Native Skill

The system SHALL provide an `opence-skill-creator` native skill that documents skill creation conventions and best practices.

#### Scenario: Skill available after init

- **WHEN** user runs `opence init` and configures AI tools
- **THEN** `opence-skill-creator` skill is created in configured tool directories
- **AND** skill includes guidance on naming, structure, and frontmatter

#### Scenario: Skill available after update

- **WHEN** user runs `opence update` in existing project
- **THEN** `opence-skill-creator` skill is created or refreshed
- **AND** skill content reflects current opence conventions

#### Scenario: Skill provides CLI command reference

- **WHEN** AI assistant reads opence-skill-creator skill
- **THEN** skill references `opence skill add` command
- **AND** skill explains when to use CLI vs manual creation
- **AND** skill includes examples of CLI usage

## ADDED Requirements

### Requirement: Archive Workflow Native Skill

The system SHALL provide an `opence-archive` native skill that guides AI assistants through the archive workflow step.

#### Scenario: Skill available after init

- **WHEN** user runs `opence init` and configures AI tools
- **THEN** `opence-archive` skill is created in configured tool directories
- **AND** skill includes guidance on when to archive

#### Scenario: Skill available after update

- **WHEN** user runs `opence update` in existing project
- **THEN** `opence-archive` skill is created or refreshed
- **AND** skill content reflects current archive workflow

#### Scenario: Skill provides pre-archive verification

- **WHEN** AI assistant prepares to archive a change
- **THEN** skill lists pre-archive verification steps
- **AND** skill includes validation commands
- **AND** skill documents task completion requirements

### Requirement: Archive Command Guidance

The opence-archive skill SHALL document the `opence archive` command usage and options.

#### Scenario: Command syntax documented

- **WHEN** AI assistant needs to run archive command
- **THEN** skill provides basic command syntax
- **AND** skill documents available flags (--yes, --skip-specs, --no-validate)
- **AND** skill explains when to use each flag

#### Scenario: Output interpretation explained

- **WHEN** AI assistant reviews archive command output
- **THEN** skill explains task status messages
- **AND** skill explains spec delta summary format
- **AND** skill documents confirmation prompts

#### Scenario: Edge cases documented

- **WHEN** archive encounters incomplete tasks
- **THEN** skill explains the warning message
- **AND** skill provides guidance on whether to proceed

### Requirement: Pre-Archive Verification Checklist

The skill SHALL provide a comprehensive pre-archive verification checklist.

#### Scenario: Verification steps listed

- **WHEN** AI assistant prepares to archive
- **THEN** skill lists required verification steps
- **AND** skill includes validation command
- **AND** skill includes test execution requirement
- **AND** skill includes tasks.md reality check

#### Scenario: Validation requirement documented

- **WHEN** AI assistant checks pre-archive requirements
- **THEN** skill requires `opence validate <id> --strict` to pass
- **AND** skill explains what validation checks
- **AND** skill provides troubleshooting for validation failures

#### Scenario: Task completion verification

- **WHEN** AI assistant reviews tasks.md
- **THEN** skill requires all items marked [x]
- **AND** skill warns against archiving with incomplete tasks
- **AND** skill explains how to handle legitimately skipped tasks

### Requirement: Post-Archive Verification

The skill SHALL guide AI assistants on verifying successful archive operations.

#### Scenario: Verification commands provided

- **WHEN** archive command completes
- **THEN** skill lists post-archive verification commands
- **AND** skill includes `opence list` to confirm no active changes
- **AND** skill includes checking specs/ directory for updates

#### Scenario: Archive location documented

- **WHEN** change is archived
- **THEN** skill documents archive directory structure
- **AND** skill explains archive naming (YYYY-MM-DD-change-id)
- **AND** skill notes original change is moved, not copied

#### Scenario: Spec application verified

- **WHEN** archive completes with spec updates
- **THEN** skill guides checking opence/specs/ for new/updated files
- **AND** skill recommends running tests to verify specs match code
- **AND** skill notes spec Purpose should be updated post-archive

### Requirement: Integration with Compound Workflow

The opence-archive skill SHALL be referenced in the compound workflow.

#### Scenario: Referenced in compound skill

- **WHEN** compound phase completes
- **THEN** compound skill references opence-archive skill
- **AND** compound skill notes archiving is the final step
- **AND** compound skill explains archive applies spec updates

#### Scenario: Skill listed with other workflow skills

- **WHEN** user runs `opence skill list`
- **THEN** opence-archive appears with other native skills
- **AND** skill is marked as native (not user-defined)
- **AND** skill appears in logical workflow order

#### Scenario: Skill refreshable

- **WHEN** archive workflow changes
- **THEN** `opence update` refreshes archive skill content
- **AND** changes are documented in CHANGELOG
