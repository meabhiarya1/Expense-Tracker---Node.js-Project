const express = require("express");
const userAuthentication = require("../middleware/auth");

const router = express.Router();

const expenseController = require("../controllers/expense");

router.get("/get-expenses", userAuthentication.authenticate, expenseController.getExpenses);

router.post("/add-expense", userAuthentication.authenticate, expenseController.addExpense);

router.delete("/delete-expense/:id", userAuthentication.authenticate, expenseController.deleteExpense)

module.exports = router;