function createTransactionRepository({ Transaction, logger }) {
  async function create(tx) {
    try {
      await Transaction.create(tx);
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        logger.warn(`Duplicate transaction detected: ${tx.transactionHash}`);
      } else {
        logger.error(`Error inserting transaction: ${err.message}`);
      }
    }
  }

  return {
    create
  };
}

module.exports = createTransactionRepository;
