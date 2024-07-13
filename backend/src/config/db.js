const { Sequelize } = require('sequelize');
const config = require('config');

const { username, password, database, host, dialect } = config.get('database');

const sequelize = new Sequelize(database, username, password, {
  host,
  dialect,
  dialectOptions: {
    charset: 'utf8mb4',
  },
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
  },
  logging: false,
});

module.exports = sequelize;
