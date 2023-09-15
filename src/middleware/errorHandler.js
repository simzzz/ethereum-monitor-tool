const logger = require('../utils/logger');

// Did not have time to cover all the cases
function errorHandler(err, req, res, next) {
  logger.error(err.message);

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res
      .status(400)
      .json({ message: `Error: ${err.message} - ${err.errors[0].message}` });
  }

  return res.status(500).json({ message: 'An unexpected error occurred' });
}

module.exports = errorHandler;
