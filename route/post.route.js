const express = require("express");
const router = express.Router();
const { createPost, readPost, updatePost, deletePost } = require("../controller/post.controller");
const { userVerify, tokenVerify } = require("../middleware/user.middleware");


router.post("/create", tokenVerify, createPost);
router.get("/read", tokenVerify, readPost);
router.put("/update/:id", tokenVerify, updatePost);
router.delete("/delete/:id", tokenVerify, deletePost);




module.exports = router;