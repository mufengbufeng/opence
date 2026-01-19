## 1. Core Implementation

- [x] 1.1 Add `--non-interactive` flag to skill add command definition
- [x] 1.2 Add `--non-interactive` flag to skill update command definition
- [x] 1.3 Implement non-interactive mode detection logic (checks for flags or environment)
- [x] 1.4 Implement allowed-tools validation with known tool list
- [x] 1.5 Add case-insensitive tool name normalization
- [x] 1.6 Add whitespace trimming for comma-separated tool values
- [x] 1.7 Define default allowed-tools set: "Read,Write,Edit,Grep,Glob,Bash"
- [x] 1.8 Update skill add handler to skip prompts when in non-interactive mode
- [x] 1.9 Update skill update handler to skip prompts when in non-interactive mode

## 2. Flag Handling

- [x] 2.1 Ensure `--description` flag works in non-interactive mode
- [x] 2.2 Ensure `--allowed-tools` accepts comma-separated values
- [x] 2.3 Auto-detect non-interactive mode when flags are provided
- [x] 2.4 Validate required parameters in non-interactive mode
- [x] 2.5 Apply defaults for optional parameters in non-interactive mode

## 3. Error Handling

- [x] 3.1 Add error for missing description in non-interactive mode
- [x] 3.2 Add error for invalid tool names with list of valid tools
- [x] 3.3 Add error for no update parameters in skill update non-interactive mode
- [x] 3.4 Detect prompt cancellation and suggest non-interactive flags
- [x] 3.5 Include example command in all non-interactive error messages

## 4. Environment Detection

- [x] 4.1 Check CI environment variable (CI=true)
- [x] 4.2 Check if stdin is a TTY
- [x] 4.3 Prefer non-interactive mode in CI/non-TTY environments
- [x] 4.4 Display helpful errors when interactive input needed in non-interactive context

## 5. Documentation and Help

- [x] 5.1 Update `opence skill add --help` to document non-interactive flags
- [x] 5.2 Update `opence skill update --help` to document non-interactive flags
- [x] 5.3 Add examples showing non-interactive usage
- [x] 5.4 Document valid tool names in help text
- [x] 5.5 Document default tool set behavior

## 6. Testing

- [x] 6.1 Test skill add with --non-interactive and all flags
- [x] 6.2 Test skill add with flags but without --non-interactive (auto-detect)
- [x] 6.3 Test skill add non-interactive with missing description
- [x] 6.4 Test skill add with invalid tool names
- [x] 6.5 Test skill add with default tools (no --allowed-tools)
- [x] 6.6 Test skill update non-interactive mode
- [x] 6.7 Test skill update auto-detect from flags
- [x] 6.8 Test skill update with no change parameters
- [x] 6.9 Test case-insensitive tool name handling
- [x] 6.10 Test whitespace trimming in tool names
- [x] 6.11 Test environment-based detection (CI=true)
- [x] 6.12 Test stdin TTY detection
- [x] 6.13 Test prompt cancellation error handling
