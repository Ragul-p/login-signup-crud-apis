const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getOtp, validateOtp, resetPassword, profile, logout } = require("../controller/user.controller");
const { userVerify, tokenVerify } = require("../middleware/user.middleware");


router.post("/register", registerUser);
router.post("/login", loginUser);


router.post("/get-otp", userVerify, getOtp);
router.post("/validate-otp", userVerify, validateOtp);
router.post("/reset-password", userVerify, resetPassword);

router.post("/profile", tokenVerify, profile)
router.post("/logout", tokenVerify, logout)



module.exports = router;