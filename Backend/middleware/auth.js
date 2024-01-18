const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.authenticate = (req, res, next) => {
    try {
        const token = req.header("Authorization");
        // console.log(token);
        const user = jwt.verify(token, 'secretkey');
        // console.log(user.userId)
        User.findByPk(user.userId).then(user => {
            req.user = user;
            next();
        })
    } catch (error) {
        console.log(error);
        return res.status(401)
    }
}