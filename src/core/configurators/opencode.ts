import path from 'path';
import { ToolConfigurator } from './base.js';
import { FileSystemUtils } from '../../utils/file-system.js';
import { TemplateManager } from '../templates/index.js';
import { OPENCE_MARKERS } from '../config.js';

export class OpenCodeConfigurator implements ToolConfigurator {
  name = 'OpenCode';
  configFileName = 'OPENCODE.md';
  isAvailable = true;

  async configure(projectPath: string, openceDir: string): Promise<void> {
    const filePath = path.join(projectPath, this.configFileName);
    const content = TemplateManager.getOpenCodeTemplate();
    
    await FileSystemUtils.updateFileWithMarkers(
      filePath,
      content,
      OPENCE_MARKERS.start,
      OPENCE_MARKERS.end
    );
  }
}
