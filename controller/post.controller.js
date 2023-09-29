const User = require("../model/user.model")
const Post = require("../model/post.model")

async function createPost(req, res) {

    try {
        const { text } = req.body;
        if (!text) { return res.status(400).json({ error: "required text" }) }

        const post = await Post.create({ text, user: req.user._id })

        return res.status(200).json({ post })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "server error" })

    }

}





async function readPost(req, res) {
    try {
        const post = await Post.find({ user: req.user._id })
        return res.status(200).json({ post })
    } catch (error) {
        return res.status(500).json({ error: "server error" })
    }
}




async function updatePost(req, res) {
    try {
        const { id } = req.params;
        const { text } = req.body;
        if (!id || !text) { return res.status(400).json({ error: "required id & text" }) }

        const post = await Post.findById(id);
        if (!post) { return res.status(400).json({ error: "post not found" }) }

        if (post.user.toString() != req.user.id) { return res.status(400).json({ error: "user not created this post" }) }

        await Post.findByIdAndUpdate(id, { text }, { new: true })
        return res.status(200).json({ message: "successfully updated post" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "server error" })
    }

}

async function deletePost(req, res) {

    try {
        const { id } = req.params;
        const { text } = req.body;
        if (!id || !text) { return res.status(400).json({ error: "required id & text" }) }

        const post = await Post.findById(id);
        if (!post) { return res.status(400).json({ error: "post not found" }) }

        if (post.user.toString() != req.user.id) { return res.status(400).json({ error: "user not created this post" }) }

        await Post.deleteOne({ _id: id });

        return res.status(200).json({ message: "successfully deleted post" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "server error" })
    }

}

module.exports = { createPost, readPost, updatePost, deletePost }



