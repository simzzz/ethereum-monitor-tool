const logger = require('./utils/logger');
const { Sequelize } = require('sequelize');
const config = require('./config').db;

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: config.host,
  port: config.port,
  username: config.username,
  password: config.password,
  database: config.database,
  logging: config.logging,
  retry: {
    match: [
      /ETIMEDOUT/,
      /EHOSTUNREACH/,
      /ECONNRESET/,
      /ECONNREFUSED/,
      /ETIMEDOUT/,
      /ESOCKETTIMEDOUT/,
      /EHOSTUNREACH/,
      /EPIPE/,
      /EAI_AGAIN/
    ],
    max: 5
  }
});

async function authenticate() {
  try {
    await sequelize.authenticate();

    logger.info('Sequelize authentication successful.');
  } catch (err) {
    logger.error(`Sequelize authentication failed: ${err}`);
    throw new Error('Database authentication failed');
  }
}

async function sync() {
  try {
    await sequelize.sync();
    logger.info('Sequelize sync successful.');
  } catch (err) {
    logger.error(`Sequelize sync failed: ${err}`);
    throw new Error('Database sync failed');
  }
}

async function connect() {
  await authenticate();
  await sync();
}

async function close() {
  try {
    await sequelize.close();
    logger.info('Database connections closed');
  } catch (err) {
    logger.error('Error while closing database connections:', err);
    throw new Error('Failed to close database connections');
  }
}

module.exports = {
  sequelize,
  connect,
  close
};
