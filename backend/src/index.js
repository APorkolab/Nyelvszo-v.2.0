require('dotenv').config();
const logger = require('./logger/logger');
const waitForDb = require('./wait-for-db'); // wait-for-db importálása
const app = require('./server');
const port = process.env.PORT || 3000;

if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
  logger.error('Database environment variables are not set.');
  process.exit(1);
}

waitForDb().then(() => {
  app.listen(port, () => {
    logger.info(`App listening at http://localhost:${port}`);
  });
}).catch(err => {
  logger.error('Failed to start the server:', err);
  process.exit(1);
});
