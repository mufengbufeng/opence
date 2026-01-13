# Naming Conventions

## Rules

1. **Use kebab-case**: all lowercase with hyphens
2. **No reserved prefixes**: `opence-` is reserved for native skills
3. **Be descriptive**: Name should hint at skill's purpose
4. **Keep it short**: 2-4 words ideal
5. **Use unique names**: Check `opence skill list` first

## Validation Pattern

Skills are validated against this regex:

```
^[a-z0-9]+(-[a-z0-9]+)*$
```

## Good Examples

- `api-testing` - Clear purpose
- `error-recovery` - Specific domain
- `db-migration` - Concise and clear
- `deploy-prod` - Action-oriented
- `code-review` - Standard practice
- `perf-optimization` - Abbreviated but clear
- `security-audit` - Domain-specific
- `data-validation` - Clear scope
- `cache-strategy` - Technical focus
- `monitoring-setup` - Installation guide

## Bad Examples

| Name | Problem | Fix |
|------|---------|-----|
| `api testing` | Has spaces | `api-testing` |
| `api_testing` | Uses underscores | `api-testing` |
| `APITesting` | Not lowercase | `api-testing` |
| `opence-custom` | Reserved prefix | `custom-workflow` |
| `test` | Too generic | `integration-testing` |
| `my-project-specific-api-testing-guide` | Too long | `api-testing` |
| `skill1` | Not descriptive | `error-handling` |
| `temp` | Unclear purpose | `cache-warmup` |
| `fix-bug` | Too general | `null-pointer-fixes` |
| `123-test` | Starts with number (invalid) | `test-automation` |

## Reserved Names

The following prefixes are reserved:

- `opence-*` - Native skills (plan, work, review, compound, skill-creator)

Don't create skills with these names.

## Checking for Duplicates

Before creating a skill:

```bash
opence skill list
```

Ensure your name doesn't conflict with:
- Existing user skills
- Native opence skills
- Common vocabulary that might be confusing

## Naming by Domain

### API/Backend
- `api-testing`
- `api-versioning`
- `endpoint-security`

### Database
- `db-migration`
- `query-optimization`
- `schema-design`

### Frontend
- `component-testing`
- `ui-accessibility`
- `perf-profiling`

### DevOps
- `deploy-prod`
- `rollback-procedure`
- `ci-pipeline`

### General
- `error-recovery`
- `code-review`
- `security-audit`