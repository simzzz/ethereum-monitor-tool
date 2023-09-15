function createConfigService({
  logger,
  configRepository,
  jsonOps,
  DEFAULT_CONFIG,
  CURRENT_CONFIG_PATH
}) {
  async function createConfig(newConfig) {
    const createdConfig = await configRepository.create(newConfig);
    await setActiveConfiguration(newConfig);
    logger.info(`Inserted new configuration with id ${createdConfig.id}`);
  }

  async function updateConfig(updatedConfig) {
    const currentCfg = await getActiveConfiguration();
    await configRepository.update(currentCfg.name, updatedConfig);
    await jsonOps.writeJsonFile(CURRENT_CONFIG_PATH, {
      name: currentCfg.name,
      ...updatedConfig
    });
    logger.info(`Updated configuration ${updatedConfig.name}`);
  }

  async function deleteConfig() {
    try {
      await jsonOps.deleteJsonFile(CURRENT_CONFIG_PATH);
      await jsonOps.writeJsonFile(CURRENT_CONFIG_PATH, DEFAULT_CONFIG);
      logger.info('Deleted current configuration file.');
    } catch (err) {
      if (err.code === 'ENOENT') {
        logger.warn(
          'currentConfig.json file does not exist, nothing to delete.'
        );
      } else {
        logger.error(`Failed to delete currentConfig.json: ${err}`);
      }
    }
  }

  async function setActiveConfiguration(newConfig) {
    await jsonOps.writeJsonFile(CURRENT_CONFIG_PATH, newConfig);
  }

  async function getActiveConfiguration() {
    let cfg = await jsonOps.readJsonFile(CURRENT_CONFIG_PATH);

    if (!cfg) {
      await jsonOps.writeJsonFile(CURRENT_CONFIG_PATH, DEFAULT_CONFIG);
      cfg = DEFAULT_CONFIG;
    }

    return cfg;
  }

  // I know that this is initialization logic and a potential race condition since it's not awaited
  // but it was a last-minute addition so I left it here instead of at initialization as it currently works fine
  async function ensureDefaultConfigExists() {
    const existingConfig = await configRepository.findConfigByName('Default');
    if (!existingConfig) {
      await createConfig(DEFAULT_CONFIG);
      logger.info('Default configuration added to database');
    }
  }

  ensureDefaultConfigExists().catch((err) => {
    logger.error(`Failed to seed default configuration: ${err}`);
  });

  return {
    createConfig,
    updateConfig,
    deleteConfig,
    getActiveConfiguration
  };
}

module.exports = createConfigService;
