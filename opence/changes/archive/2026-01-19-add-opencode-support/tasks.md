# Implementation Tasks

## 1. Research and Design

- [x] 1.1 Document OpenCode directory structure and conventions
- [x] 1.2 Document opencode.json/opencode.jsonc schema for commands
- [x] 1.3 Design tool detection logic (how to detect OpenCode vs Claude)
- [x] 1.4 Design multi-tool sync strategy for skills and commands
- [x] 1.5 Identify differences between OpenCode and Claude frontmatter/command formats

## 2. Core Infrastructure

- [x] 2.1 Add OpenCode path constants and utilities
- [x] 2.2 Implement tool detection for OpenCode (check for .opencode/ or opencode.json)
- [x] 2.3 Update tool configuration model to support OpenCode
- [x] 2.4 Add OpenCode-specific template generators for skills and commands

## 3. Init Command Integration

- [x] 3.1 Update `opence init` to detect OpenCode installation
- [x] 3.2 Add OpenCode option to tool selection prompts
- [x] 3.3 Create `.opencode/commands/opence/` directory structure during init
- [x] 3.4 Generate opence-native commands for OpenCode (plan, work, review, compound, archive)
- [x] 3.5 Create `.opencode/skills/` symlinks or copies for opence-native skills

## 4. Update Command Integration

- [x] 4.1 Update `opence update` to detect OpenCode directories
- [x] 4.2 Sync opence-native skills to `.opencode/skills/` (using Claude-compatible format)
- [x] 4.3 Sync opence-native commands to `.opencode/commands/opence/`
- [x] 4.4 Update AGENTS.md instruction blocks in both tools

## 5. Skill Management Commands

- [x] 5.1 Update `opence skill add` to create skills in `.opencode/skills/` when OpenCode is configured
- [x] 5.2 Update `opence skill list` to show OpenCode as a configured tool
- [x] 5.3 Update `opence skill show` to display OpenCode paths
- [x] 5.4 Update `opence skill update` to sync changes to OpenCode directories
- [x] 5.5 Update `opence skill remove` to remove from OpenCode directories

## 6. Global Directory Support (Future Enhancement)

- [ ] 6.1 Add detection for `~/.config/opencode/` directory
- [ ] 6.2 Support reading global OpenCode commands from `~/.config/opencode/commands/`
- [ ] 6.3 Support reading global OpenCode skills from `~/.config/opencode/skills/`
- [ ] 6.4 Document global directory precedence (project vs global)

## 7. Configuration File Support (Future Enhancement)

- [ ] 7.1 Add opencode.json/opencode.jsonc parser
- [ ] 7.2 Support reading command definitions from opencode.json
- [ ] 7.3 Merge commands from multiple sources (JSON + markdown files)
- [ ] 7.4 Document configuration file format in opence docs

## 8. Testing and Documentation

- [ ] 8.1 Write unit tests for OpenCode path resolution (Future Enhancement)
- [ ] 8.2 Write integration tests for init with OpenCode (Future Enhancement)
- [ ] 8.3 Write tests for skill management with OpenCode (Future Enhancement)
- [x] 8.4 Update README with OpenCode support information
- [ ] 8.5 Add OpenCode examples to documentation (Future Enhancement)
- [x] 8.6 Validate with `opence validate add-opencode-support --strict`

## 9. Migration and Compatibility

- [x] 9.1 Ensure existing Claude-only projects work unchanged
- [x] 9.2 Test dual-tool setup (both Claude and OpenCode in same project)
- [x] 9.3 Document migration path for existing users (via README)
- [ ] 9.4 Add troubleshooting guide for common OpenCode issues (Future Enhancement)
