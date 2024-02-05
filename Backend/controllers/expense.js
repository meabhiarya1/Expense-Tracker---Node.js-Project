const Expense = require("../models/expense");
const User = require("../models/user");
const sequelize = require("../util/database");
const UserServices = require("../services/userservices");

// exports.getAllExpenses = async (req, res, next) => {
//     try {
//         const expenses = await UserServices.getExpenses(req);
//         res.json(expenses);
//     } catch (err) {
//         res.status(404).json({ message: err });
//     }
// };

// exports.getExpenses = async (req, res, next) => {
//     const t = await sequelize.transaction();
//     try {
//         const page = +req.body.page || 1;
//         const ITEMS_PER_PAGE = +req.body.numberOfRows;

//         const totalExpenses = await req.user.countExpenses();
//         const Expenses = await req.user.getExpenses({
//             offset: (page - 1) * ITEMS_PER_PAGE,
//             limit: ITEMS_PER_PAGE,
//         });

//         res.status(200).json({
//             Expenses: Expenses,
//             currentPage: page,
//             hasNextPage: page * ITEMS_PER_PAGE < totalExpenses,
//             hasPreviousPage: page > 1,
//             nextPage: page + 1,
//             previousPage: page - 1,
//             lastPage: Math.ceil(totalExpenses / ITEMS_PER_PAGE),
//         });
//     } catch (error) {
//         console.log(error)
//     }
// };


exports.addExpense = async (req, res) => {
    try {
        const t = await sequelize.transaction();
        const { expensePrice, expenseDescription, expenseCategory } = req.body;
        const expense = await Expense.create({
            expensePrice,
            expenseDescription,
            expenseCategory,
            userId: req.user.id,
        }, { transaction: t });

        const totalExpenses = Number(req.user.totalExpenses) + Number(expensePrice);
        await User.update({ totalExpenses }, { where: { id: req.user.id }, transaction: t });
        await t.commit();
        res.status(200).json(expense);
    } catch (err) {
        await t.rollback();
        res.status(500).json({ error: err.message });
    }
};

exports.deleteExpense = async (req, res, next) => {
    try {
        const t = await sequelize.transaction();

        const expenseToDelete = await Expense.findByPk(req.params.id);

        // Ensure expense exists before proceeding
        if (!expenseToDelete) {
            return res.status(404).json({ error: "Expense not found" });
        }

        const totalExpenses = Number(req.user.totalExpenses) - Number(expenseToDelete.expensePrice);

        await User.update({ totalExpenses }, { where: { id: req.user.id } }, { transaction: t });
        await expenseToDelete.destroy({ transaction: t }); // Use `destroy` within the transaction

        await t.commit();
        res.status(200).json({ message: "Deleted" });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: error });
    }
};

exports.isPremiumUser = (req, res) => {
    try {
        return res.status(202).json(req.user.isPremium);
    } catch (error) {
        console.log(error)
    }
};

exports.getExpenses = async (req, res, next) => {
    try {
        const page = +req.body.page || 1;
        const ITEMS_PER_PAGE = +req.body.numberOfRows;

        const [totalExpenses, Expenses] = await Promise.all([
            req.user.countExpenses(),
            req.user.getExpenses({
                offset: (page - 1) * ITEMS_PER_PAGE,
                limit: ITEMS_PER_PAGE,
            }),
        ]);

        res.status(200).json({
            Expenses: Expenses,
            currentPage: page,
            hasNextPage: page * ITEMS_PER_PAGE < totalExpenses,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalExpenses / ITEMS_PER_PAGE),
        });
    } catch (error) {
        console.error(error); // Log the error properly
        res.status(500).json({ error: 'Failed to retrieve expenses' }); // Send a user-friendly error message
    }
};
