# Implementation Tasks

## 1. Core Skill Template

- [ ] 1.1 Add 'archive' to `OpenceSkillId` type in `opence-skill-templates.ts`
- [ ] 1.2 Add 'archive' to `OPENCE_SKILL_IDS` array
- [ ] 1.3 Define `ARCHIVE_TOOLS` constant (Read, Write, Bash)
- [ ] 1.4 Add archive entry to `SKILLS` object with metadata

## 2. Skill Content - Main SKILL.md

- [ ] 2.1 Write "When to Archive" section (triggering conditions)
- [ ] 2.2 Write "Pre-Archive Verification" checklist section
- [ ] 2.3 Write "Archive Command" section with usage examples
- [ ] 2.4 Write "Understanding Output" section (status, deltas, prompts)
- [ ] 2.5 Write "Post-Archive Verification" section
- [ ] 2.6 Write "Troubleshooting" section for edge cases
- [ ] 2.7 Keep total under 150 lines for easy scanning

## 3. Template Generation

- [ ] 3.1 Implement archive body generation in `getSkillBody()` function
- [ ] 3.2 Ensure opence markers are included
- [ ] 3.3 Test with both Claude and Codex variants
- [ ] 3.4 Verify proper frontmatter generation

## 4. Integration Updates

- [ ] 4.1 Update compound skill template to reference archive skill
- [ ] 4.2 Update `compoundSteps` in `slash-command-templates.ts`
- [ ] 4.3 Update `.github/prompts/opence-compound.prompt.md`
- [ ] 4.4 Run `opence update` to sync all prompts and skills

## 5. Testing

- [ ] 5.1 Test skill appears after `opence update`
- [ ] 5.2 Test skill listed with `opence skill list`
- [ ] 5.3 Verify skill content with `opence skill show opence-archive`
- [ ] 5.4 Test skill created in both .claude and .codex directories
- [ ] 5.5 Verify frontmatter correct for each tool
- [ ] 5.6 Test in actual archive workflow
- [ ] 5.7 Run full test suite to ensure no regressions

## 6. Documentation

- [ ] 6.1 Update README workflow section to include archive
- [ ] 6.2 Update README native skills list
- [ ] 6.3 Add example archive workflow to docs/
- [ ] 6.4 Update any workflow diagrams if they exist

## 7. Validation

- [ ] 7.1 Run `opence validate add-archive-skill --strict`
- [ ] 7.2 Fix any validation issues
- [ ] 7.3 Verify all scenarios have proper format
- [ ] 7.4 Ensure requirement headers match conventions
