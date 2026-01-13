# opence change example

This folder contains a complete Plan/Work/Review/Compound example.

## Files

- proposal.md: Plan output capturing why and what changes.
- tasks.md: Work checklist with step-by-step tasks.
- specs/onboarding/spec.md: Delta spec created during Plan.

## Workflow mapping

- opence-plan: creates proposal.md, tasks.md, and specs/onboarding/spec.md.
- opence-work: implements tasks.md and updates checkboxes.
- opence-review: produces a review summary with findings and test gaps.
- opence-compound: writes docs/solutions/<entry> and prompts to archive.

Use opence validate add-onboarding-checklist --strict to verify the spec delta format.
