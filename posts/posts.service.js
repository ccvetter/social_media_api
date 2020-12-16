const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../helpers/db');
const Post = db.Post;
const User = db.User;
const Comment = db.Comment;

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    addLike,
    getComments
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

async function addLike(id) {
    await Post.findByIdAndUpdate(id, 
        { $inc: { likes: 1 }},
        { new: true }
    );
}

async function getComments(id) {
    const post = await Post.findById(id)
        .populate({
            path: 'comment',
            match: { postId: { $eq: id }}
        })
        .exec();

    // console.log();

    if (!post) throw 'Post not found';

    post.on('data', (doc) => {
        res.write(doc);
    });

    post.on('close', () => {
        return post;
    });
    // const comments = 
    // console.log(post.comments)
    // await Comment.find({ postId: { $in: post.comments }}, function(err, comments) {
    //     console.log(comments)
    // });
    // console.log(comments)
    // return comments;
    // return await Comment.find()
    //                 .populate({
    //                     match
    //                 });
}
