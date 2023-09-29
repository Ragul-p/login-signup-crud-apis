const jwt = require("jsonwebtoken")
const User = require("../model/user.model");


async function userVerify(req, res, next) {
    try {

        // 1. check require fields
        const { email } = req.body;
        if (!email) { return res.status(200).json({ error: "required email " }) }

        // 2. check email formate
        var regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
        var checkmail = regexEmail.test(email);
        if (!checkmail) { return res.status(200).json({ error: "Invalid Email Formate" }) }

        // 3. check user 
        const user = await User.findOne({ email })
        if (!user) { return res.status(200).json({ error: "user not found !!!" }) }

        //  success
        req.email = user.email
        req.id = user._id
        req.user = user

        next();
    } catch (error) {

    }
}



async function tokenVerify(req, res, next) {
    try {
        // Example Token 
        //Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZDM0NGVlN2U0NzUxMTQxNTlkMWM5ZiIsImlhdCI6MTY5MTU2NzM0MiwiZXhwIjoxNjkxODI2NTQyfQ.qkVAu2BWwu-mAp05GFv4zeyF6tjIa6FAAFuCawbWpD4
        var token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
            const decode = jwt.verify(token, "yoursecret");

            const user = await User.findById(decode.id).populate("role");
            if (!user) { return res.status(400).json({ error: "user not found !!!   " }) }

            req.user = user;
        }
        if (!token) { return res.status(401).json({ message: "no token passed" }); }
        next();

    } catch (error) {
        return res.status(500).json({ error: "server error" })
    }
}

module.exports = { userVerify, tokenVerify }