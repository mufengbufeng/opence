import path from 'path';
import { FileSystemUtils } from '../utils/file-system.js';
import { OPENCE_DIR_NAME } from './config.js';
import { ToolRegistry } from './configurators/registry.js';
import { SlashCommandRegistry } from './configurators/slash/registry.js';
import { agentsTemplate } from './templates/agents-template.js';
import {
  OPENCE_SKILL_IDS,
  OpenceSkillVariant,
  getOpenceSkillSpec,
  updateOpenceSkillContent,
} from './templates/opence-skill-templates.js';

export class UpdateCommand {
  async execute(projectPath: string): Promise<void> {
    const resolvedProjectPath = path.resolve(projectPath);
    const openceDirName = OPENCE_DIR_NAME;
    const opencePath = path.join(resolvedProjectPath, openceDirName);

    // 1. Check opence directory exists
    if (!await FileSystemUtils.directoryExists(opencePath)) {
      throw new Error(`No opence directory found. Run 'opence init' first.`);
    }

    // 2. Update AGENTS.md (full replacement)
    const agentsPath = path.join(opencePath, 'AGENTS.md');

    await FileSystemUtils.writeFile(agentsPath, agentsTemplate);

    // 3. Update existing AI tool configuration files only
    const configurators = ToolRegistry.getAll();
    const slashConfigurators = SlashCommandRegistry.getAll();
    const updatedFiles: string[] = [];
    const createdFiles: string[] = [];
    const failedFiles: string[] = [];
    const updatedSlashFiles: string[] = [];
    const failedSlashTools: string[] = [];
    const updatedSkillFiles: string[] = [];

    for (const configurator of configurators) {
      const configFilePath = path.join(
        resolvedProjectPath,
        configurator.configFileName
      );
      const fileExists = await FileSystemUtils.fileExists(configFilePath);
      const shouldConfigure =
        fileExists || configurator.configFileName === 'AGENTS.md';

      if (!shouldConfigure) {
        continue;
      }

      try {
        if (fileExists && !await FileSystemUtils.canWriteFile(configFilePath)) {
          throw new Error(
            `Insufficient permissions to modify ${configurator.configFileName}`
          );
        }

        await configurator.configure(resolvedProjectPath, opencePath);
        updatedFiles.push(configurator.configFileName);

        if (!fileExists) {
          createdFiles.push(configurator.configFileName);
        }
      } catch (error) {
        failedFiles.push(configurator.configFileName);
        console.error(
          `Failed to update ${configurator.configFileName}: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }

    for (const slashConfigurator of slashConfigurators) {
      if (!slashConfigurator.isAvailable) {
        continue;
      }

      try {
        const updated = await slashConfigurator.updateExisting(
          resolvedProjectPath,
          opencePath
        );
        updatedSlashFiles.push(...updated);
      } catch (error) {
        failedSlashTools.push(slashConfigurator.toolId);
        console.error(
          `Failed to update slash commands for ${slashConfigurator.toolId}: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }

    updatedSkillFiles.push(...(await this.refreshSkills(resolvedProjectPath)));

    const summaryParts: string[] = [];
    const instructionFiles: string[] = ['opence/AGENTS.md'];

    if (updatedFiles.includes('AGENTS.md')) {
      instructionFiles.push(
        createdFiles.includes('AGENTS.md') ? 'AGENTS.md (created)' : 'AGENTS.md'
      );
    }

    summaryParts.push(
      `Updated opence instructions (${instructionFiles.join(', ')})`
    );

    const aiToolFiles = updatedFiles.filter((file) => file !== 'AGENTS.md');
    if (aiToolFiles.length > 0) {
      summaryParts.push(`Updated AI tool files: ${aiToolFiles.join(', ')}`);
    }

    if (updatedSlashFiles.length > 0) {
      // Normalize to forward slashes for cross-platform log consistency
      const normalized = updatedSlashFiles.map((p) => FileSystemUtils.toPosixPath(p));
      summaryParts.push(`Updated slash commands: ${normalized.join(', ')}`);
    }

    if (updatedSkillFiles.length > 0) {
      const normalized = updatedSkillFiles.map((p) => FileSystemUtils.toPosixPath(p));
      summaryParts.push(`Updated skills: ${normalized.join(', ')}`);
    }

    const failedItems = [
      ...failedFiles,
      ...failedSlashTools.map(
        (toolId) => `slash command refresh (${toolId})`
      ),
    ];

    if (failedItems.length > 0) {
      summaryParts.push(`Failed to update: ${failedItems.join(', ')}`);
    }

    console.log(summaryParts.join(' | '));

    // No additional notes
  }

  private async refreshSkills(projectPath: string): Promise<string[]> {
    const updated: string[] = [];

    const variants: OpenceSkillVariant[] = ['claude', 'codex'];
    for (const variant of variants) {
      const skillsRoot =
        variant === 'claude'
          ? path.join(projectPath, '.claude', 'skills')
          : path.join(projectPath, '.codex', 'skills');

      for (const id of OPENCE_SKILL_IDS) {
        const spec = getOpenceSkillSpec(id);
        const skillFile = path.join(skillsRoot, spec.name, 'SKILL.md');
        if (!await FileSystemUtils.fileExists(skillFile)) {
          continue;
        }

        const existing = await FileSystemUtils.readFile(skillFile);
        const updatedContent = updateOpenceSkillContent(existing, id, variant);
        await FileSystemUtils.writeFile(skillFile, updatedContent);
        updated.push(path.relative(projectPath, skillFile));
      }
    }

    return updated;
  }
}
