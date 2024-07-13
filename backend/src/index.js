require('dotenv').config();
const config = require('config');
const logger = require('./logger/logger');
const app = require('./server');
const port = process.env.PORT || 3000;
const seedDatabase = require('./seed/seeder'); // Import the seeder

if (!config.has('database')) {
  logger.error('No database config found.');
  process.exit();
}

// Seed the database
seedDatabase().then(() => {
  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
});
