const express = require("express");
const app = express();
app.use(express.json());

const db = require("./config/db")
db();


// register,login,forgot-password
app.use("/api/user", require("./route/user.route"))

// crud operation
app.use("/api/post", require("./route/post.route"))

// role master
app.use("/api/role", require("./route/role.master.route"))



app.listen(3000, function () {
    console.log(`server is listening on port 3000`);
})