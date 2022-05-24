const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

const postSchema = Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    image: { type: String, default: null },
    likes: [{ type: ObjectId, ref: "User" }],
    posted_by: { type: ObjectId, ref: "User", required: true },
    comments: [{ type: ObjectId, ref: "Comment" }]
}, { timestamps: true });


module.exports = mongoose.model('post', postSchema);
