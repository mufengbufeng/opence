import * as yaml from 'yaml';
import { OPENCE_MARKERS } from '../config.js';
import { getSlashCommandBody, SlashCommandId } from './slash-command-templates.js';

export type OpenceSkillId = SlashCommandId;
export type OpenceSkillVariant = 'claude' | 'codex';

type SkillSpec = {
  id: OpenceSkillId;
  name: string;
  description: string;
  shortDescription: string;
  allowedTools: string[];
  context?: 'fork';
};

const PLAN_TOOLS = ['Read', 'Grep', 'Glob'];
const WORK_TOOLS = ['Read', 'Write', 'Bash', 'Grep', 'Glob'];
const REVIEW_TOOLS = ['Read', 'Grep', 'Glob'];
const COMPOUND_TOOLS = ['Read', 'Write', 'Bash', 'Grep', 'Glob'];

const SKILLS: Record<OpenceSkillId, SkillSpec> = {
  plan: {
    id: 'plan',
    name: 'opence-plan',
    description: 'Create an opence plan and scaffold change artifacts.',
    shortDescription: 'Plan opence change artifacts.',
    allowedTools: PLAN_TOOLS,
  },
  work: {
    id: 'work',
    name: 'opence-work',
    description: 'Implement an opence change and keep tasks in sync.',
    shortDescription: 'Implement opence tasks.',
    allowedTools: WORK_TOOLS,
  },
  review: {
    id: 'review',
    name: 'opence-review',
    description: 'Review an opence change with prioritized findings.',
    shortDescription: 'Review opence changes.',
    allowedTools: REVIEW_TOOLS,
    context: 'fork',
  },
  compound: {
    id: 'compound',
    name: 'opence-compound',
    description: 'Document learnings, capture repeatable workflows as skills, and prepare to compound an opence change.',
    shortDescription: 'Document learnings, capture skills, and archive.',
    allowedTools: COMPOUND_TOOLS,
  },
};

export const OPENCE_SKILL_IDS: OpenceSkillId[] = ['plan', 'work', 'review', 'compound'];

export function getOpenceSkillSpec(id: OpenceSkillId): SkillSpec {
  return SKILLS[id];
}

function normalizeFrontmatterData(value: unknown): Record<string, unknown> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return { ...(value as Record<string, unknown>) };
  }
  return {};
}

function buildFrontmatterData(
  spec: SkillSpec,
  variant: OpenceSkillVariant,
  existing: Record<string, unknown>
): Record<string, unknown> {
  const data = { ...existing };
  data.name = spec.name;
  data.description = spec.description;

  if (variant === 'claude') {
    data['allowed-tools'] = spec.allowedTools;
    data['user-invocable'] = true;
    if (spec.context) {
      data.context = spec.context;
    } else if ('context' in data) {
      delete data.context;
    }
  } else {
    const metadata = normalizeFrontmatterData(data.metadata);
    metadata['short-description'] = spec.shortDescription;
    data.metadata = metadata;
  }

  return data;
}

function stringifyFrontmatter(data: Record<string, unknown>): string {
  const yamlBody = yaml.stringify(data).trimEnd();
  return `---\n${yamlBody}\n---`;
}

function splitFrontmatter(content: string): {
  frontmatter: Record<string, unknown>;
  body: string;
} {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/u);
  if (!match) {
    return { frontmatter: {}, body: content };
  }

  let parsed: Record<string, unknown> = {};
  try {
    parsed = normalizeFrontmatterData(yaml.parse(match[1]));
  } catch {
    parsed = {};
  }

  return {
    frontmatter: parsed,
    body: content.slice(match[0].length),
  };
}

function updateManagedBlock(content: string, body: string): string {
  const startMarker = OPENCE_MARKERS.start;
  const endMarker = OPENCE_MARKERS.end;
  const managedBlock = `${startMarker}\n${body}\n${endMarker}`;

  const startIndex = content.indexOf(startMarker);
  if (startIndex === -1) {
    const trimmed = content.trimStart();
    if (!trimmed) {
      return `${managedBlock}\n`;
    }
    return `${managedBlock}\n\n${trimmed}`;
  }

  const endIndex = content.indexOf(endMarker, startIndex + startMarker.length);
  if (endIndex === -1) {
    const trimmed = content.trimStart();
    return `${managedBlock}\n\n${trimmed}`;
  }

  const before = content.slice(0, startIndex);
  const after = content.slice(endIndex + endMarker.length);
  return `${before}${managedBlock}${after}`;
}

export function renderOpenceSkillContent(
  id: OpenceSkillId,
  variant: OpenceSkillVariant
): string {
  const spec = getOpenceSkillSpec(id);
  const body = getSlashCommandBody(id).trim();
  const frontmatter = stringifyFrontmatter(buildFrontmatterData(spec, variant, {}));
  return `${frontmatter}\n\n${OPENCE_MARKERS.start}\n${body}\n${OPENCE_MARKERS.end}\n`;
}

export function updateOpenceSkillContent(
  existingContent: string,
  id: OpenceSkillId,
  variant: OpenceSkillVariant
): string {
  const spec = getOpenceSkillSpec(id);
  const body = getSlashCommandBody(id).trim();

  const { frontmatter, body: existingBody } = splitFrontmatter(existingContent);
  const updatedFrontmatter = buildFrontmatterData(spec, variant, frontmatter);
  const frontmatterBlock = stringifyFrontmatter(updatedFrontmatter);

  const updatedBody = updateManagedBlock(existingBody, body);
  const normalizedBody = updatedBody.replace(/^\s*\n/u, '').trimEnd();

  return `${frontmatterBlock}\n\n${normalizedBody}\n`;
}
