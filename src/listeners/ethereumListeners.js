function createEthereumListeners({
  ethereumService,
  configService,
  ethereumEvent,
  logger
}) {
  ethereumEvent.on('newTransaction', async (transactionHash) => {
    try {
      const currentConfig = await configService.getActiveConfiguration();
      await ethereumService.processNewTransaction(
        transactionHash,
        currentConfig
      );
    } catch (error) {
      logger.error(`Error processing new transaction: ${error.message}`);
    }
  });

  return {
    ethereumEvent
  };
}

module.exports = createEthereumListeners;
