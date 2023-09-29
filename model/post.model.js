const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    text: {
        type: String,
        require: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },

}, { strict: false }, { timestamps: true })



module.exports = mongoose.model("Post", postSchema);