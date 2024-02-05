const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const FileURL = sequelize.define("fileurl", {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    url: Sequelize.STRING,
});

module.exports = FileURL;