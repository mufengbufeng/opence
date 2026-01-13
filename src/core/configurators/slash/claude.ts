import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  plan: '.claude/commands/opence/plan.md',
  work: '.claude/commands/opence/work.md',
  review: '.claude/commands/opence/review.md',
  compound: '.claude/commands/opence/compound.md',
};

const FRONTMATTER: Record<SlashCommandId, string> = {
  plan: `---
name: opence: plan
description: Create an opence plan and scaffold change artifacts.
category: opence
tags: [opence, plan]
---`,
  work: `---
name: opence: work
description: Implement an opence change and keep tasks in sync.
category: opence
tags: [opence, work]
---`,
  review: `---
name: opence: review
description: Review an opence change with prioritized findings.
category: opence
tags: [opence, review]
---`,
  compound: `---
name: opence: compound
description: Document learnings and prepare to compound an opence change.
category: opence
tags: [opence, compound]
---`,
};

export class ClaudeSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'claude';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string {
    return FRONTMATTER[id];
  }
}
