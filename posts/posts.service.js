const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../helpers/db');
const Post = db.Post;
const User = db.User;

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll(userParam) {
    return await Post.find({ userId: userParam });
}

async function getById(id) {
    return await Post.findById(id);
}

async function create(postParam) {
    const user = await User.findById(postParam.userId);
    if (!user) throw 'User not found';

    const modifiedUser = ({...user}._doc);
    delete modifiedUser.friends;

    const post = new Post({...postParam, user: user })

    await post.save();
}

async function update(id, postParam) {
    const post = await Post.findById(id);

    if (!post) throw 'Post not found';

    Object.assign(post, postParam);

    await post.save();
}

async function _delete(id) {
    await Post.findByIdAndRemove(id);
}
