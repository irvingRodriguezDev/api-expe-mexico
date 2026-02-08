const sequelize = require("../config/db");

const User = require("./User");

const db = {
  sequelize,
  User,
};

module.exports = db;
