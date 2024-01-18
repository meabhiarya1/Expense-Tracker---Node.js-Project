const path = require("path");
const cors = require("cors");
const User = require("./models/user");
const Order = require("./models/orders");
const Expense = require("./models/expense");

const express = require("express");
const bodyParser = require("body-parser");

// const errorController = require("./controllers/error");
const sequelize = require("./util/database");

const app = express();
app.use(cors());

const userRoutes = require("./routes/user");
const expenseRoutes = require("./routes/expense");
const purchaseRoutes = require("./routes/purchase")

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/user", userRoutes);
app.use("/expense", expenseRoutes);
app.use("/purchase", purchaseRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

sequelize
    .sync().then((user) => {
        console.log(user);
        app.listen(3000);
    })
    .catch((err) => {
        console.log(err)
    });
