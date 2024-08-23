const fs = require('fs').promises;
const {
  createReadStream
} = require('fs');
const readline = require('readline');
const sequelize = require('../config/db');
const User = require('../models/user');
const Entry = require('../models/entry');
const bcrypt = require('bcrypt');

const chunkArray = (array, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

const processFile = async (filePath, model, chunkSize = 1000) => {
  const fileStream = createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let chunk = [];
  for await (const line of rl) {
    const data = JSON.parse(line);

    // Jelszó hashelése, ha a User modellel dolgozunk
    if (model === User && data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }

    chunk.push(data);
    if (chunk.length === chunkSize) {
      await model.bulkCreate(chunk);
      chunk = [];
    }
  }
  if (chunk.length) {
    await model.bulkCreate(chunk);
  }
};

const seedDatabase = async () => {
  try {
    await sequelize.sync({
      force: true
    });
    console.log("All tables have been created or updated.");

    await processFile(__dirname + '/users.json', User);
    await processFile(__dirname + '/entries.json', Entry);

    console.log("Database has been seeded successfully!");
  } catch (error) {
    console.error("Error seeding the database: ", error);
  }
};

module.exports = seedDatabase;