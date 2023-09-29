const mongoose = require("mongoose");

async function connectDB() {
    try {
        mongoose.connect("mongodb://127.0.0.1/Login");
        console.log(`Successfully connect to DB (:`);
    } catch (error) {
        console.log(`Failed connect to DB !!!`);
    }
}

module.exports = connectDB;