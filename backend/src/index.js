require('dotenv').config();
const logger = require('./logger/logger');
const app = require('./server');
const port = process.env.PORT || 3000;

if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
  logger.error('Database environment variables are not set.');
  process.exit(1);
}

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});