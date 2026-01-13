# Skill Directory Structure

## Overview

Each skill follows a three-part structure:

```
.claude/skills/my-skill/
├── SKILL.md           # Entry point
├── references/        # Extended docs
└── scripts/           # Reusable code
```

## SKILL.md Purpose

The main SKILL.md file is the entry point AI assistants read first. Keep it:

- **Concise**: Under 200 lines (ideally < 150)
- **Actionable**: Focus on "when" and "what" not "why"
- **Structured**: Use clear sections with consistent headers

### What to Include

- **When to use this skill**: Triggering conditions
- **Quick reference**: Key steps or commands
- **Examples**: 2-3 concrete usage examples
- **Pointers**: Links to references/ for details

### What to Avoid

- Long explanations (move to references/)
- API documentation (move to references/)
- Historical context (move to references/)
- Large code blocks (move to scripts/)

## references/ Purpose

Use this directory for content that's too detailed for SKILL.md:

- **Extended guides**: Step-by-step tutorials
- **API references**: Detailed parameter docs
- **Examples**: Multiple comprehensive examples
- **Background**: Why certain approaches are used
- **Troubleshooting**: Common issues and fixes

Each file should be self-contained and focused on one topic.

## scripts/ Purpose

Store reusable code that users can copy or execute:

- **Helper scripts**: Shell, Python, Node.js scripts
- **Templates**: Code scaffolding
- **Configuration**: Example config files

Add a README.md in scripts/ explaining what each script does.

## Size Guidelines

- **SKILL.md**: 50-200 lines (sweet spot: 100-150)
- **references/*.md**: 100-500 lines each
- **scripts/***: Keep scripts under 200 lines each

If SKILL.md grows beyond 200 lines, split content into references/.

## Before/After Example

**❌ Bad: Everything in SKILL.md** (300+ lines)
```
SKILL.md contains:
- Long historical explanation
- Complete API docs
- 10+ examples
- Troubleshooting guide
- Helper scripts inline
```

**✅ Good: Split appropriately**
```
SKILL.md (120 lines):
- When to use (20 lines)
- Quick reference (40 lines)
- 2 key examples (50 lines)
- See references/ for details (10 lines)

references/api-reference.md (300 lines):
- Complete API documentation

references/examples.md (250 lines):
- 10+ comprehensive examples

references/troubleshooting.md (200 lines):
- Common issues and solutions

scripts/helper.sh (80 lines):
- Automation script
```