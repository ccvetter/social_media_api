const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../helpers/db');
const Comment = db.Comment;

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll(postParam) {
    return await Comment.find({ postId: postParam });
}

async function getById(id) {
    return await Comment.findById(id);
}

async function create(commentParam) {
    return await db.Comment.create(commentParam).then(comment => {
        return db.Post.findByIdAndUpdate(commentParam.postId,
            { $push: { comments: comment._id }},
            { new: true, useFindAndModify: false});
    });
}

async function update(id, commentParam) {
    const comment = await Comment.findById(id);

    if (!comment) throw 'Comment not found';

    Object.assign(comment, commentParam);

    await comment.save();
}

async function _delete(id) {
    await Comment.findByIdAndRemove(id);
}
