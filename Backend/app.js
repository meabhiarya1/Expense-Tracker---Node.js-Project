const path = require("path");
const cors = require("cors");
const User = require("./models/user");
const Order = require("./models/orders");
const Expense = require("./models/expense");
const Forgotpassword = require('./models/forgotPassword');
const FileURL = require("./models/fileurl");

const express = require("express");
const bodyParser = require("body-parser");

// const errorController = require("./controllers/error");
const sequelize = require("./util/database");

const app = express();
const dotenv = require('dotenv');

// get config vars
dotenv.config();
app.use(cors());

const userRoutes = require("./routes/user");
const expenseRoutes = require("./routes/expense");
const purchaseRoutes = require("./routes/purchase")
const premiumRouter = require("./routes/premium");
const isPremiumUserRouter = require("./routes/expense");;
const forgotUserRouter = require("./routes/forgotPassword");

app.use(bodyParser.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/user", userRoutes);
app.use("/user", isPremiumUserRouter);
app.use("/expenses", expenseRoutes);
app.use("/purchase", purchaseRoutes);
app.use("/premium", premiumRouter);
app.use("/password", forgotUserRouter);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

User.hasMany(FileURL);
FileURL.belongsTo(User);

sequelize
    .sync().then((user) => {
        console.log(user);
        app.listen(3000);
    })
    .catch((err) => {
        console.log(err)
    });
