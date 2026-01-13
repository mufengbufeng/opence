import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { UpdateCommand } from '../../src/core/update.js';
import path from 'path';
import fs from 'fs/promises';
import os from 'os';
import { randomUUID } from 'crypto';

describe('UpdateCommand', () => {
  let testDir: string;
  let updateCommand: UpdateCommand;
  let prevCodexHome: string | undefined;

  beforeEach(async () => {
    testDir = path.join(os.tmpdir(), `opence-test-${randomUUID()}`);
    await fs.mkdir(testDir, { recursive: true });

    const openceDir = path.join(testDir, 'opence');
    await fs.mkdir(openceDir, { recursive: true });

    updateCommand = new UpdateCommand();

    prevCodexHome = process.env.CODEX_HOME;
    process.env.CODEX_HOME = path.join(testDir, '.codex');
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
    if (prevCodexHome === undefined) delete process.env.CODEX_HOME;
    else process.env.CODEX_HOME = prevCodexHome;
  });

  it('should throw when opence directory is missing', async () => {
    await fs.rm(path.join(testDir, 'opence'), { recursive: true, force: true });
    await expect(updateCommand.execute(testDir)).rejects.toThrow(
      /No opence directory found/
    );
  });

  it('should update only existing CLAUDE.md file', async () => {
    const claudePath = path.join(testDir, 'CLAUDE.md');
    const initialContent = `# Project Instructions

Some existing content here.

<!-- OPENCE:START -->
Old opence content
<!-- OPENCE:END -->

More content after.`;
    await fs.writeFile(claudePath, initialContent);

    const consoleSpy = vi.spyOn(console, 'log');

    await updateCommand.execute(testDir);

    const updatedContent = await fs.readFile(claudePath, 'utf-8');
    expect(updatedContent).toContain('<!-- OPENCE:START -->');
    expect(updatedContent).toContain('<!-- OPENCE:END -->');
    expect(updatedContent).toContain('@/opence/AGENTS.md');
    expect(updatedContent).toContain('opence update');
    expect(updatedContent).toContain('Some existing content here');
    expect(updatedContent).toContain('More content after');

    const [logMessage] = consoleSpy.mock.calls[0];
    expect(logMessage).toContain('Updated opence instructions (opence/AGENTS.md');
    expect(logMessage).toContain('AGENTS.md (created)');
    expect(logMessage).toContain('Updated AI tool files: CLAUDE.md');
    consoleSpy.mockRestore();
  });

  it('should refresh existing Claude slash command files', async () => {
    const planPath = path.join(
      testDir,
      '.claude/commands/opence/plan.md'
    );
    await fs.mkdir(path.dirname(planPath), { recursive: true });
    const initialContent = `---
name: opence: plan
description: Old description
category: opence
tags: [opence, plan]
---
<!-- OPENCE:START -->
Old slash content
<!-- OPENCE:END -->`;
    await fs.writeFile(planPath, initialContent);

    const consoleSpy = vi.spyOn(console, 'log');

    await updateCommand.execute(testDir);

    const updated = await fs.readFile(planPath, 'utf-8');
    expect(updated).toContain('name: opence: plan');
    expect(updated).toContain('Review `opence/project.md`');
    expect(updated).not.toContain('Old slash content');

    const [logMessage] = consoleSpy.mock.calls[0];
    expect(logMessage).toContain(
      'Updated slash commands: .claude/commands/opence/plan.md'
    );
    consoleSpy.mockRestore();
  });

  it('should refresh existing GitHub Copilot prompt files', async () => {
    const planPath = path.join(
      testDir,
      '.github/prompts/opence-plan.prompt.md'
    );
    await fs.mkdir(path.dirname(planPath), { recursive: true });
    const initialContent = `---
description: Old description
---

$ARGUMENTS
<!-- OPENCE:START -->
Old body
<!-- OPENCE:END -->`;
    await fs.writeFile(planPath, initialContent);

    const consoleSpy = vi.spyOn(console, 'log');

    await updateCommand.execute(testDir);

    const updated = await fs.readFile(planPath, 'utf-8');
    expect(updated).toContain('description: Old description');
    expect(updated).toContain('$ARGUMENTS');
    expect(updated).toContain('<!-- OPENCE:START -->');
    expect(updated).toContain('Review `opence/project.md`');
    expect(updated).not.toContain('Old body');

    const [logMessage] = consoleSpy.mock.calls[0];
    expect(logMessage).toContain(
      'Updated slash commands: .github/prompts/opence-plan.prompt.md'
    );
    consoleSpy.mockRestore();
  });

  it('should refresh existing Codex prompt files', async () => {
    const codexHome = process.env.CODEX_HOME ?? path.join(testDir, '.codex');
    const planPath = path.join(codexHome, 'prompts', 'opence-plan.md');
    await fs.mkdir(path.dirname(planPath), { recursive: true });
    const initialContent = `---
description: Old description
argument-hint: old-hint
---

$ARGUMENTS
<!-- OPENCE:START -->
Old body
<!-- OPENCE:END -->`;
    await fs.writeFile(planPath, initialContent);

    const consoleSpy = vi.spyOn(console, 'log');

    await updateCommand.execute(testDir);

    const updated = await fs.readFile(planPath, 'utf-8');
    expect(updated).toContain('description: Create an opence plan');
    expect(updated).toContain('argument-hint: request or feature description');
    expect(updated).toContain('<!-- OPENCE:START -->');
    expect(updated).toContain('Review `opence/project.md`');
    expect(updated).not.toContain('Old body');

    const [logMessage] = consoleSpy.mock.calls[0];
    expect(logMessage).toContain(
      'Updated slash commands: .codex/prompts/opence-plan.md'
    );
    consoleSpy.mockRestore();
  });

  it('should refresh existing opence skills', async () => {
    const claudeSkill = path.join(testDir, '.claude/skills/opence-plan/SKILL.md');
    await fs.mkdir(path.dirname(claudeSkill), { recursive: true });
    await fs.writeFile(
      claudeSkill,
      `---
name: old-plan
description: old
---
<!-- OPENCE:START -->
Old content
<!-- OPENCE:END -->`
    );

    const codexSkill = path.join(testDir, '.codex/skills/opence-plan/SKILL.md');
    await fs.mkdir(path.dirname(codexSkill), { recursive: true });
    await fs.writeFile(
      codexSkill,
      `---
name: old-plan
metadata:
  short-description: old
---
<!-- OPENCE:START -->
Old content
<!-- OPENCE:END -->`
    );

    const consoleSpy = vi.spyOn(console, 'log');

    await updateCommand.execute(testDir);

    const claudeUpdated = await fs.readFile(claudeSkill, 'utf-8');
    expect(claudeUpdated).toContain('allowed-tools:');
    expect(claudeUpdated).toContain('user-invocable: true');
    expect(claudeUpdated).toContain('<!-- OPENCE:START -->');

    const codexUpdated = await fs.readFile(codexSkill, 'utf-8');
    expect(codexUpdated).toContain('metadata:');
    expect(codexUpdated).toContain('short-description:');
    expect(codexUpdated).toContain('<!-- OPENCE:START -->');

    const [logMessage] = consoleSpy.mock.calls[0];
    expect(logMessage).toContain('Updated skills:');
    expect(logMessage).toContain('.claude/skills/opence-plan/SKILL.md');
    expect(logMessage).toContain('.codex/skills/opence-plan/SKILL.md');
    consoleSpy.mockRestore();
  });
});
