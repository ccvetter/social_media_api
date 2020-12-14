const Joi = require('joi');
const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    text: {
        type: String,
        require: true,
        minlength: 1,
    },
    postId: {
        type: String,
        require: true
    }
}, { timestamps: true });

const Comment = mongoose.model('Comment', CommentSchema);

function validateComment(comment) {
    const schema = Joi.object({
        text: Joi.string().min(1).required(),
        postId: Joi.required()
    });

    return schema.validate(comment);
}

exports.Comment = Comment;
exports.validate = validateComment;