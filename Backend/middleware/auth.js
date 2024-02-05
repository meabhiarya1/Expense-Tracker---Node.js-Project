const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

exports.authenticate = (req, res, next) => {
    try {
        const token = req.header("Authorization");
        if (token) {
            const user = jwt.verify(token, process.env.TOKEN_SECRET);
            User.findByPk(user.userId).then(user => {
                req.user = user;
                next();
            })
        }
        else{
            return res.status(401).send({ auth: false, message: "No Token provided." });
        }
    } catch (error) {
        console.log(error);
        return res.status(401)
    }
}