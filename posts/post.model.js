const Joi = require('joi');
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    text: {
        type: String,
        require: true,
        minlength: 1,
    },
    userId: {
        type: String,
        require: true
    },
    user: {
        type: Object,
        require: true 
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    likes: {
        type: Number
    }
}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);

function validatePost(post) {
    const schema = Joi.object({
        text: Joi.string().min(1).required(),
        userId: Joi.required()
    });

    return schema.validate(post);
}

exports.Post = Post;
exports.validate = validatePost;