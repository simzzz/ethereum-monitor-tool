function createEthereumWorker({
  web3WS,
  ethereumEvent,
  logger,
  configService,
  TX_PROCESS_INTERVAL,
  MAX_QUEUE_SIZE
}) {
  const transactionQueue = [];

  let subscription;
  function subscribeToPendingTransactions() {
    subscription = web3WS.eth
      .subscribe('pendingTransactions', (error, result) => {
        if (error) logger.error(error);
      })
      .on('data', async (transactionHash) => {
        if (transactionQueue.length >= MAX_QUEUE_SIZE) {
          logger.warn('Transaction queue is full. Ignoring new transactions.');
          return;
        }
        logger.info(`Adding transaction ${transactionHash} to queue`);
        const blockNumber = await web3WS.eth.getBlockNumber();
        transactionQueue.push({ transactionHash, blockNumber });
      })
      .on('error', (error) => {
        logger.error(error);
        setTimeout(subscribeToPendingTransactions, 5000);
      });
  }

  subscribeToPendingTransactions();

  setInterval(async () => {
    const currentConfig = await configService.getActiveConfiguration();
    const blockDelay = currentConfig.blockDelay || 0;
    const currentBlockNumber = await web3WS.eth.getBlockNumber();

    while (transactionQueue.length > 0) {
      const { transactionHash, blockNumber } = transactionQueue[0];
      if (blockNumber <= currentBlockNumber - blockDelay) {
        transactionQueue.shift();
        ethereumEvent.emit('newTransaction', transactionHash);
      } else {
        break;
      }
    }
  }, TX_PROCESS_INTERVAL);

  function cleanUp() {
    subscription.unsubscribe((error, success) => {
      if (error) {
        logger.error(error);
      }
      logger.info('Successfully unsubscribed from Ethereum!');
    });
  }

  process.on('exit', cleanUp);
  process.on('SIGINT', cleanUp);
  process.on('SIGTERM', cleanUp);

  return {
    cleanUp
  };
}

module.exports = createEthereumWorker;
