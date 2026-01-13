import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  plan: '.github/prompts/opence-plan.prompt.md',
  work: '.github/prompts/opence-work.prompt.md',
  review: '.github/prompts/opence-review.prompt.md',
  compound: '.github/prompts/opence-compound.prompt.md',
};

const FRONTMATTER: Record<SlashCommandId, string> = {
  plan: `---
description: Create an opence plan and scaffold change artifacts.
---

$ARGUMENTS`,
  work: `---
description: Implement an opence change and keep tasks in sync.
---

$ARGUMENTS`,
  review: `---
description: Review an opence change with prioritized findings.
---

$ARGUMENTS`,
  compound: `---
description: Document learnings and prepare to compound an opence change.
---

$ARGUMENTS`,
};

export class GitHubCopilotSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'github-copilot';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string {
    return FRONTMATTER[id];
  }
}
