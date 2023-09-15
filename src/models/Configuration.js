const { sequelize } = require('../db');
const { Model, DataTypes } = require('sequelize');

class Configuration extends Model {}

Configuration.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    rules: {
      type: DataTypes.JSONB,
      allowNull: false,
      validate: {
        notEmpty: function (value) {
          if (Object.keys(value).length === 0) {
            throw new Error('Rules object should not be empty');
          }
        }
      }
    },
    blockDelay: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  },
  { sequelize, modelName: 'configuration' }
);

module.exports = Configuration;
