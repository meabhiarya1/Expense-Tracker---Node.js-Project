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

exports.getExpenses = async (req, res, next) => {
    console.log(req.user)
    try {
        const page = +req.query.page;
        const ITEMS_PER_PAGE = +req.body.numberOfRows;
        const totalExpenses = await req.user.countExpenses();
        const Expenses = await req.user.getExpenses({
            offset: (page - 1) * ITEMS_PER_PAGE,
            limit: ITEMS_PER_PAGE,
        });
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
        console.log(error)
    }
};

exports.addExpense = async (req, res) => {
    const t = await sequelize.transaction();
    // console.log(req.body);

    const { expensePrice, expenseDescription, expenseCategory } = req.body;
    try {
        const expense = await Expense.create({
            expensePrice,
            expenseDescription,
            expenseCategory,
            userId: req.user.id,
        }, { transaction: t });
        // console.log("Expense created:", expense);
        const totalExpenses = Number(req.user.totalExpenses) + Number(expensePrice)
        // console.log(totalExpenses)
        await User.update({ totalExpenses: totalExpenses }, { where: { id: req.user.id }, transaction: t })
        await t.commit();
        res.status(200).json(expense);

        // await User.update({ totalExpenses: totalExpenses }, { where: { id: req.user.id }, transaction: t }).then(async () => {
        //     await t.commit();
        //     res.status(200).json(expense);
        // }).catch(async (err) => {
        //     await t.rollback();
        //     return res.status(500).json({ eror: err })
        // })
    } catch (err) {
        await t.rollback();
        return res.status(500).json({ error: err })
    }
};

exports.deleteExpense = async (req, res, next) => {
    // const t = await sequelize.transaction();
    // console.log(">>>>>>>>>>>>>>>>", req.user)
    // console.log(">>>>>>>>>>>>>>>>", req.params.id)
    try {
        await Expense.findByPk(req.params.id).then((expenseToDelete) => {
            const totalExpenses = Number(req.user.totalExpenses) - Number(expenseToDelete.expensePrice)
            User.update({ totalExpenses: totalExpenses }, { where: { id: req.user.id } });
            expenseToDelete.destroy().then(() => {
                return res.status(200).json({ message: "Deleted" });
            })
        })

    } catch (error) {
        return res.status(500).json({ error: error })
    }
};

exports.isPremiumUser = (req, res) => {
    return res.status(202).json(req.user.isPremium);
};