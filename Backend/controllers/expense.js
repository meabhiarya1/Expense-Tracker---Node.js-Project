const Expense = require("../models/expense");

exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.findAll({ where: { userId: req.user.id } });
        res.json(expenses);
    } catch (err) {
        console.error(err);
    }
};

exports.addExpense = async (req, res) => {
    console.log(req.body);

    const { expensePrice, expenseDescription, expenseCategory } = req.body;
    try {
        const expense = await Expense.create({
            expensePrice,
            expenseDescription,
            expenseCategory,
            userId: req.user.id,
        });
        // console.log("Expense created:", expense);
        res.json(expense);
    } catch (err) {
        console.error(err);
    }
};

exports.deleteExpense = async (req, res, next) => {
    await Expense.destroy({ where: { id: req.params.id, userId: req.user.id } })
        .then((noOfRows) => {
            if (noOfRows === 0) {
                return res.status(404).json({ message: "Expense doesn't belongs to the user" })
            }
            return res.status(200).json({ message: "Deleted" });
        })
        .catch((err) => console.log(err));
};