export const OPENCE_DIR_NAME = 'opence';

export const OPENCE_MARKERS = {
  start: '<!-- OPENCE:START -->',
  end: '<!-- OPENCE:END -->'
};

export interface OpenceConfig {
  aiTools: string[];
}

export interface AIToolOption {
  name: string;
  value: string;
  available: boolean;
  successLabel?: string;
}

export const AI_TOOLS: AIToolOption[] = [
  { name: 'Claude Code', value: 'claude', available: true, successLabel: 'Claude Code' },
  { name: 'OpenCode', value: 'opencode', available: true, successLabel: 'OpenCode' },
  { name: 'Codex', value: 'codex', available: true, successLabel: 'Codex' },
  { name: 'GitHub Copilot', value: 'github-copilot', available: true, successLabel: 'GitHub Copilot' },
  { name: 'AGENTS.md (works with Amp, VS Code, …)', value: 'agents', available: false, successLabel: 'your AGENTS.md-compatible assistant' }
];
