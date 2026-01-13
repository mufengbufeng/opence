import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import {
  SkillManager,
  validateSkillName,
  CreateSkillOptions,
} from '../../src/core/skill-manager.js';

describe('SkillManager', () => {
  let tempDir: string;
  let manager: SkillManager;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'skill-manager-test-'));
    manager = new SkillManager();
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  describe('validateSkillName', () => {
    it('should accept valid kebab-case names', () => {
      expect(validateSkillName('my-skill')).toEqual({ valid: true });
      expect(validateSkillName('api-testing')).toEqual({ valid: true });
      expect(validateSkillName('deploy-prod')).toEqual({ valid: true });
    });

    it('should reject names with spaces', () => {
      const result = validateSkillName('my skill');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('kebab-case');
    });

    it('should reject names with underscores', () => {
      const result = validateSkillName('my_skill');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('kebab-case');
    });

    it('should reject names starting with opence-', () => {
      const result = validateSkillName('opence-custom');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('reserved');
    });

    it('should reject empty names', () => {
      const result = validateSkillName('');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('empty');
    });
  });

  describe('discoverConfiguredTools', () => {
    it('should return empty array when no tools configured', async () => {
      const tools = await manager.discoverConfiguredTools(tempDir);
      expect(tools).toEqual([]);
    });

    it('should detect Claude when opence-plan exists with markers', async () => {
      const skillDir = path.join(tempDir, '.claude/skills/opence-plan');
      await fs.mkdir(skillDir, { recursive: true });
      await fs.writeFile(
        path.join(skillDir, 'SKILL.md'),
        '<!-- OPENCE:START -->\nContent\n<!-- OPENCE:END -->'
      );

      const tools = await manager.discoverConfiguredTools(tempDir);
      expect(tools).toContain('claude');
    });

    it('should detect Codex when opence-plan exists with markers', async () => {
      const skillDir = path.join(tempDir, '.codex/skills/opence-plan');
      await fs.mkdir(skillDir, { recursive: true });
      await fs.writeFile(
        path.join(skillDir, 'SKILL.md'),
        '<!-- OPENCE:START -->\nContent\n<!-- OPENCE:END -->'
      );

      const tools = await manager.discoverConfiguredTools(tempDir);
      expect(tools).toContain('codex');
    });

    it('should detect multiple tools', async () => {
      // Create Claude skill
      const claudeDir = path.join(tempDir, '.claude/skills/opence-plan');
      await fs.mkdir(claudeDir, { recursive: true });
      await fs.writeFile(
        path.join(claudeDir, 'SKILL.md'),
        '<!-- OPENCE:START -->\nContent\n<!-- OPENCE:END -->'
      );

      // Create Codex skill
      const codexDir = path.join(tempDir, '.codex/skills/opence-work');
      await fs.mkdir(codexDir, { recursive: true });
      await fs.writeFile(
        path.join(codexDir, 'SKILL.md'),
        '<!-- OPENCE:START -->\nContent\n<!-- OPENCE:END -->'
      );

      const tools = await manager.discoverConfiguredTools(tempDir);
      expect(tools).toContain('claude');
      expect(tools).toContain('codex');
    });
  });

  describe('createSkill', () => {
    beforeEach(async () => {
      // Setup a project with Claude configured
      const skillDir = path.join(tempDir, '.claude/skills/opence-plan');
      await fs.mkdir(skillDir, { recursive: true });
      await fs.writeFile(
        path.join(skillDir, 'SKILL.md'),
        '<!-- OPENCE:START -->\nContent\n<!-- OPENCE:END -->'
      );
    });

    it('should create a skill in Claude directory', async () => {
      const options: CreateSkillOptions = {
        description: 'Test skill',
        allowedTools: ['Read', 'Write'],
      };

      await manager.createSkill(tempDir, 'test-skill', options);

      const skillPath = path.join(tempDir, '.claude/skills/test-skill/SKILL.md');
      expect(await fs.access(skillPath).then(() => true).catch(() => false)).toBe(true);
    });

    it('should create references and scripts directories', async () => {
      const options: CreateSkillOptions = {
        description: 'Test skill',
      };

      await manager.createSkill(tempDir, 'test-skill', options);

      const referencesPath = path.join(tempDir, '.claude/skills/test-skill/references');
      const scriptsPath = path.join(tempDir, '.claude/skills/test-skill/scripts');

      expect(await fs.access(referencesPath).then(() => true).catch(() => false)).toBe(true);
      expect(await fs.access(scriptsPath).then(() => true).catch(() => false)).toBe(true);
    });

    it('should generate proper frontmatter for Claude', async () => {
      const options: CreateSkillOptions = {
        description: 'Test skill',
        allowedTools: ['Read', 'Write'],
      };

      await manager.createSkill(tempDir, 'test-skill', options);

      const skillPath = path.join(tempDir, '.claude/skills/test-skill/SKILL.md');
      const content = await fs.readFile(skillPath, 'utf-8');

      expect(content).toContain('name: test-skill');
      expect(content).toContain('description: Test skill');
      expect(content).toContain('allowed-tools:');
      expect(content).toContain('user-invocable: true');
    });

    it('should reject invalid skill names', async () => {
      const options: CreateSkillOptions = {
        description: 'Test skill',
      };

      await expect(
        manager.createSkill(tempDir, 'invalid name', options)
      ).rejects.toThrow('kebab-case');
    });

    it('should reject reserved skill names', async () => {
      const options: CreateSkillOptions = {
        description: 'Test skill',
      };

      await expect(
        manager.createSkill(tempDir, 'opence-custom', options)
      ).rejects.toThrow('reserved');
    });

    it('should reject duplicate skill names', async () => {
      const options: CreateSkillOptions = {
        description: 'Test skill',
      };

      await manager.createSkill(tempDir, 'test-skill', options);

      await expect(
        manager.createSkill(tempDir, 'test-skill', options)
      ).rejects.toThrow('already exists');
    });

    it('should throw error when no tools configured', async () => {
      const emptyDir = await fs.mkdtemp(path.join(os.tmpdir(), 'empty-'));
      
      try {
        const options: CreateSkillOptions = {
          description: 'Test skill',
        };

        await expect(
          manager.createSkill(emptyDir, 'test-skill', options)
        ).rejects.toThrow('No AI tools configured');
      } finally {
        await fs.rm(emptyDir, { recursive: true, force: true });
      }
    });
  });

  describe('listSkills', () => {
    beforeEach(async () => {
      // Setup native skills
      const claudeDir = path.join(tempDir, '.claude/skills/opence-plan');
      await fs.mkdir(claudeDir, { recursive: true });
      await fs.writeFile(
        path.join(claudeDir, 'SKILL.md'),
        '---\nname: opence-plan\ndescription: Plan opence changes\n---\n<!-- OPENCE:START -->\n<!-- OPENCE:END -->'
      );
    });

    it('should list native skills', async () => {
      const skills = await manager.listSkills(tempDir);
      
      expect(skills.length).toBeGreaterThan(0);
      const plan = skills.find(s => s.name === 'opence-plan');
      expect(plan).toBeDefined();
      expect(plan?.isNative).toBe(true);
    });

    it('should list user skills', async () => {
      // Create a user skill
      const options: CreateSkillOptions = {
        description: 'User skill',
      };
      await manager.createSkill(tempDir, 'user-skill', options);

      const skills = await manager.listSkills(tempDir);
      
      const userSkill = skills.find(s => s.name === 'user-skill');
      expect(userSkill).toBeDefined();
      expect(userSkill?.isNative).toBe(false);
    });

    it('should sort native skills before user skills', async () => {
      // Create a user skill
      const options: CreateSkillOptions = {
        description: 'User skill',
      };
      await manager.createSkill(tempDir, 'aaa-skill', options);

      const skills = await manager.listSkills(tempDir);
      
      const firstNativeIndex = skills.findIndex(s => s.isNative);
      const firstUserIndex = skills.findIndex(s => !s.isNative);

      expect(firstNativeIndex).toBeLessThan(firstUserIndex);
    });
  });

  describe('getSkillInfo', () => {
    beforeEach(async () => {
      const skillDir = path.join(tempDir, '.claude/skills/opence-plan');
      await fs.mkdir(skillDir, { recursive: true });
      await fs.writeFile(
        path.join(skillDir, 'SKILL.md'),
        '<!-- OPENCE:START -->\nContent\n<!-- OPENCE:END -->'
      );
    });

    it('should return skill info for existing skill', async () => {
      const options: CreateSkillOptions = {
        description: 'Test skill',
      };
      await manager.createSkill(tempDir, 'test-skill', options);

      const info = await manager.getSkillInfo(tempDir, 'test-skill');
      
      expect(info).toBeDefined();
      expect(info?.name).toBe('test-skill');
      expect(info?.description).toBe('Test skill');
      expect(info?.isNative).toBe(false);
    });

    it('should return null for non-existent skill', async () => {
      const info = await manager.getSkillInfo(tempDir, 'missing-skill');
      expect(info).toBeNull();
    });

    it('should include paths for all tools', async () => {
      // Setup both Claude and Codex
      const codexDir = path.join(tempDir, '.codex/skills/opence-work');
      await fs.mkdir(codexDir, { recursive: true });
      await fs.writeFile(
        path.join(codexDir, 'SKILL.md'),
        '<!-- OPENCE:START -->\nContent\n<!-- OPENCE:END -->'
      );

      const options: CreateSkillOptions = {
        description: 'Test skill',
      };
      await manager.createSkill(tempDir, 'test-skill', options);

      const info = await manager.getSkillInfo(tempDir, 'test-skill');
      
      expect(info?.tools).toContain('claude');
      expect(info?.tools).toContain('codex');
      expect(info?.paths['claude']).toBeDefined();
      expect(info?.paths['codex']).toBeDefined();
    });
  });

  describe('removeSkill', () => {
    beforeEach(async () => {
      const skillDir = path.join(tempDir, '.claude/skills/opence-plan');
      await fs.mkdir(skillDir, { recursive: true });
      await fs.writeFile(
        path.join(skillDir, 'SKILL.md'),
        '<!-- OPENCE:START -->\nContent\n<!-- OPENCE:END -->'
      );
    });

    it('should remove user skill', async () => {
      const options: CreateSkillOptions = {
        description: 'Test skill',
      };
      await manager.createSkill(tempDir, 'test-skill', options);

      await manager.removeSkill(tempDir, 'test-skill');

      const skillPath = path.join(tempDir, '.claude/skills/test-skill');
      expect(await fs.access(skillPath).then(() => true).catch(() => false)).toBe(false);
    });

    it('should throw error for non-existent skill', async () => {
      await expect(
        manager.removeSkill(tempDir, 'missing-skill')
      ).rejects.toThrow('not found');
    });

    it('should throw error for native skills', async () => {
      await expect(
        manager.removeSkill(tempDir, 'opence-plan')
      ).rejects.toThrow('Cannot remove opence-native');
    });
  });

  describe('updateSkill', () => {
    beforeEach(async () => {
      const skillDir = path.join(tempDir, '.claude/skills/opence-plan');
      await fs.mkdir(skillDir, { recursive: true });
      await fs.writeFile(
        path.join(skillDir, 'SKILL.md'),
        '<!-- OPENCE:START -->\nContent\n<!-- OPENCE:END -->'
      );

      const options: CreateSkillOptions = {
        description: 'Original description',
        allowedTools: ['Read'],
      };
      await manager.createSkill(tempDir, 'test-skill', options);
    });

    it('should update skill description', async () => {
      await manager.updateSkill(tempDir, 'test-skill', {
        description: 'Updated description',
      });

      const info = await manager.getSkillInfo(tempDir, 'test-skill');
      expect(info?.description).toBe('Updated description');
    });

    it('should update allowed tools', async () => {
      await manager.updateSkill(tempDir, 'test-skill', {
        allowedTools: ['Read', 'Write', 'Bash'],
      });

      const info = await manager.getSkillInfo(tempDir, 'test-skill');
      expect(info?.metadata?.allowedTools).toEqual(['Read', 'Write', 'Bash']);
    });

    it('should throw error for non-existent skill', async () => {
      await expect(
        manager.updateSkill(tempDir, 'missing-skill', { description: 'New' })
      ).rejects.toThrow('not found');
    });

    it('should throw error for native skills', async () => {
      await expect(
        manager.updateSkill(tempDir, 'opence-plan', { description: 'New' })
      ).rejects.toThrow('opence-native skills');
    });
  });
});
