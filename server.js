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
app.use(express.json());

// API Routes
app.use("/api/users", require('./users/users.controller'));

app.use(errorHandler);

const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
})

// if (!config.get("privatekey")) {
//     console.error("FATAL ERROR: privatekey is not defined.");
//     process.exit(1);
// }

// mongoose 
//     .connect("mongodb://localhost/social_media", { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log("Connected to MongoDB..."))
//     .catch(err => console.error("Could not connect to MongoDB..."));

// app.use(express.json());
// app.use("/api/users", usersRoute);

// const port = process.env.PORT || 3000;
// app.listen(port, () => console.log(`Listening on port ${port}...`));
