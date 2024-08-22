const {
  DataTypes
} = require('sequelize');
const sequelize = require('../config/db');

const Entry = sequelize.define('Entry', {
  hungarian: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fieldOfExpertise: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  wordType: {
    type: DataTypes.STRING,
  },
  english: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  indexes: [{
      fields: ['hungarian']
    },
    {
      fields: ['english']
    },
  ],
  charset: 'utf8mb4',
  collate: 'utf8mb4_general_ci',
});

module.exports = Entry;