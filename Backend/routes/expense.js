const express = require("express");
const userAuthentication = require("../middleware/auth");

const router = express.Router();

const expenseController = require("../controllers/expense");

// router.get("/get-expenses", userAuthentication.authenticate, expenseController.getAllExpenses);

router.post("/add-expense", userAuthentication.authenticate, expenseController.addExpense);

router.delete("/delete-expense/:id", userAuthentication.authenticate, expenseController.deleteExpense)

router.get("/ispremiumuser", userAuthentication.authenticate, expenseController.isPremiumUser);

router.get("/getexpenses", userAuthentication.authenticate, expenseController.getExpenses);

module.exports = router;