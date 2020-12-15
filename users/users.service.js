'use strict'; 

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../helpers/db');
const User = db.User;
const Post = db.Post;

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    addFriend,
    getFeed,
    delete: _delete
};

async function authenticate({ email, password }) {
    const user = await User.findOne({ email });
    if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ sub: user.id }, global.Config.secret, { expiresIn: '10d' });
        return {
            ...user.toJSON(),
            token
        };
    }
}

async function getAll() {
    return await User.find();
}

async function getById(id) {
    return await User.findById(id);
}

async function create(userParam) {
    if (await User.findOne({ email: userParam.email })) {
        throw 'Email "' + userParam.email + '" already exists';
    }

    const user = new User(userParam)
    user.friends.push('');
    if (userParam.password) {
        user.password = bcrypt.hashSync(userParam.password, 10);
    }

    return await user.save();
}

async function update(id, userParam) {
    const user = await User.findById(id);

    if (!user) throw 'User not found';
    if (user.email !== userParam.email && await User.findOne({ email: userParam.email })) {
        throw 'Email "' + userParam.email + '" already exists';
    }

    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    Object.assign(user, userParam);

    await user.save();
}

async function addFriend(id, friendParam) {
    const friend = await User.findOne({ _id: friendParam.friend });

    if (!friend) throw 'Friend not found';
    
    // Make copy of friend
    const newFriend = ({...friend}._doc);
    // Delete friends property to keep record size manageable
    delete newFriend.friends;

    const user = await User.findOneAndUpdate({ _id: id }, { $addToSet: { friends: newFriend }});

    if (!user) throw 'User not found';
    return user;
}

async function getFeed(id) {
    const user = await User.findOne({_id: id})

    if (!user) throw 'User not found';
    
    const feed = Post.find({ userId: [...user.friends.map(friend => friend._id), id]}).sort('-createdAt');
    
    if (!feed) throw 'Feed is empty';

    return feed;
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}
