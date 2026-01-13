## ADDED Requirements

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

### Requirement: Skill Structure Guidance

The opence-skill-creator skill SHALL document the standard skill directory structure and file purposes.

#### Scenario: Directory structure documented

- **WHEN** AI assistant references skill-creator skill
- **THEN** skill explains SKILL.md purpose (concise entry point)
- **AND** skill explains references/ purpose (detailed documentation)
- **AND** skill explains scripts/ purpose (reusable code)

#### Scenario: Size guidelines provided

- **WHEN** AI assistant reads structure guidance
- **THEN** skill specifies SKILL.md should be under 200 lines
- **AND** skill explains when to move content to references/
- **AND** skill provides examples of good structure

### Requirement: Naming Convention Documentation

The skill SHALL document skill naming rules and validation criteria.

#### Scenario: Naming rules explained

- **WHEN** AI assistant needs to name a new skill
- **THEN** skill specifies kebab-case requirement
- **AND** skill lists reserved prefixes (opence-)
- **AND** skill provides good and bad examples

#### Scenario: Validation criteria listed

- **WHEN** AI assistant validates skill name
- **THEN** skill documents regex pattern: `^[a-z0-9]+(-[a-z0-9]+)*$`
- **AND** skill explains uniqueness requirement
- **AND** skill references CLI validation

### Requirement: Frontmatter Format Reference

The skill SHALL provide reference documentation for tool-specific frontmatter formats.

#### Scenario: Claude/Copilot format documented

- **WHEN** AI assistant creates skill for Claude or GitHub Copilot
- **THEN** references/ includes allowed-tools examples
- **AND** references/ includes user-invocable field explanation
- **AND** references/ includes context field usage

#### Scenario: Codex format documented

- **WHEN** AI assistant creates skill for Codex
- **THEN** references/ includes metadata.short-description format
- **AND** references/ explains field purpose
- **AND** references/ provides complete example

#### Scenario: Format differences explained

- **WHEN** AI assistant reads frontmatter reference
- **THEN** references/ explains why formats differ
- **AND** references/ notes CLI handles formats automatically
- **AND** references/ shows side-by-side comparison

### Requirement: Best Practices Documentation

The skill SHALL include best practices for skill creation and maintenance.

#### Scenario: Creation workflow documented

- **WHEN** AI assistant prepares to create skill
- **THEN** skill recommends using `opence skill add` first
- **AND** skill explains when manual creation is needed
- **AND** skill lists post-creation checklist

#### Scenario: Content guidelines provided

- **WHEN** AI assistant writes skill content
- **THEN** skill recommends clear "When to use" section
- **AND** skill recommends concrete examples
- **AND** skill recommends avoiding duplication with other skills

#### Scenario: Testing guidance included

- **WHEN** AI assistant completes skill creation
- **THEN** skill recommends verifying with `opence skill show`
- **AND** skill suggests testing in actual usage scenario
- **AND** skill notes version control considerations

### Requirement: Integration with Compound Workflow

The skill SHALL be discoverable and usable during the compound phase of opence workflow.

#### Scenario: Referenced in compound prompts

- **WHEN** compound phase prompts are updated
- **THEN** prompts reference "see opence-skill-creator skill"
- **AND** prompts note skill-creator as authoritative source

#### Scenario: Skill listed with other native skills

- **WHEN** user runs `opence skill list`
- **THEN** opence-skill-creator appears with other native skills
- **AND** skill is marked as native (not user-defined)

#### Scenario: Skill refreshable

- **WHEN** opence conventions change
- **THEN** `opence update` refreshes skill-creator content
- **AND** changes are documented in CHANGELOG
