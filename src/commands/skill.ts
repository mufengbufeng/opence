import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { input, confirm, checkbox } from '@inquirer/prompts';
import path from 'path';
import {
  SkillManager,
  validateSkillName,
  CreateSkillOptions,
  UpdateSkillOptions,
  SkillInfo,
} from '../core/skill-manager.js';
import { PALETTE } from '../core/styles/palette.js';

const manager = new SkillManager();

/**
 * Format skill tools for display
 */
function formatTools(tools: string[]): string {
  return tools.map(t => PALETTE.midGray(`.${t}`)).join(', ');
}

/**
 * Display skill list
 */
function displaySkillList(skills: SkillInfo[]): void {
  const native = skills.filter(s => s.isNative);
  const user = skills.filter(s => !s.isNative);

  if (native.length > 0) {
    console.log(PALETTE.white('Opence-native skills:'));
    native.forEach(skill => {
      console.log(`  ${PALETTE.lightGray(skill.name.padEnd(25))} ${formatTools(skill.tools)}`);
    });
    console.log();
  }

  if (user.length > 0) {
    console.log(PALETTE.white('User-defined skills:'));
    user.forEach(skill => {
      console.log(`  ${PALETTE.white(skill.name.padEnd(25))} ${formatTools(skill.tools)}`);
    });
    console.log();
  }

  if (user.length === 0 && native.length > 0) {
    console.log(PALETTE.midGray("No user-defined skills. Use 'opence skill add <name>' to create one."));
  } else if (native.length === 0 && user.length === 0) {
    console.log(PALETTE.midGray("No AI tools configured. Run 'opence init' to get started."));
  } else {
    console.log(PALETTE.midGray("Use 'opence skill show <name>' for details."));
  }
}

/**
 * Display skill list as JSON
 */
function displaySkillListJson(skills: SkillInfo[]): void {
  const native = skills.filter(s => s.isNative).map(s => ({
    name: s.name,
    tools: s.tools,
  }));

  const user = skills.filter(s => !s.isNative).map(s => ({
    name: s.name,
    tools: s.tools,
  }));

  console.log(JSON.stringify({ native, user }, null, 2));
}

/**
 * Display skill details
 */
function displaySkillInfo(skill: SkillInfo, content?: string): void {
  console.log(PALETTE.white(skill.name));
  
  if (skill.isNative) {
    console.log(PALETTE.midGray('(opence-native skill)'));
  }
  
  console.log();
  console.log(PALETTE.lightGray('Description:'));
  console.log(`  ${skill.description || PALETTE.midGray('(no description)')}`);
  console.log();
  
  console.log(PALETTE.lightGray('Tools:'));
  console.log(`  ${skill.tools.join(', ')}`);
  console.log();
  
  console.log(PALETTE.lightGray('Paths:'));
  Object.entries(skill.paths).forEach(([tool, skillPath]) => {
    console.log(`  ${PALETTE.midGray(tool.padEnd(15))} ${skillPath}`);
  });
  
  if (content) {
    console.log();
    console.log(PALETTE.lightGray('Content preview (first 20 lines):'));
    const lines = content.split('\n').slice(0, 20);
    lines.forEach(line => {
      console.log(`  ${PALETTE.midGray('│')} ${line}`);
    });
    if (content.split('\n').length > 20) {
      console.log(`  ${PALETTE.midGray('│')} ${PALETTE.midGray('...')}`);
    }
  }
}

/**
 * Display skill info as JSON
 */
function displaySkillInfoJson(skill: SkillInfo, content?: string): void {
  const output = {
    name: skill.name,
    description: skill.description,
    isNative: skill.isNative,
    tools: skill.tools,
    paths: skill.paths,
    metadata: skill.metadata,
    content,
  };
  
  console.log(JSON.stringify(output, null, 2));
}

/**
 * Register the skill command and all its subcommands
 */
export function registerSkillCommand(program: Command): void {
  const skillCmd = program
    .command('skill')
    .description('Manage AI assistant skills in your project');

  // skill add <name>
  skillCmd
    .command('add <name>')
    .description('Create a new user-defined skill')
    .option('--description <text>', 'Skill description')
    .option('--allowed-tools <tools>', 'Comma-separated list of allowed tools (Claude/Copilot only)')
    .option('--short-description <text>', 'Short description for Codex')
    .action(async (name: string, options: {
      description?: string;
      allowedTools?: string;
      shortDescription?: string;
    }) => {
      try {
        const projectPath = path.resolve('.');
        
        // Validate name
        const validation = validateSkillName(name);
        if (!validation.valid) {
          console.error(chalk.red(`Error: ${validation.error}`));
          process.exit(1);
        }

        // Check for configured tools
        const tools = await manager.discoverConfiguredTools(projectPath);
        if (tools.length === 0) {
          console.error(chalk.red("Error: No AI tools configured. Run 'opence init' first."));
          process.exit(1);
        }

        // Get or prompt for options
        let description = options.description;
        if (!description) {
          description = await input({
            message: 'Description:',
            validate: (value) => value.length > 0 || 'Description is required',
          });
        }

        let allowedTools: string[] | undefined;
        if (tools.includes('claude')) {
          if (options.allowedTools) {
            allowedTools = options.allowedTools.split(',').map(t => t.trim());
          } else {
            const defaultTools = ['Read', 'Write', 'Bash', 'Grep', 'Glob'];
            allowedTools = await checkbox({
              message: 'Allowed tools (for Claude/Copilot):',
              choices: defaultTools.map(t => ({ value: t, checked: true })),
            });
          }
        }

        let shortDescription = options.shortDescription;
        if (!shortDescription && tools.includes('codex')) {
          shortDescription = description.substring(0, 100);
        }

        const createOptions: CreateSkillOptions = {
          description,
          allowedTools,
          shortDescription,
        };

        // Create skill
        const spinner = ora({
          text: `Creating skill '${name}'...`,
          color: 'gray',
        }).start();

        await manager.createSkill(projectPath, name, createOptions);

        spinner.stopAndPersist({
          symbol: PALETTE.white('✓'),
          text: PALETTE.white(`Skill '${name}' created successfully`),
        });

        console.log();
        console.log(PALETTE.midGray('Created in:'));
        for (const tool of tools) {
          const toolDir = tool === 'claude' ? '.claude' : `.${tool}`;
          console.log(`  ${toolDir}/skills/${name}/`);
        }
        
        console.log();
        console.log(PALETTE.midGray('Edit SKILL.md to add your instructions.'));

      } catch (error: any) {
        console.error(chalk.red(`Error: ${error.message}`));
        process.exit(1);
      }
    });

  // skill list
  skillCmd
    .command('list')
    .description('List all skills in the project')
    .option('--json', 'Output as JSON')
    .action(async (options: { json?: boolean }) => {
      try {
        const projectPath = path.resolve('.');
        const skills = await manager.listSkills(projectPath);

        if (options.json) {
          displaySkillListJson(skills);
        } else {
          displaySkillList(skills);
        }

      } catch (error: any) {
        console.error(chalk.red(`Error: ${error.message}`));
        process.exit(1);
      }
    });

  // skill show <name>
  skillCmd
    .command('show <name>')
    .description('Display detailed information about a skill')
    .option('--json', 'Output as JSON')
    .action(async (name: string, options: { json?: boolean }) => {
      try {
        const projectPath = path.resolve('.');
        const skill = await manager.getSkillInfo(projectPath, name);

        if (!skill) {
          console.error(chalk.red(`Error: Skill '${name}' not found.`));
          console.error(chalk.gray("Run 'opence skill list' to see available skills."));
          process.exit(1);
        }

        const content = await manager.getSkillContent(projectPath, name);

        if (options.json) {
          displaySkillInfoJson(skill, content);
        } else {
          displaySkillInfo(skill, content);
        }

      } catch (error: any) {
        console.error(chalk.red(`Error: ${error.message}`));
        process.exit(1);
      }
    });

  // skill update <name>
  skillCmd
    .command('update <name>')
    .description('Update an existing skill')
    .option('--description <text>', 'New description')
    .option('--allowed-tools <tools>', 'Comma-separated list of allowed tools')
    .option('--short-description <text>', 'New short description for Codex')
    .action(async (name: string, options: {
      description?: string;
      allowedTools?: string;
      shortDescription?: string;
    }) => {
      try {
        const projectPath = path.resolve('.');
        const skill = await manager.getSkillInfo(projectPath, name);

        if (!skill) {
          console.error(chalk.red(`Error: Skill '${name}' not found.`));
          console.error(chalk.gray("Use 'opence skill add' to create it."));
          process.exit(1);
        }

        if (skill.isNative) {
          console.error(chalk.red("Error: opence-native skills are managed by opence."));
          console.error(chalk.gray("Use 'opence update' to refresh them."));
          process.exit(1);
        }

        // Get or prompt for updates
        const updateOptions: UpdateSkillOptions = {};

        if (options.description !== undefined) {
          updateOptions.description = options.description;
        } else {
          const newDescription = await input({
            message: 'New description:',
            default: skill.description,
          });
          if (newDescription !== skill.description) {
            updateOptions.description = newDescription;
          }
        }

        if (skill.tools.includes('claude')) {
          if (options.allowedTools !== undefined) {
            updateOptions.allowedTools = options.allowedTools.split(',').map(t => t.trim());
          } else if (skill.metadata?.allowedTools) {
            const newAllowedTools = await checkbox({
              message: 'Allowed tools:',
              choices: ['Read', 'Write', 'Bash', 'Grep', 'Glob'].map(t => ({
                value: t,
                checked: skill.metadata!.allowedTools!.includes(t),
              })),
            });
            if (JSON.stringify(newAllowedTools) !== JSON.stringify(skill.metadata.allowedTools)) {
              updateOptions.allowedTools = newAllowedTools;
            }
          }
        }

        if (skill.tools.includes('codex')) {
          if (options.shortDescription !== undefined) {
            updateOptions.shortDescription = options.shortDescription;
          }
        }

        // Check if any changes
        if (Object.keys(updateOptions).length === 0) {
          console.log(PALETTE.midGray('No changes made.'));
          return;
        }

        // Update skill
        const spinner = ora({
          text: `Updating skill '${name}'...`,
          color: 'gray',
        }).start();

        await manager.updateSkill(projectPath, name, updateOptions);

        spinner.stopAndPersist({
          symbol: PALETTE.white('✓'),
          text: PALETTE.white(`Skill '${name}' updated successfully`),
        });

      } catch (error: any) {
        console.error(chalk.red(`Error: ${error.message}`));
        process.exit(1);
      }
    });

  // skill remove <name>
  skillCmd
    .command('remove <name>')
    .description('Remove a skill from the project')
    .option('-y, --yes', 'Skip confirmation prompt')
    .action(async (name: string, options: { yes?: boolean }) => {
      try {
        const projectPath = path.resolve('.');
        const skill = await manager.getSkillInfo(projectPath, name);

        if (!skill) {
          console.error(chalk.red(`Error: Skill '${name}' not found.`));
          process.exit(1);
        }

        if (skill.isNative) {
          console.error(chalk.red('Error: Cannot remove opence-native skills.'));
          process.exit(1);
        }

        // Confirm removal
        if (!options.yes) {
          const confirmed = await confirm({
            message: `Remove skill '${name}' from all configured tools?`,
            default: false,
          });

          if (!confirmed) {
            console.log(PALETTE.midGray('Removal cancelled.'));
            return;
          }
        }

        // Remove skill
        const spinner = ora({
          text: `Removing skill '${name}'...`,
          color: 'gray',
        }).start();

        await manager.removeSkill(projectPath, name, { skipConfirmation: true });

        spinner.stopAndPersist({
          symbol: PALETTE.white('✓'),
          text: PALETTE.white(`Skill '${name}' removed successfully`),
        });

      } catch (error: any) {
        console.error(chalk.red(`Error: ${error.message}`));
        process.exit(1);
      }
    });
}
