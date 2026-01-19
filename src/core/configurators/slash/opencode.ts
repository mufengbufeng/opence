import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  plan: '.opencode/commands/opence/plan.md',
  work: '.opencode/commands/opence/work.md',
  review: '.opencode/commands/opence/review.md',
  compound: '.opencode/commands/opence/compound.md',
  archive: '.opencode/commands/opence/archive.md',
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
  archive: `---
name: opence: archive
description: Archive a completed change and apply spec updates.
category: opence
tags: [opence, archive]
---`,
};

export class OpenCodeSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'opencode';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string {
    return FRONTMATTER[id];
  }
}
