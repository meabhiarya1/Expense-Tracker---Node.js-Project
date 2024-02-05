const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Mailgen = require('mailgen');
const sequelize = require("../util/database");

const User = require('../models/user');
const Forgotpassword = require('../models/forgotPassword');


exports.sendForm = async (req, res, next) => {
    const uuid = req.params.id;
    console.log(uuid);
    const forgetpasswordrequest = await Forgotpassword.findByPk(uuid);
    if (forgetpasswordrequest.isActive === true) {
        res.send(`<form action="http://localhost:3000/password/resestpassword/${uuid}" method="POST" id="reset-passsword-form" class="form">
    <div class="form-group email-field">
        <label for="pass">New Password:</label>
        <input type="password" id="pass" name="pass">
    </div>
    <button type="submit">Reset</button> 
     <style>
            /* General styling */
            body {
                font-family: sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background-color: #f5f5f5;
                margin: 0;
            }
            
            /* Container with a neumorphic look */
            .container {
                background-color: #fff;
                padding: 30px;
                border-radius: 15px;
                box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1),
                    0px 8px 20px rgba(0, 0, 0, 0.05);
                width: 400px;
                max-width: 50%;
                margin: 0 auto;
            }
            
            /* Form styling */
            form {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            
            h1 {
                text-align: center;
                font-size: 24px;
                margin-bottom: 20px;
            }
            
            label {
                font-weight: bold;
                margin-bottom: 5px;
            }
            
            input[type="password"] {
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 5px;
                font-size: 16px;
                width: 100%;
            }
            
            
            input[type="password"]:focus {
                outline: none;
                border-color: #007bff;
                box-shadow: 0 0 5px rgba(0, 123, 255, 0.2);
            }
            
            button {
                background-color: #007bff;
                color: #fff;
                padding: 10px 20px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                margin-top: 15px;
            }
            
            button:hover {
                background-color: #0069d9;
            }
            
            @media (min-width: 768px) {
                .container {
                    width: 90%;
                }
            
                .form-group {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                }
            
                label {
                    width: 200px;
                    margin-right: 1px;
                }
            
                input[type="password"] {
                    width: calc(100% - 210px);
                }
            }
                
        </style>`);

    } else {
        res.send(`<h1>Link Expired</h1>`);
    }
};

exports.updatePassword = async (req, res, next) => {
    const password = req.body.pass;
    const uuid = req.params.id;
    // console.log("here is data>>>>>>>", password, uuid, req.body);
    const t = await sequelize.transaction();
    try {
        const forgetpasswordrequest = await Forgotpassword.findOne({
            where: { id: uuid },
        });
        forgetpasswordrequest.isActive = false;

        const hashedPassword = await bcrypt.hash(password, 10);
        const userid = forgetpasswordrequest.userId;
        const user = await User.findOne({ where: { id: userid } });
        user.password = hashedPassword;
        await user.save();
        await forgetpasswordrequest.save();

        await t.commit();
        res.status(200).send(`<h1>Password Reset Successfully</h1>`)
    } catch (err) {
        await t.rollback();
        res.status(403).send(`<h1>Something went wrong</h1>`);
    }
};

exports.forgotpassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        // const id = user.id;

        const forgetpasswordrequest = await Forgotpassword.create({
            userId: user.id,
        });
        const uuid = forgetpasswordrequest.id;
        user.createForgotpassword({ uuid, isActive: true })
        if (user) {
            const link = `http://localhost:3000/password/resestpassword/${uuid}`;
            SendEmail(req, res, link, email);
        } else {
            throw new Error("User doesn't exist")
        }
    } catch (err) {
        console.error(err)
        return res.json({ message: err, success: false });
    }

}

const SendEmail = (req, res, link, email) => {
    let config = {
        service: "gmail",
        auth: {
            user: process.env.USER_MAIL,
            pass: process.env.USER_PASS,
        },
    };
    let transporter = nodemailer.createTransport(config);
    let maingenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Expense Tracker",
            link: "https://mailgen.js/",
        },
    });
    let response = {
        body: {
            name: email,
            intro: "You have received an email",
            table: {
                data: [
                    {
                        description: `Your password reset link is: <a href=${link} hidden>Reset Link</a>`,
                    },
                ],
            },
            outro: "Valid for 15 mints",
        },
    };
    let mail = maingenerator.generate(response);
    let message = {
        from: "abhi.arya97161@gmail.com",
        to: email,
        subject: "Password Reset Link",
        html: mail,
    };
    transporter
        .sendMail(message)
        .then(() => {
            return res.status(200).json({
                msg: "Password Reset Link Sent successfully",
            });
        })
        .catch((err) => {
            return res.status(500).json({
                error: err.message,
            });
        });
};

