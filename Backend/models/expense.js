const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Expense = sequelize.define("expenses", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },

    expensePrice: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    expenseDescription: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    expenseCategory: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

module.exports = Expense;
