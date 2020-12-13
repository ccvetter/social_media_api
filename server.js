const express = require("express");
const app = express();
const cors = require('cors');
const jwt = require('./helpers/jwt');
const bodyParser = require('body-parser');
const errorHandler = require('./helpers/error_handler');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(jwt());

// API Routes
app.use("/api/users", require('./users/users.controller'));
app.use("/api/posts", require('./posts/posts.controller'));

app.use(errorHandler);

const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});

module.exports = server;
