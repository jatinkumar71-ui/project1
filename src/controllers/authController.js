const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const emailService = require("../services/emailService");

/**
 * - user registration controller
 * - POST /api/auth/register
 */
async function userRegistrationController(req, res) {
    const { name, email, password } = req.body;

    const isExists = await userModel.findOne({ email:email });

    if (isExists) {
        return res.status(422).json({
            message: "User already exists",
            status: "failed",  
        });
    }

    const user = await userModel.create({ name, email, password });

    const token = jwt.sign(
        {userId: user._id }, 
        process.env.JWT_SECRET, 
        { expiresIn: "3d" }
    );

    res.cookie("token", token);
    res.status(201).json({
        user:{
            _id: user._id,
            name: user.name,
            email: user.email,
        },
        token
    })
    await emailService.sendRegistrationEmail(user.email, user.name);
}

/**
 * - user login controller
 * - POST /api/auth/login
 */

async function userLoginController(req, res) {
    const {email, password} = req.body;

    const user = await userModel.findOne({ email: email }).select("+password");

    if(!user){
        return res.status(401).json({
            message: "Invalid email or password",
        })
    }

    const isValidPassword = await user.comparePassword(password);

    if(!isValidPassword){
        return res.status(401).json({
            message: "Invalid email or password",
        })
    }

    const token = jwt.sign(
        {userId: user._id }, 
        process.env.JWT_SECRET, 
        { expiresIn: "3d" }
    );

    res.cookie("token", token);

    res.status(200).json({
        user:{
            _id: user._id,
            name: user.name,
            email: user.email,
        },
        token
    })
}

module.exports = { userRegistrationController,
    userLoginController
 };