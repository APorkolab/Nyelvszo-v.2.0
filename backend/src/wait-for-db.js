const mysql = require('mysql2/promise');
const config = require('config');
const logger = require('./logger/logger');
const app = require('./server');
const port = process.env.PORT || 3000;
const seedDatabase = require('./seed/seeder');

const dbConfig = {
  host: process.env.DB_HOST || config.get('database.host'),
  user: process.env.DB_USER || config.get('database.user'),
  password: process.env.DB_PASSWORD || config.get('database.password'),
  database: process.env.DB_NAME || config.get('database.name'),
  port: 3306
};

async function checkDatabaseConnection() {
  let retries = 5;
  while (retries) {
    try {
      const connection = await mysql.createConnection(dbConfig);
      await connection.end();
      logger.info('Database connection established. Seeding database...');
      await seedDatabase();
      app.listen(port, () => {
        logger.info(`App listening at http://localhost:${port}`);
      });
      break;
    } catch (err) {
      logger.error('Unable to connect to the database. Retrying in 5 seconds...');
      logger.error(err);
      retries -= 1;
      await new Promise(res => setTimeout(res, 5000));
    }
  }
  if (!retries) {
    logger.error('Failed to connect to the database after multiple attempts.');
    process.exit(1);
  }
}

checkDatabaseConnection();
