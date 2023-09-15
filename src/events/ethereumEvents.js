const EventEmitter = require('events');
class EthereumEvent extends EventEmitter {}
const ethereumEvent = new EthereumEvent();
module.exports = ethereumEvent;
