# Best Practices for Skill Creation

## Creation Workflow

### 1. Identify the Need

Create skills during the compound phase when you find:

- ✅ Repeatable processes (e.g., deployment checklist)
- ✅ Recurring pitfalls (e.g., common bugs to avoid)
- ✅ Domain knowledge (e.g., API testing patterns)
- ✅ Manual checks (e.g., security review steps)

Don't create skills for:

- ❌ One-off solutions
- ❌ Highly project-specific code (put in project docs instead)
- ❌ Trivial tasks (e.g., "how to run npm install")

### 2. Use the CLI First

Always start with:

```bash
opence skill add my-skill --description "Brief description"
```

This ensures:
- Correct directory structure
- Proper frontmatter for all tools
- Valid naming
- references/ and scripts/ directories created

### 3. Write Clear Content

**Do:**
- Start with "When to use this skill"
- Provide concrete examples
- Use bullet points and short paragraphs
- Include commands users can copy-paste
- Point to references/ for details

**Don't:**
- Write long paragraphs without structure
- Assume user knows the context
- Mix multiple unrelated topics
- Forget to provide examples

### 4. Structure for Scanning

AI assistants scan quickly. Make it easy:

```markdown
# skill-name

Brief one-line description.

## When to Use

- Trigger condition 1
- Trigger condition 2

## Quick Reference

1. Step 1 with command
2. Step 2 with command
3. Step 3 with command

## Examples

### Example 1: Common case
```bash
command here
```

### Example 2: Edge case
```bash
command here
```

## See Also

- references/detailed-guide.md
- scripts/helper.sh
```

### 5. Test the Skill

After creating:

1. **Verify structure**:
   ```bash
   opence skill show my-skill
   ```

2. **Check in actual usage**:
   - Ask an AI assistant to use the skill
   - Verify the instructions are clear
   - Fix any confusion

3. **Validate naming**:
   ```bash
   opence skill list
   ```
   Ensure no duplicates or conflicts

## Content Guidelines

### Keep SKILL.md Concise

Target: 100-150 lines

If you're over 200 lines:
- Move API docs to references/api-reference.md
- Move examples to references/examples.md
- Move troubleshooting to references/troubleshooting.md
- Move code to scripts/

### Provide Actionable Instructions

**❌ Vague:**
"Consider checking the API response"

**✅ Specific:**
```bash
# Check API response status
curl -i https://api.example.com/health
# Look for: HTTP/1.1 200 OK
```

### Include Examples

Every skill should have:
- At least 2 concrete examples
- Copy-pasteable commands
- Expected output when relevant

### Reference Other Skills

If your skill relates to others:

```markdown
## Related Skills

- `api-testing` - For API endpoint validation
- `error-recovery` - For handling failures
```

## Version Control

### Commit Skills

Skills are part of your project:

```bash
git add .claude/skills/my-skill
git add .codex/skills/my-skill
git commit -m "Add my-skill for [purpose]"
```

### Update with opence update

When opence conventions change:

```bash
opence update
```

This refreshes native skills. User skills are left unchanged.

## Anti-Patterns

### ❌ Tutorial Dump

Don't copy-paste entire tutorials. Extract key steps.

### ❌ Over-Abstraction

Skills should be practical, not theoretical. Focus on "how" not "why."

### ❌ Duplication

Check existing skills before creating:

```bash
opence skill list
opence skill show existing-skill
```

### ❌ Scope Creep

Each skill should focus on one clear purpose. If it does too much, split it.

### ❌ Forgetting Updates

If conventions change, update your skills. Don't let them become stale.

## Maintenance

### Review Periodically

Every few months:
- Check if skills are still relevant
- Update for new tools or practices
- Remove obsolete skills

### Document Changes

When updating a skill, note what changed:

```bash
git commit -m "Update api-testing skill to include new auth flow"
```

### Share with Team

Skills benefit everyone. Document them and encourage team to use them:

- Mention in README
- Link in relevant docs
- Demonstrate in onboarding