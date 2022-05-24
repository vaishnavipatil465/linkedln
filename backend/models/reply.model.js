const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

const replySchema = Schema({
    content: { type: String, required: true },
    post_id: { type: ObjectId, ref: 'Post' },
    user_id: { type: ObjectId, ref: 'User' },
    comment_id: [{ type: ObjectId, ref: 'Comment' }]
}, { timestamps: true });


module.exports = mongoose.model('reply', replySchema);
