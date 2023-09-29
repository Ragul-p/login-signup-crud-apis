const express = require("express");
const router = express.Router();
const { createRole } = require("../controller/role.master.controller");

router.post("/create", createRole);

module.exports = router;