const {
  DataTypes
} = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  role: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  hooks: {
    beforeCreate: async (user) => {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    },
  },
  indexes: [{
    fields: ['email']
  }, ],
  charset: 'utf8mb4',
  collate: 'utf8mb4_general_ci',
});

User.prototype.validPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = User;