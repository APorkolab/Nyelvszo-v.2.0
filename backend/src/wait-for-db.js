const mysql = require('mysql2/promise');
const logger = require('./logger/logger');
const app = require('./server');
const port = process.env.PORT || 3000;
const seedDatabase = require('./seed/seeder');
const authenticateJwt = require('./models/auth/authenticate');

const dbConfig = process.env.DATABASE_URL ? {
  uri: process.env.DATABASE_URL
} : {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
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