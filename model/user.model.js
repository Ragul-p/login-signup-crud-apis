const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
    },
    activeStatus: {
        type: String,
        default: true
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RoleMaster"
    },
    otp: {
        code: {
            type: String,
            default: null
        }, expiry: {
            type: Date,
            default: null
        }
    }
}, { strict: false }, { timestamps: true })



module.exports = mongoose.model("user", userSchema);