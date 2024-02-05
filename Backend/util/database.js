// const Sequelize = require("sequelize");

// const sequelize = new Sequelize("expense-tracker", "root", "abhi9852", {
//   dialect: "mysql",
//   host: "localhost",
// });

// module.exports = sequelize;

const Sequelize = require("sequelize");
require('dotenv').config()

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  dialect: "mysql",
  host: process.env.DB_HOST,
});

module.exports = sequelize;