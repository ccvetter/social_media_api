require('../config/config.js');
const mongoose = require('mongoose');
const connectionOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
mongoose.connect(process.env.MONGODB_URI || global.Config.connectionString, connectionOptions)
    .then(() => console.log("Connected to MongoDB..."))
    .catch(err => console.error("Could not connect to MongoDB..."));
mongoose.Promise = global.Promise;

module.exports = {
    User: require('../users/user.model').User,
    Post: require('../posts/post.model').Post
};
