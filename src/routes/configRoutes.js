const express = require('express');
const {
  validatePost,
  validatePut,
  validateDelete
} = require('../middleware/validation');

module.exports = function ({ configController }) {
  const router = express.Router();

  router.get('/', configController.getConfig);
  router.post('/', validatePost, configController.createConfig);
  router.put('/', validatePut, configController.updateConfig);
  router.delete('/', validateDelete, configController.deleteConfig);

  return router;
};
