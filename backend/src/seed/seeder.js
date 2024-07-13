const fs = require('fs').promises;
const sequelize = require('../config/db');
const User = require('../models/user');
const Entry = require('../models/entry');

const chunkArray = (array, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

const seedDatabase = async () => {
  try {
    // Synchronize all models
    await sequelize.sync({
      force: true
    });
    console.log("All tables have been created or updated.");

    const users = JSON.parse(await fs.readFile('./seed/users.json', 'utf8'));
    const entries = JSON.parse(await fs.readFile('./seed/entries.json', 'utf8'));

    const userChunks = chunkArray(users, 1000);
    const entryChunks = chunkArray(entries, 1000);

    for (const chunk of userChunks) {
      await User.bulkCreate(chunk);
    }

    for (const chunk of entryChunks) {
      await Entry.bulkCreate(chunk);
    }

    console.log("Database has been seeded successfully!");
  } catch (error) {
    console.error("Error seeding the database: ", error);
  }
};

module.exports = seedDatabase;