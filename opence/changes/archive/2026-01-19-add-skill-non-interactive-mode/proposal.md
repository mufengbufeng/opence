# Change: Add Non-Interactive Mode for Skill Commands

## Why

AI assistants cannot handle interactive prompts when executing `opence skill add` commands. When the CLI prompts for user input (description, allowed-tools), the AI execution fails with "User force closed the prompt" error. This prevents AI assistants from creating skills autonomously, limiting their effectiveness in opence workflows.

## What Changes

- Add `--non-interactive` flag to all skill commands that require user input
- Ensure all required data can be provided via command-line flags
- Make `--allowed-tools` accept comma-separated values (e.g., `--allowed-tools "Read,Write,Bash"`)
- Provide sensible defaults when optional parameters are omitted in non-interactive mode
- Update error messages to suggest non-interactive flags when AI execution is detected
- Ensure existing `--description` and `--allowed-tools` flags work in non-interactive context

## Impact

- Affected specs: `cli-skill-commands`
- Affected code: CLI skill command handlers, prompt logic
- **BREAKING**: None - this is additive functionality
- Improves: AI assistant compatibility, automation support, CI/CD integration
