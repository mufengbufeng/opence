import { SlashCommandConfigurator } from './base.js';
import { ClaudeSlashCommandConfigurator } from './claude.js';
import { CodexSlashCommandConfigurator } from './codex.js';
import { GitHubCopilotSlashCommandConfigurator } from './github-copilot.js';

export class SlashCommandRegistry {
  private static configurators: Map<string, SlashCommandConfigurator> = new Map();

  static {
    const claude = new ClaudeSlashCommandConfigurator();
    const codex = new CodexSlashCommandConfigurator();
    const githubCopilot = new GitHubCopilotSlashCommandConfigurator();

    this.configurators.set(claude.toolId, claude);
    this.configurators.set(codex.toolId, codex);
    this.configurators.set(githubCopilot.toolId, githubCopilot);
  }

  static register(configurator: SlashCommandConfigurator): void {
    this.configurators.set(configurator.toolId, configurator);
  }

  static get(toolId: string): SlashCommandConfigurator | undefined {
    return this.configurators.get(toolId);
  }

  static getAll(): SlashCommandConfigurator[] {
    return Array.from(this.configurators.values());
  }
}
