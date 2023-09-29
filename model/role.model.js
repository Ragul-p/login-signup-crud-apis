const mongoose = require("mongoose");

const roleSchema = mongoose.Schema({
    role: {
        type: String,
        require: true
    }
})



module.exports = mongoose.model("RoleMaster", roleSchema);