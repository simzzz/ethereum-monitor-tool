const awilix = require('awilix');
const Web3 = require('web3');
const defaultConfig = require('../defaultConfig.json');
const path = require('path');

const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY
});
container.register({
  // Database
  db: awilix.asValue(require('./db')),

  // Middleware
  errorHandler: awilix.asValue(require('./middleware/errorHandler')),
  asyncMiddleware: awilix.asValue(require('./middleware/asyncMiddleware')),

  // Repositories
  configRepository: awilix
    .asFunction(require('./repository/configRepository'))
    .singleton(),
  transactionRepository: awilix
    .asFunction(require('./repository/transactionRepository'))
    .singleton(),

  // Models
  Configuration: awilix.asValue(require('./models/Configuration')),
  Transaction: awilix.asValue(require('./models/Transaction')),

  // Routes
  configRoutes: awilix.asFunction(require('./routes/configRoutes')),

  // Services
  configService: awilix
    .asFunction(require('./services/configService'))
    .singleton(),
  ethereumService: awilix
    .asFunction(require('./services/ethereumService.js'))
    .singleton(),

  // Controllers
  configController: awilix.asFunction(
    require('./controllers/configController')
  ),

  // Events and listeners
  ethereumEvent: awilix.asValue(require('./events/ethereumEvents')),
  ethereumListeners: awilix
    .asFunction(require('./listeners/ethereumListeners'))
    .singleton(),
  ethereumWorker: awilix
    .asFunction(require('./workers/ethereumWorker'))
    .singleton(),

  // Utils and constants
  ruleValidator: awilix.asValue(require('./utils/ruleValidator')),
  logger: awilix.asValue(require('./utils/logger')),
  jsonOps: awilix.asFunction(require('./utils/jsonOps')).singleton(),
  web3Http: awilix.asValue(
    new Web3(new Web3.providers.HttpProvider(process.env.INFURA_URL))
  ),
  web3WS: awilix.asValue(
    new Web3(new Web3.providers.WebsocketProvider(process.env.INFURA_WS_URL))
  ),
  TX_PROCESS_INTERVAL: awilix.asValue(process.env.TX_PROCESS_INTERVAL || 10000),
  DEFAULT_CONFIG: awilix.asValue(defaultConfig),
  CURRENT_CONFIG_PATH: awilix.asValue(
    path.join(__dirname, '..', '/currentConfig.json')
  ),
  MAX_QUEUE_SIZE: awilix.asValue(process.env.MAX_QUEUE_SIZE || 1000)
});

module.exports = container;
