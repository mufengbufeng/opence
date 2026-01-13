// Core opence logic will be implemented here
export {
  GLOBAL_CONFIG_DIR_NAME,
  GLOBAL_CONFIG_FILE_NAME,
  GLOBAL_DATA_DIR_NAME,
  type GlobalConfig,
  getGlobalConfigDir,
  getGlobalConfigPath,
  getGlobalConfig,
  saveGlobalConfig,
  getGlobalDataDir
} from './global-config.js';

export {
  SkillManager,
  validateSkillName,
  type SkillInfo,
  type SkillMetadata,
  type CreateSkillOptions,
  type UpdateSkillOptions,
  type RemoveSkillOptions,
} from './skill-manager.js';
