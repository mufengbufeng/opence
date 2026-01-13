# Implementation Tasks

## 1. Core Skill Template

- [x] 1.1 Add 'skill-creator' to `OpenceSkillId` type in `opence-skill-templates.ts`
- [x] 1.2 Add 'skill-creator' to `OPENCE_SKILL_IDS` array
- [x] 1.3 Define `SKILL_CREATOR_TOOLS` constant (Read, Write)
- [x] 1.4 Add skill-creator entry to `SKILLS` object with metadata

## 2. Skill Content - Main SKILL.md

- [x] 2.1 Write concise overview (when to create skills, triggering conditions)
- [x] 2.2 Add "Quick Start" section with CLI command examples
- [x] 2.3 Add "Structure" section with directory layout
- [x] 2.4 Add "Naming Rules" section with validation summary
- [x] 2.5 Add "Next Steps" pointing to references/ for details
- [x] 2.6 Keep total under 150 lines for easy scanning

## 3. Reference Documentation

- [x] 3.1 Create `references/directory-structure.md`
  - [x] 3.1.1 Document SKILL.md purpose and size limits
  - [x] 3.1.2 Document references/ usage patterns
  - [x] 3.1.3 Document scripts/ usage patterns
  - [x] 3.1.4 Provide before/after examples

- [x] 3.2 Create `references/frontmatter-formats.md`
  - [x] 3.2.1 Document Claude/Copilot format with full example
  - [x] 3.2.2 Document Codex format with full example
  - [x] 3.2.3 Add side-by-side comparison table
  - [x] 3.2.4 Explain automatic handling by CLI

- [x] 3.3 Create `references/naming-conventions.md`
  - [x] 3.3.1 Document kebab-case requirement
  - [x] 3.3.2 Document reserved prefixes
  - [x] 3.3.3 Provide 10+ good examples
  - [x] 3.3.4 Provide 10+ bad examples with explanations

- [x] 3.4 Create `references/best-practices.md`
  - [x] 3.4.1 Document creation workflow (CLI first)
  - [x] 3.4.2 Document content guidelines (clarity, examples)
  - [x] 3.4.3 Document testing approach
  - [x] 3.4.4 Document version control considerations
  - [x] 3.4.5 Add anti-patterns section

## 4. Template Generation

- [x] 4.1 Implement skill body generation function
- [x] 4.2 Generate main SKILL.md content programmatically
- [x] 4.3 Generate reference files content
- [x] 4.4 Ensure opence markers are included
- [x] 4.5 Test with both Claude and Codex variants

## 5. Testing

- [x] 5.1 Add unit tests for skill-creator template generation
- [x] 5.2 Test skill appears after `opence init`
- [x] 5.3 Test skill updates with `opence update`
- [x] 5.4 Test skill listed with `opence skill list`
- [x] 5.5 Verify references/ files are created
- [x] 5.6 Verify content accuracy and completeness

## 6. Integration

- [x] 6.1 Update compound prompt to reference skill-creator
- [x] 6.2 Update AGENTS.md to mention skill-creator skill
- [x] 6.3 Add note in docs/examples/skill-management.md
- [x] 6.4 Verify init creates skill in all tool directories

## 7. Documentation

- [x] 7.1 Add skill-creator to README skill list
- [x] 7.2 Update CHANGELOG with new skill
- [x] 7.3 Add example usage in docs/
- [x] 7.4 Verify all references are correct

## 8. Polish

- [x] 8.1 Review all content for clarity
- [x] 8.2 Ensure consistent tone and style
- [x] 8.3 Check for typos and formatting
- [x] 8.4 Validate against actual skill creation workflow

- [ ] 4.4 Ensure opence markers are included
- [ ] 4.5 Test with both Claude and Codex variants

## 5. Testing

- [ ] 5.1 Add unit tests for skill-creator template generation
- [ ] 5.2 Test skill appears after `opence init`
- [ ] 5.3 Test skill updates with `opence update`
- [ ] 5.4 Test skill listed with `opence skill list`
- [ ] 5.5 Verify references/ files are created
- [ ] 5.6 Verify content accuracy and completeness

## 6. Integration

- [ ] 6.1 Update compound prompt to reference skill-creator
- [ ] 6.2 Update AGENTS.md to mention skill-creator skill
- [ ] 6.3 Add note in docs/examples/skill-management.md
- [ ] 6.4 Verify init creates skill in all tool directories

## 7. Documentation

- [ ] 7.1 Add skill-creator to README skill list
- [ ] 7.2 Update CHANGELOG with new skill
- [ ] 7.3 Add example usage in docs/
- [ ] 7.4 Verify all references are correct

## 8. Polish

- [ ] 8.1 Review all content for clarity
- [ ] 8.2 Ensure consistent tone and style
- [ ] 8.3 Check for typos and formatting
- [ ] 8.4 Validate against actual skill creation workflow
