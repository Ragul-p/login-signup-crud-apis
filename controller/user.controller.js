const bcrypt = require("bcrypt");
const otp = require("otp-generator")
const jwt = require("jsonwebtoken")

const User = require("../model/user.model")
const Role = require("../model/role.model")

async function registerUser(req, res) {

    try {

        //1. check require all fields
        const { username, email, password, role } = req.body;
        if (!email || !password || !role) { return res.status(400).json({ error: "required email , password & role" }) }

        // 2. check email formate
        var regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
        var checkmail = regexEmail.test(email);
        if (!checkmail) { return res.status(400).json({ error: "Invalid Email Formate" }) }

        // 3. check password length 
        if (!(password.length >= 6)) { return res.status(400).json({ error: "password length above 6 char" }) }
        const hashPassword = await bcrypt.hash(password, 10);

        // 4. check old user
        const oldUser = await User.findOne({ email })
        if (oldUser) { return res.status(400).json({ error: "user already exist use different mail id" }) }

        // 5. check role master table 
        const roleAccess = await Role.findOne({ role });
        if (!roleAccess) { return res.status(400).json({ error: "role not found" }) }

        //  succcess
        const user = await User.create({ username, email, password: hashPassword, role: roleAccess });

        return res.status(200).json({ user: user.id, email: user.email, token: generateToken(user._id) })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "server error" })

    }

}





async function loginUser(req, res) {
    try {

        //1. check require all fields
        const { email, password } = req.body;
        if (!email || !password) { return res.status(400).json({ error: "required email & password" }) }

        // 2. check email formate
        var regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
        var checkmail = regexEmail.test(email);
        if (!checkmail) { return res.status(400).json({ error: "Invalid Email Formate" }) }

        // 3. check the user
        const user = await User.findOne({ email })
        if (!user) { return res.status(400).json({ error: "user not found !!!" }) }

        // 4. check the password
        const comparepassword = await bcrypt.compare(password, user.password)
        if (!comparepassword) { return res.status(400).json({ error: "password wrong !!!" }) }

        // success
        const userObj = {
            _id: user._id,
            username: user.username,
            email: user.email,
            activeStatus: user.activeStatus,
            token: generateToken(user._id)
        }
        return res.status(200).json({ userObj })
    } catch (error) {
        return res.status(500).json({ error: "server error" })
    }
}




async function getOtp(req, res) {
    try {
        const email = req.email;

        const otpGenerator = { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false }
        const otpCode = otp.generate(6, otpGenerator);

        const expireTime = 20 * 60 * 1000; // expire in 20 minutes

        // update otp code to database
        await User.updateOne({ email }, {
            $set: {
                "otp.code": otpCode,
                "otp.expiry": Date.now() + expireTime
            }
        })

        return res.status(200).json({ userid: req.id, email: email, otp: otpCode })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "server error" })
    }

}

async function validateOtp(req, res) {

    try {

        const email = req.email;

        const { otp } = req.body;
        if (!otp) { return res.status(400).json({ error: "required   otp " }) }

        if (req.user.otp.code == null) { return res.status(400).json({ error: "otp already verified" }) }
        if (req.user.otp.code != otp) { return res.status(400).json({ error: "enter wrong otp" }) }
        if (Date.now() > new Date(req.user.otp.expiry)) { return res.status(400).json({ error: "expiry otp" }) }

        await User.updateOne({ email }, { $set: { "otp.code": null, "otp.expiry": null } })

        return res.status(200).json({ message: "successfully otp verified" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "server error" })
    }

}


async function resetPassword(req, res) {

    try {
        const { password, confirmPassword } = req.body;
        const email = req.email;
        if (!email || !password || !confirmPassword) { return res.status(400).json({ error: "required email & otp " }) }

        if (!(password.length >= 6) || !(confirmPassword.length >= 6)) { return res.status(400).json({ error: "password length above 6 char" }) }
        if (password != confirmPassword) { return res.status(400).json({ error: "password & confirmPassword are mismatch" }) }

        const hashPassword = await bcrypt.hash(password, 10)
        await User.updateOne({ email }, { $set: { password: hashPassword } })

        return res.status(200).json({ message: "successfully password updated" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "server error" })
    }

}

async function profile(req, res) {

    try {
        const user = req.user;
        const profile = {
            name: user.username,
            email: user.email,
            activeStatus: user.activeStatus,
            role: user.role.role
        }
        return res.status(200).json({ profile })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "server error" })
    }

}


function logout(req, res) {
    try {
        req.user = null;
        return res.status(200).json({ message: "user logout successfully ! " });
    } catch (error) {
        return res.status(500).json({ error: " server error" })
    }
}
module.exports = { registerUser, loginUser, getOtp, validateOtp, resetPassword, profile, logout }




function generateToken(id) {
    return jwt.sign({ id }, "yoursecret", { expiresIn: "3d" })
}