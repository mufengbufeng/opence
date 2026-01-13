## ADDED Requirements

### Requirement: Archive Workflow Prompt
The system SHALL provide an `opence-archive` prompt that guides the AI assistant to perform the archive workflow using the native skill.

#### Scenario: Prompt available
- **WHEN** user runs `opence update`
- **THEN** `.github/prompts/opence-archive.prompt.md` is generated
- **AND** prompt instructs AI to consult `opence-archive` skill

#### Scenario: Prompt content
- **WHEN** AI reads `opence-archive.prompt.md`
- **THEN** it contains steps to finalize the change
- **AND** it references `opence-archive` skill for verification steps
