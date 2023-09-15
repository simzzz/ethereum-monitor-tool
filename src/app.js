require('dotenv').config();
const express = require('express');
const container = require('./container');
const logger = container.resolve('logger');

const db = container.resolve('db');

const gracefulShutdown = async () => {
  try {
    await db.close();
    logger.info('Gracefully shutting down the application');
    process.exit(0);
  } catch (err) {
    logger.error('Error during graceful shutdown:', err);
    process.exit(1);
  }
};

db.connect()
  .then(() => {
    const app = express();
    const errorHandler = container.resolve('errorHandler');

    app.use(express.json());

    const configRoutes = container.resolve('configRoutes');
    app.use('/config', configRoutes);
    app.use(errorHandler);

    container.resolve('ethereumListeners');
    container.resolve('ethereumWorker');

    const port = process.env.PORT || 3000;

    app.listen(port, () => {
      logger.info(`Ethereum monitor app listening on port ${port}!`);
    });
  })
  .catch((error) => {
    logger.error('Failed to start application:', error);
  });

process.on('exit', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
