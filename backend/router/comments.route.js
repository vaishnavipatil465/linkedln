const router = require('express').Router();
const { Post, Comment, Reply } = require('../models');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const { Validator } = require('node-input-validator');

router.post('/:post_id/comments/create', async (req, res) => {
    try {
        const v = new Validator(req.body, {
            comment: 'required'
        });

        const matched = await v.check();
        if (!matched) {
            return res.status(422).send(v.errors);
        }
        let { post_id } = req.params;
        if (!ObjectId.isValid(post_id)) {
            return res.status(400).json({ message: "Invalid post id", data: {} })
        }
        let post = await Post.findById(post_id);
        if (!post) {
            return res.status(400).json({ message: "No post found", data: {} })
        }
        req.user = { _id: "6162ca236a540e2144b1682b" };
        let newCommentDocument = new Comment({
            comment: req.body.comment,
            post_id: post_id,
            user_id: req.user._id
        });
        let createdComment = await newCommentDocument.save();
        await Post.updateOne({ _id: post_id }, { $push: { comments: createdComment._id } })
        return res.status(200).json({ message: "Comment successfully added", data: createdComment })
    } catch (err) {
        return res.status(400).json({
            message: err.message,
            data: err
        })
    }
});

router.post('/:post_id/:comment_id/reply/create', async (req, res) => {
    try {
        const v = new Validator(req.body, {
            content: 'required'
        });

        const matched = await v.check();
        if (!matched) {
            return res.status(422).send(v.errors);
        }
        let { post_id, comment_id } = req.params;
        if (!ObjectId.isValid(post_id)) {
            return res.status(400).json({ message: "Invalid post id", data: {} })
        }
        if (!ObjectId.isValid(comment_id)) {
            return res.status(400).json({ message: "Invalid comment id", data: {} })
        }
        // search post with comment
        let fetched = await Post.findOne({ _id: post_id, comments: { $in: [comment_id] } });
        if (!fetched) {
            return res.status(400).json({ message: "post/comment not found", data: {} })
        }
        req.user = { _id: "6162ca236a540e2144b1682b" };
        let newReplyDocument = new Reply({
            content: req.body.content,
            post_id: post_id,
            user_id: req.user._id,
            comment_id: comment_id
        });
        let createdReply = await newReplyDocument.save();
        await Comment.updateOne({ _id: comment_id }, { $push: { replies: createdReply._id } })
        return res.status(200).json({ message: "Reply successfully added", data: createdReply })
    } catch (err) {
        return res.status(400).json({
            message: err.message,
            data: err
        })
    }
});

router.put('/:post_id/:comment_id/like-comment', async (req, res) => {
    try {
        let { post_id, comment_id } = req.params;
        if (!ObjectId.isValid(post_id)) {
            return res.status(400).json({ message: "Invalid post id", data: {} })
        }
        if (!ObjectId.isValid(comment_id)) {
            return res.status(400).json({ message: "Invalid comment id", data: {} })
        }
        // search post with comment
        let fetched = await Post.findOne({ _id: post_id, comments: { $in: [comment_id] } });
        if (!fetched) {
            return res.status(400).json({ message: "post/comment not found", data: {} })
        }
        req.user = { _id: "6162ca236a540e2144b1682b" };
        let ack = await Comment.findByIdAndUpdate(comment_id, { $addToSet: { likes: req.user._id } }, { new: true }).exec();
        if (!ack) {
            return res.status(404).json({ message: "comment not found", data: ack });
        }
        return res.status(200).json({ data: ack });
    } catch (error) {
        return res.status(400).json({ message: error.message, data: err });
    }
})

router.get('/:post_id/:comment_id/list', async(req,res)=>{
    
})
module.exports = router;