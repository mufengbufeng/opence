import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { InitCommand } from '../../src/core/init.js';

const DONE = '__done__';

type SelectionQueue = string[][];

let selectionQueue: SelectionQueue = [];

const mockPrompt = vi.fn(async () => {
  if (selectionQueue.length === 0) {
    throw new Error('No queued selections provided to init prompt.');
  }
  return selectionQueue.shift() ?? [];
});

function queueSelections(...values: string[]) {
  let current: string[] = [];
  values.forEach((value) => {
    if (value === DONE) {
      selectionQueue.push(current);
      current = [];
    } else {
      current.push(value);
    }
  });

  if (current.length > 0) {
    selectionQueue.push(current);
  }
}

describe('InitCommand', () => {
  let testDir: string;
  let initCommand: InitCommand;
  let prevCodexHome: string | undefined;

  beforeEach(async () => {
    testDir = path.join(os.tmpdir(), `opence-init-test-${Date.now()}`);
    await fs.mkdir(testDir, { recursive: true });
    selectionQueue = [];
    mockPrompt.mockReset();
    initCommand = new InitCommand({ prompt: mockPrompt });

    prevCodexHome = process.env.CODEX_HOME;
    process.env.CODEX_HOME = path.join(testDir, '.codex');

    vi.spyOn(console, 'log').mockImplementation(() => { });
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
    vi.restoreAllMocks();
    if (prevCodexHome === undefined) delete process.env.CODEX_HOME;
    else process.env.CODEX_HOME = prevCodexHome;
  });

  describe('execute', () => {
    it('should create opence directory structure and templates', async () => {
      queueSelections('claude', DONE);

      await initCommand.execute(testDir);

      const opencePath = path.join(testDir, 'opence');
      expect(await directoryExists(opencePath)).toBe(true);
      expect(await directoryExists(path.join(opencePath, 'specs'))).toBe(true);
      expect(await directoryExists(path.join(opencePath, 'changes'))).toBe(true);
      expect(await directoryExists(path.join(opencePath, 'changes', 'archive'))).toBe(true);

      expect(await fileExists(path.join(opencePath, 'AGENTS.md'))).toBe(true);
      expect(await fileExists(path.join(opencePath, 'project.md'))).toBe(true);
    });

    it('should always create AGENTS.md in project root', async () => {
      queueSelections(DONE);

      await initCommand.execute(testDir);

      const rootAgentsPath = path.join(testDir, 'AGENTS.md');
      expect(await fileExists(rootAgentsPath)).toBe(true);

      const content = await fs.readFile(rootAgentsPath, 'utf-8');
      expect(content).toContain('<!-- OPENCE:START -->');
      expect(content).toContain('@/opence/AGENTS.md');
      expect(content).toContain('opence update');
      expect(content).toContain('<!-- OPENCE:END -->');

      const claudeExists = await fileExists(path.join(testDir, 'CLAUDE.md'));
      expect(claudeExists).toBe(false);
    });

    it('should create CLAUDE.md and Claude slash commands', async () => {
      queueSelections('claude', DONE);

      await initCommand.execute(testDir);

      const claudePath = path.join(testDir, 'CLAUDE.md');
      expect(await fileExists(claudePath)).toBe(true);

      const content = await fs.readFile(claudePath, 'utf-8');
      expect(content).toContain('<!-- OPENCE:START -->');
      expect(content).toContain('@/opence/AGENTS.md');
      expect(content).toContain('opence update');
      expect(content).toContain('<!-- OPENCE:END -->');

      const planPath = path.join(testDir, '.claude/commands/opence/plan.md');
      const workPath = path.join(testDir, '.claude/commands/opence/work.md');
      const reviewPath = path.join(testDir, '.claude/commands/opence/review.md');
      const compoundPath = path.join(testDir, '.claude/commands/opence/compound.md');

      expect(await fileExists(planPath)).toBe(true);
      expect(await fileExists(workPath)).toBe(true);
      expect(await fileExists(reviewPath)).toBe(true);
      expect(await fileExists(compoundPath)).toBe(true);

      const planContent = await fs.readFile(planPath, 'utf-8');
      expect(planContent).toContain('name: opence: plan');
      expect(planContent).toContain('<!-- OPENCE:START -->');
      expect(planContent).toContain('Review `opence/project.md`');

      const skillPath = path.join(testDir, '.claude/skills/opence-plan/SKILL.md');
      expect(await fileExists(skillPath)).toBe(true);
      const skillContent = await fs.readFile(skillPath, 'utf-8');
      expect(skillContent).toContain('allowed-tools:');
      expect(skillContent).toContain('user-invocable: true');
      expect(skillContent).toContain('<!-- OPENCE:START -->');
    });

    it('should create GitHub Copilot prompts and Claude skills', async () => {
      queueSelections('github-copilot', DONE);

      await initCommand.execute(testDir);

      const planPath = path.join(testDir, '.github/prompts/opence-plan.prompt.md');
      const workPath = path.join(testDir, '.github/prompts/opence-work.prompt.md');
      const reviewPath = path.join(testDir, '.github/prompts/opence-review.prompt.md');
      const compoundPath = path.join(testDir, '.github/prompts/opence-compound.prompt.md');

      expect(await fileExists(planPath)).toBe(true);
      expect(await fileExists(workPath)).toBe(true);
      expect(await fileExists(reviewPath)).toBe(true);
      expect(await fileExists(compoundPath)).toBe(true);

      const planContent = await fs.readFile(planPath, 'utf-8');
      expect(planContent).toContain('description: Create an opence plan');
      expect(planContent).toContain('$ARGUMENTS');
      expect(planContent).toContain('<!-- OPENCE:START -->');

      const skillPath = path.join(testDir, '.claude/skills/opence-plan/SKILL.md');
      expect(await fileExists(skillPath)).toBe(true);
    });

    it('should create Codex prompts and Codex skills', async () => {
      queueSelections('codex', DONE);

      await initCommand.execute(testDir);

      const codexHome = process.env.CODEX_HOME ?? path.join(testDir, '.codex');
      const planPath = path.join(codexHome, 'prompts', 'opence-plan.md');
      const workPath = path.join(codexHome, 'prompts', 'opence-work.md');
      const reviewPath = path.join(codexHome, 'prompts', 'opence-review.md');
      const compoundPath = path.join(codexHome, 'prompts', 'opence-compound.md');

      expect(await fileExists(planPath)).toBe(true);
      expect(await fileExists(workPath)).toBe(true);
      expect(await fileExists(reviewPath)).toBe(true);
      expect(await fileExists(compoundPath)).toBe(true);

      const planContent = await fs.readFile(planPath, 'utf-8');
      expect(planContent).toContain('description: Create an opence plan');
      expect(planContent).toContain('argument-hint: request or feature description');
      expect(planContent).toContain('<!-- OPENCE:START -->');

      const skillPath = path.join(testDir, '.codex/skills/opence-plan/SKILL.md');
      expect(await fileExists(skillPath)).toBe(true);
      const skillContent = await fs.readFile(skillPath, 'utf-8');
      expect(skillContent).toContain('metadata:');
      expect(skillContent).toContain('short-description:');
      expect(skillContent).toContain('<!-- OPENCE:START -->');
    });

    it('should update existing CLAUDE.md with markers', async () => {
      queueSelections('claude', DONE);

      const claudePath = path.join(testDir, 'CLAUDE.md');
      const existingContent = '# My Project Instructions\nCustom instructions here';
      await fs.writeFile(claudePath, existingContent);

      await initCommand.execute(testDir);

      const updatedContent = await fs.readFile(claudePath, 'utf-8');
      expect(updatedContent).toContain('<!-- OPENCE:START -->');
      expect(updatedContent).toContain('@/opence/AGENTS.md');
      expect(updatedContent).toContain('opence update');
      expect(updatedContent).toContain('<!-- OPENCE:END -->');
      expect(updatedContent).toContain('Custom instructions here');
    });
  });

  describe('tool selection handling', () => {
    it('should mark configured tools in extend mode', async () => {
      queueSelections('claude', DONE);
      await initCommand.execute(testDir);

      queueSelections('claude', DONE);
      await initCommand.execute(testDir);

      const secondCallArgs = mockPrompt.mock.calls[1][0];
      const claudeChoice = secondCallArgs.choices.find(
        (choice: any) => choice.value === 'claude'
      );

      expect(claudeChoice.configured).toBe(true);
    });

    it('should accept --tools list without prompting', async () => {
      mockPrompt.mockClear();
      const nonInteractive = new InitCommand({ tools: 'claude,codex', prompt: mockPrompt });
      await nonInteractive.execute(testDir);

      expect(mockPrompt).not.toHaveBeenCalled();
      expect(await fileExists(path.join(testDir, 'CLAUDE.md'))).toBe(true);
      expect(
        await fileExists(path.join(testDir, '.codex/skills/opence-plan/SKILL.md'))
      ).toBe(true);
    });

    it('should reject invalid tool names', async () => {
      const nonInteractive = new InitCommand({ tools: 'claude,unknown-tool' });
      await expect(nonInteractive.execute(testDir)).rejects.toThrow(
        /Invalid tool/
      );
    });
  });
});

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function directoryExists(dirPath: string): Promise<boolean> {
  try {
    const stats = await fs.stat(dirPath);
    return stats.isDirectory();
  } catch {
    return false;
  }
}
