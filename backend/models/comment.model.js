const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

const commentSchema = new Schema({
    comment: { type: String, required: true },
    post_id: { type: ObjectId, ref: 'Post', required: true },
    user_id: { type: ObjectId, ref: 'User', required: true },
    replies: [{ type: ObjectId, ref: 'Reply' }],
    likes: [{ type: ObjectId, ref: "User" }],
}, { timestamps: true });


module.exports = mongoose.model('comment', commentSchema);
