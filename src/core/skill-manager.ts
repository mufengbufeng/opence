import path from 'path';
import { promises as fs } from 'fs';
import * as yaml from 'yaml';
import { FileSystemUtils } from '../utils/file-system.js';
import { OPENCE_SKILL_IDS, OpenceSkillId } from './templates/opence-skill-templates.js';
import { generateUserSkillTemplate } from './templates/skill-templates.js';
import { OPENCE_MARKERS } from './config.js';

export interface SkillInfo {
  name: string;
  description: string;
  isNative: boolean;
  tools: string[];
  paths: Record<string, string>;
  metadata?: SkillMetadata;
}

export interface SkillMetadata {
  allowedTools?: string[];
  userInvocable?: boolean;
  shortDescription?: string;
  context?: string;
}

export interface CreateSkillOptions {
  description: string;
  allowedTools?: string[];
  shortDescription?: string;
}

export interface UpdateSkillOptions {
  description?: string;
  allowedTools?: string[];
  shortDescription?: string;
}

export interface RemoveSkillOptions {
  skipConfirmation?: boolean;
}

const SKILL_DIRECTORIES: Record<string, string> = {
  claude: '.claude/skills',
  codex: '.codex/skills',
  'github-copilot': '.claude/skills', // GitHub Copilot shares with Claude
};

/**
 * Validates a skill name according to conventions
 */
export function validateSkillName(name: string): { valid: boolean; error?: string } {
  if (!name || name.length === 0) {
    return { valid: false, error: 'Skill name cannot be empty' };
  }

  // Check for kebab-case format
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/i.test(name)) {
    return {
      valid: false,
      error: 'Skill name must be kebab-case (letters, numbers, hyphens only)',
    };
  }

  // Check for reserved prefix
  if (name.startsWith('opence-')) {
    return {
      valid: false,
      error: "Skill names starting with 'opence-' are reserved for native skills",
    };
  }

  return { valid: true };
}

/**
 * Parse frontmatter from skill content
 */
function parseFrontmatter(content: string): { frontmatter: Record<string, unknown>; body: string } {
  const lines = content.split('\n');
  
  if (lines[0] !== '---') {
    return { frontmatter: {}, body: content };
  }

  const endIndex = lines.findIndex((line, idx) => idx > 0 && line === '---');
  
  if (endIndex === -1) {
    return { frontmatter: {}, body: content };
  }

  const frontmatterText = lines.slice(1, endIndex).join('\n');
  const body = lines.slice(endIndex + 1).join('\n');

  try {
    const frontmatter = yaml.parse(frontmatterText) || {};
    return { frontmatter, body };
  } catch {
    return { frontmatter: {}, body: content };
  }
}

/**
 * Extract metadata from frontmatter
 */
function extractMetadata(frontmatter: Record<string, unknown>): SkillMetadata {
  const metadata: SkillMetadata = {};

  if (Array.isArray(frontmatter['allowed-tools'])) {
    metadata.allowedTools = frontmatter['allowed-tools'] as string[];
  }

  if (typeof frontmatter['user-invocable'] === 'boolean') {
    metadata.userInvocable = frontmatter['user-invocable'];
  }

  if (typeof frontmatter.context === 'string') {
    metadata.context = frontmatter.context;
  }

  // Codex-specific metadata
  if (typeof frontmatter.metadata === 'object' && frontmatter.metadata !== null) {
    const codexMeta = frontmatter.metadata as Record<string, unknown>;
    if (typeof codexMeta['short-description'] === 'string') {
      metadata.shortDescription = codexMeta['short-description'];
    }
  }

  return metadata;
}

/**
 * Manager class for skill operations
 */
export class SkillManager {
  /**
   * Discover which AI tools are configured in the project
   */
  async discoverConfiguredTools(projectPath: string): Promise<string[]> {
    const tools: string[] = [];

    // Check for Claude/GitHub Copilot (they share the same directory)
    const claudeDir = path.join(projectPath, '.claude/skills');
    if (await this.hasOpenceSkills(claudeDir)) {
      tools.push('claude');
    }

    // Check for Codex
    const codexDir = path.join(projectPath, '.codex/skills');
    if (await this.hasOpenceSkills(codexDir)) {
      tools.push('codex');
    }

    return tools;
  }

  /**
   * Check if a directory has opence-native skills with markers
   */
  private async hasOpenceSkills(skillsDir: string): Promise<boolean> {
    if (!(await FileSystemUtils.directoryExists(skillsDir))) {
      return false;
    }

    // Check for at least one opence-native skill with markers
    for (const skillId of OPENCE_SKILL_IDS) {
      const skillPath = path.join(skillsDir, `opence-${skillId}`, 'SKILL.md');
      if (await FileSystemUtils.fileExists(skillPath)) {
        try {
          const content = await FileSystemUtils.readFile(skillPath);
          if (
            content.includes(OPENCE_MARKERS.start) &&
            content.includes(OPENCE_MARKERS.end)
          ) {
            return true;
          }
        } catch {
          // Continue checking other skills
        }
      }
    }

    return false;
  }

  /**
   * List all skills in the project
   */
  async listSkills(projectPath: string): Promise<SkillInfo[]> {
    const tools = await this.discoverConfiguredTools(projectPath);
    const skillMap = new Map<string, SkillInfo>();

    for (const tool of tools) {
      const skillsDir = path.join(projectPath, SKILL_DIRECTORIES[tool]);
      
      if (!(await FileSystemUtils.directoryExists(skillsDir))) {
        continue;
      }

      const entries = await fs.readdir(skillsDir, { withFileTypes: true });
      
      for (const entry of entries) {
        if (!entry.isDirectory()) continue;

        const skillName = entry.name;
        const skillPath = path.join(skillsDir, skillName, 'SKILL.md');

        if (await FileSystemUtils.fileExists(skillPath)) {
          if (!skillMap.has(skillName)) {
            const info = await this.getSkillInfo(projectPath, skillName);
            if (info) {
              skillMap.set(skillName, info);
            }
          } else {
            // Add tool to existing skill info
            const info = skillMap.get(skillName)!;
            if (!info.tools.includes(tool)) {
              info.tools.push(tool);
              info.paths[tool] = skillPath;
            }
          }
        }
      }
    }

    return Array.from(skillMap.values()).sort((a, b) => {
      // Sort: native skills first, then alphabetically
      if (a.isNative && !b.isNative) return -1;
      if (!a.isNative && b.isNative) return 1;
      return a.name.localeCompare(b.name);
    });
  }

  /**
   * Get detailed information about a specific skill
   */
  async getSkillInfo(projectPath: string, skillName: string): Promise<SkillInfo | null> {
    const tools = await this.discoverConfiguredTools(projectPath);
    const paths: Record<string, string> = {};
    let description = '';
    let metadata: SkillMetadata = {};

    for (const tool of tools) {
      const skillPath = path.join(
        projectPath,
        SKILL_DIRECTORIES[tool],
        skillName,
        'SKILL.md'
      );

      if (await FileSystemUtils.fileExists(skillPath)) {
        paths[tool] = skillPath;

        // Read metadata from the first found skill file
        if (!description) {
          try {
            const content = await FileSystemUtils.readFile(skillPath);
            const { frontmatter } = parseFrontmatter(content);
            
            if (typeof frontmatter.description === 'string') {
              description = frontmatter.description;
            }

            metadata = extractMetadata(frontmatter);
          } catch {
            // Continue with empty description
          }
        }
      }
    }

    if (Object.keys(paths).length === 0) {
      return null;
    }

    const isNative = OPENCE_SKILL_IDS.some(id => `opence-${id}` === skillName);

    return {
      name: skillName,
      description,
      isNative,
      tools: Object.keys(paths),
      paths,
      metadata,
    };
  }

  /**
   * Create a new skill
   */
  async createSkill(
    projectPath: string,
    skillName: string,
    options: CreateSkillOptions
  ): Promise<void> {
    // Validate name
    const validation = validateSkillName(skillName);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Check if skill already exists
    const existing = await this.getSkillInfo(projectPath, skillName);
    if (existing) {
      throw new Error(
        `Skill '${skillName}' already exists. Use 'opence skill update' to modify it.`
      );
    }

    const tools = await this.discoverConfiguredTools(projectPath);
    if (tools.length === 0) {
      throw new Error(
        "No AI tools configured. Run 'opence init' to configure AI tools first."
      );
    }

    // Create skill in all configured tool directories
    for (const tool of tools) {
      await this.createSkillForTool(projectPath, tool, skillName, options);
    }
  }

  /**
   * Create skill files for a specific tool
   */
  private async createSkillForTool(
    projectPath: string,
    tool: string,
    skillName: string,
    options: CreateSkillOptions
  ): Promise<void> {
    const skillDir = path.join(projectPath, SKILL_DIRECTORIES[tool], skillName);
    
    // Create directories
    await FileSystemUtils.createDirectory(skillDir);
    await FileSystemUtils.createDirectory(path.join(skillDir, 'references'));
    await FileSystemUtils.createDirectory(path.join(skillDir, 'scripts'));

    // Generate SKILL.md content
    const content = this.generateSkillContent(tool, skillName, options);
    const skillPath = path.join(skillDir, 'SKILL.md');
    await FileSystemUtils.writeFile(skillPath, content);
  }

  /**
   * Generate skill content with appropriate frontmatter
   */
  private generateSkillContent(
    tool: string,
    skillName: string,
    options: CreateSkillOptions
  ): string {
    const frontmatter: Record<string, unknown> = {
      name: skillName,
      description: options.description,
    };

    if (tool === 'claude' || tool === 'github-copilot') {
      // Claude/Copilot format
      frontmatter['allowed-tools'] = options.allowedTools || ['Read', 'Write', 'Bash', 'Grep', 'Glob'];
      frontmatter['user-invocable'] = true;
    } else if (tool === 'codex') {
      // Codex format
      frontmatter.metadata = {
        'short-description': options.shortDescription || options.description.substring(0, 100),
      };
    }

    const yamlContent = yaml.stringify(frontmatter).trim();
    const instructions = generateUserSkillTemplate(skillName, options.description);

    return `---\n${yamlContent}\n---\n\n${instructions}`;
  }

  /**
   * Update an existing skill
   */
  async updateSkill(
    projectPath: string,
    skillName: string,
    options: UpdateSkillOptions
  ): Promise<void> {
    const skillInfo = await this.getSkillInfo(projectPath, skillName);
    
    if (!skillInfo) {
      throw new Error(
        `Skill '${skillName}' not found. Use 'opence skill add' to create it.`
      );
    }

    if (skillInfo.isNative) {
      throw new Error(
        "opence-native skills are managed by opence. Use 'opence update' to refresh them."
      );
    }

    // Update each tool's skill file
    for (const tool of skillInfo.tools) {
      await this.updateSkillForTool(projectPath, tool, skillName, skillInfo, options);
    }
  }

  /**
   * Update skill file for a specific tool
   */
  private async updateSkillForTool(
    projectPath: string,
    tool: string,
    skillName: string,
    currentInfo: SkillInfo,
    options: UpdateSkillOptions
  ): Promise<void> {
    const skillPath = path.join(
      projectPath,
      SKILL_DIRECTORIES[tool],
      skillName,
      'SKILL.md'
    );

    const content = await FileSystemUtils.readFile(skillPath);
    const { frontmatter, body } = parseFrontmatter(content);

    // Update frontmatter
    if (options.description !== undefined) {
      frontmatter.description = options.description;
    }

    if (tool === 'claude' || tool === 'github-copilot') {
      if (options.allowedTools !== undefined) {
        frontmatter['allowed-tools'] = options.allowedTools;
      }
    } else if (tool === 'codex') {
      const metadata = (frontmatter.metadata || {}) as Record<string, unknown>;
      if (options.shortDescription !== undefined) {
        metadata['short-description'] = options.shortDescription;
      }
      frontmatter.metadata = metadata;
    }

    // Write updated content
    const yamlContent = yaml.stringify(frontmatter).trim();
    const updatedContent = `---\n${yamlContent}\n---\n${body}`;
    await FileSystemUtils.writeFile(skillPath, updatedContent);
  }

  /**
   * Remove a skill
   */
  async removeSkill(
    projectPath: string,
    skillName: string,
    _options: RemoveSkillOptions = {}
  ): Promise<void> {
    const skillInfo = await this.getSkillInfo(projectPath, skillName);
    
    if (!skillInfo) {
      throw new Error(`Skill '${skillName}' not found.`);
    }

    if (skillInfo.isNative) {
      throw new Error('Cannot remove opence-native skills.');
    }

    // Remove skill directories from all tools
    for (const tool of skillInfo.tools) {
      const skillDir = path.join(projectPath, SKILL_DIRECTORIES[tool], skillName);
      await fs.rm(skillDir, { recursive: true, force: true });
    }
  }

  /**
   * Get skill content for display
   */
  async getSkillContent(projectPath: string, skillName: string): Promise<string> {
    const skillInfo = await this.getSkillInfo(projectPath, skillName);
    
    if (!skillInfo) {
      throw new Error(`Skill '${skillName}' not found.`);
    }

    // Get content from the first available tool
    const firstTool = skillInfo.tools[0];
    const skillPath = skillInfo.paths[firstTool];
    
    return await FileSystemUtils.readFile(skillPath);
  }
}
