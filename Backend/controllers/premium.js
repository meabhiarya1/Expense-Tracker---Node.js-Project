const Expense = require("../models/expense");
const Users = require("../models/user");
const sequelize = require("../util/database");
const UserServices = require("../services/userservices");
const S3services = require("../services/s3services");
const jwt = require("jsonwebtoken");


exports.showLeaderBoard = async (req, res) => {
    try {
        const leaderBoardOfUsers = await Users.findAll({
            // attributes: ["id", "name", [sequelize.fn('sum', sequelize.col('expenses.expensePrice')), "totalExpenses"]],
            // include: [
            //     {
            //         model: Expense,
            //         attributes: []
            //     }
            // ],
            // group: ['id'],
            order: [["totalExpenses", "DESC"]],
        });
        res.status(200).json(leaderBoardOfUsers);
    } catch (error) {
        res.status(403).json({ error: error });
        console.log(error);
    }
};

exports.downloadExpenses = async (req, res) => {
    try {
        const expenses = await UserServices.getExpenses(req);
        const stringifiedExpense = JSON.stringify(expenses);
        const userId = req.user.id;
        const filename = `Expense${userId}/${new Date()}.txt`
        const fileURL = await S3services.uploadToS3(stringifiedExpense, filename);
        await req.user.createFileurl({ url: fileURL });
        res.status(200).json({ fileURL, success: true })
    } catch (error) {
        console.log(error)
        res.status(500).json({ fileURL: "", success: false, message: error });
    }
};

exports.getAllDownloadHistory = async (req, res) => {
    try {
        const downloadHistory = await UserServices.getAllDownloadHistory(req);
        res.status(200).json({ downloadHistory, success: true });
    } catch (error) {
        res.status(500).json({ message: error, success: false });
    }
};