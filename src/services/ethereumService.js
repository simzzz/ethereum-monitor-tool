function createEthereumService({
  logger,
  transactionRepository,
  ruleValidator,
  web3Http
}) {
  async function processNewTransaction(transactionHash, currentConfig) {
    const transaction = await web3Http.eth.getTransaction(transactionHash);

    const isValid = ruleValidator.validateTransactionWithRules(
      transaction,
      currentConfig.rules
    );

    if (isValid) {
      await transactionRepository.create({
        transactionHash: transaction.hash,
        fromAddress: transaction.from,
        toAddress: transaction.to,
        value: transaction.value.toString(),
        configurationName: currentConfig.name
      });

      logger.info(
        `Stored transaction ${transaction.hash} based on configuration ${currentConfig.name}`
      );
    }
  }

  return {
    processNewTransaction
  };
}

module.exports = createEthereumService;
