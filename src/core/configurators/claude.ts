import path from 'path';
import { ToolConfigurator } from './base.js';
import { FileSystemUtils } from '../../utils/file-system.js';
import { TemplateManager } from '../templates/index.js';
import { OPENCE_MARKERS } from '../config.js';

export class ClaudeConfigurator implements ToolConfigurator {
  name = 'Claude Code';
  configFileName = 'CLAUDE.md';
  isAvailable = true;

  async configure(projectPath: string, openceDir: string): Promise<void> {
    const filePath = path.join(projectPath, this.configFileName);
    const content = TemplateManager.getClaudeTemplate();
    
    await FileSystemUtils.updateFileWithMarkers(
      filePath,
      content,
      OPENCE_MARKERS.start,
      OPENCE_MARKERS.end
    );
  }
}
