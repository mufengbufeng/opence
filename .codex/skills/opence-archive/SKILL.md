---
name: opence-archive
description: Archive a completed change and apply spec updates to the main specifications.
metadata:
  short-description: Archive changes and apply spec updates.
---

<!-- OPENCE:START -->
# opence-archive

Archive a completed change and apply spec updates to the main specifications.

## When to Archive

Archive a change when:
- The compound phase is complete (documentation and skills created)
- All tasks in tasks.md are marked [x] complete
- Review has been done and no blockers remain
- You're ready to finalize the change

**Triggering signals**:
- Compound step says "prompt to run `opence archive <change-id>`"
- All documentation in docs/solutions/ is complete
- Any repeatable workflows have been captured as skills
- Change is ready to become part of the project's specs

## Pre-Archive Verification

Before archiving, verify:

```bash
# 1. Validation passes
opence validate <change-id> --strict

# 2. All tests pass
npm test  # or your test command

# 3. Review tasks.md
# Ensure all items are [x] checked and reflect reality

# 4. Confirm correct change
opence list  # Verify you're archiving the right change
```

**Critical checks**:
- [ ] `opence validate <id> --strict` passes with no errors
- [ ] All tests pass
- [ ] tasks.md items all marked [x]
- [ ] Proposal matches implementation
- [ ] Documentation complete in docs/solutions/
- [ ] Skills created if applicable

## Archive Command

Basic usage:

```bash
# Archive with confirmation prompts
opence archive <change-id>

# Archive without prompts (for scripts)
opence archive <change-id> --yes

# Archive without updating specs (infrastructure/docs only changes)
opence archive <change-id> --skip-specs

# Skip validation (not recommended)
opence archive <change-id> --no-validate
```

**When to use flags**:
- `--yes`: Use in scripts or when you're confident
- `--skip-specs`: For changes that don't affect specifications
- `--no-validate`: Only if validation has false positives (requires confirmation)

## Understanding Output

Archive command shows:

1. **Task status check**:
   ```
   Task status: 37/57 tasks
   ⚠ Warning: 20 incomplete task(s) found. Continue? Yes/No
   ```
   - Warns if tasks.md has unchecked items
   - You can proceed, but review why tasks are incomplete

2. **Spec delta summary**:
   ```
   Specs to update:
     opence-native-skills: create
   
   Applying changes to opence/specs/opence-native-skills/spec.md:
     + 6 added
     ~ 2 modified
     - 1 removed
   Totals: + 6, ~ 2, - 1, → 0
   ```
   - Shows which specs will be updated
   - `+` = added requirements
   - `~` = modified requirements
   - `-` = removed requirements
   - `→` = renamed requirements

3. **Confirmation prompt**:
   ```
   ✔ Proceed with spec updates? Yes
   ```
   - Final confirmation before applying changes

4. **Archive location**:
   ```
   Change 'add-feature' archived as '2026-01-13-add-feature'
   ```
   - Change moved to `opence/changes/archive/YYYY-MM-DD-change-id/`

## Post-Archive Verification

After archiving, verify:

```bash
# 1. No active changes
opence list
# Should show: "No active changes found."

# 2. Specs updated
ls opence/specs/  # Check for new/updated spec directories
cat opence/specs/your-capability/spec.md  # Verify content

# 3. Change archived
ls opence/changes/archive/  # Find YYYY-MM-DD-change-id

# 4. Tests still pass
npm test  # Ensure specs reflect code reality
```

**Post-archive tasks**:
- Update spec Purpose fields (replace "TBD - created by archiving...")
- Run tests to verify specs match implementation
- Commit the changes to version control

## Troubleshooting

### Incomplete Tasks Warning

**Issue**: Archive warns about unchecked tasks
- **Cause**: tasks.md has `- [ ]` items
- **Fix**: Mark completed tasks [x] or remove legitimately skipped items
- **Proceed?**: Yes if tasks are actually done, No if work remains

### Validation Fails

**Issue**: `opence validate` fails before archive
- **Cause**: Spec deltas have format errors
- **Fix**: Run `opence validate <id> --strict` and fix issues
- **Tip**: Use `opence show <id> --json --deltas-only` to debug

### Multiple Active Changes

**Issue**: Multiple changes listed in `opence list`
- **Cause**: Working on multiple changes simultaneously
- **Fix**: Verify you're archiving the correct change-id
- **Tip**: Archive changes one at a time

### Spec Updates Fail

**Issue**: Archive fails during spec application
- **Cause**: Spec delta format errors or file system issues
- **Fix**: Check error message, fix delta format
- **Recovery**: Changes not moved yet, safe to retry

## See Also

- `opence-compound` - Previous workflow step
- `opence-plan` - How to create changes
- docs/solutions/ - Examples of archived changes
<!-- OPENCE:END -->
