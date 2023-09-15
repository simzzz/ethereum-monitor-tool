const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const Configuration = require('./Configuration');

class Transaction extends Model {}

Transaction.init(
  {
    transactionHash: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    fromAddress: DataTypes.STRING,
    toAddress: DataTypes.STRING,
    value: DataTypes.STRING,
    configurationName: {
      type: DataTypes.STRING,
      references: {
        model: Configuration,
        key: 'name'
      }
    }
  },
  { sequelize, modelName: 'transaction' }
);

module.exports = Transaction;
