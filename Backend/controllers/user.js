const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const isStringValid = (string) => {
    if (string == undefined || string.length === 0) {
        return true;
    }
    else {
        return false;
    }
}

const generateAccessToken = (id, isPremium) => {
    return jwt.sign({ userId: id, isPremium: isPremium }, 'secretkey')
}

exports.signup = async (req, res) => {
    try {
        const { name, email, number, password } = req.body;
        if (isStringValid(name) || isStringValid(email) || isStringValid(number) || isStringValid(password)) {
            return res.json({ message: "Please fill the fields" })
        }
        const existingUser = await User.count({ where: { email } });
        if (existingUser) {
            return res.json({ message: "Email already exists" });
        }

        const saltrounds = 10;
        bcrypt.hash(password, saltrounds, async (err, hash) => {
            await User.create({ name, email, number, password: hash })
            res.status(201).json({ message: "User Created" })
        })
    } catch (error) {
        console.log(error)
    }
}


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (isStringValid(email) || isStringValid(password)) {
            return res.json({ message: "Please fill the fields" });
        }

        const existingEmail = await User.findAll({ where: { email } });

        if (existingEmail.length > 0) {
            bcrypt.compare(password, existingEmail[0].password, (err, compareResult) => {
                if (err) {
                    throw new Error("Something went wrong")
                }
                if (compareResult === true) {
                    res.status(200).json({ message: "User logged in Successfully", token: generateAccessToken(existingEmail[0].id, existingEmail[0].isPremium) });
                } else if (password !== compareResult) {
                    return res.json({ message: "Password is incorrect" });
                }
            });
        } else {
            return res.json({ message: "User not registered" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" }); // Handle unexpected errors
    }
};


