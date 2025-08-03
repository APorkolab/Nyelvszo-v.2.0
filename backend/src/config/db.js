const { Sequelize } = require('sequelize');
const path = require('path');

// Determine the environment, default to 'development'
const env = process.env.NODE_ENV || 'development';

// Load the corresponding config file
const config = require(path.join(__dirname, '..', '..', 'config', 'config.json'))[env];

let sequelize;
if (config.use_env_variable) {
  // For production, use the DATABASE_URL environment variable
  sequelize = new Sequelize(process.env[config.use_env_variable], {
    ...config,
    dialectOptions: {
      charset: 'utf8mb4',
    },
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    },
    logging: false,
  });
} else {
  // For development and test, use the credentials from the config file
  sequelize = new Sequelize(config.database, config.username, config.password, {
    ...config,
    dialectOptions: {
      charset: 'utf8mb4',
    },
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    },
    logging: false,
  });
}

module.exports = sequelize;