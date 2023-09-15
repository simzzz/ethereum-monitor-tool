function createConfigController({ configService, asyncMiddleware, logger }) {
  const getConfig = asyncMiddleware(async (req, res) => {
    logger.info('Incoming GET /config request');
    const config = await configService.getActiveConfiguration();
    res.json(config);
  });

  const createConfig = asyncMiddleware(async (req, res) => {
    logger.info('Incoming POST /config request');
    const newConfig = req.body;
    await configService.createConfig(newConfig);
    res.status(201).json({ message: 'Configuration created' });
  });

  const updateConfig = asyncMiddleware(async (req, res) => {
    logger.info('Incoming PUT /config request');
    const updatedConfig = req.body;
    await configService.updateConfig(updatedConfig);
    res.status(200).json({ message: 'Configuration updated' });
  });

  const deleteConfig = asyncMiddleware(async (req, res) => {
    logger.info('Incoming DELETE /config request');
    const deletedConfig = req.body.name;
    await configService.deleteConfig(deletedConfig);
    res.status(200).json({ message: 'Configuration deleted' });
  });

  return {
    getConfig,
    createConfig,
    updateConfig,
    deleteConfig
  };
}

module.exports = createConfigController;
