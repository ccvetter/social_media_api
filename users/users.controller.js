const express = require('express');
const { _delete } = require('./users.service');
const router = express.Router();
const userService = require('./users.service');

// Routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/:id', getById);
router.get('/feed/:id', getFeed);
router.put('/:id', update);
router.put('/add_friend/:id', addFriend);
router.delete('/:id', deleteUser);

module.exports = router;

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => {
            user ? res.json(user) : res.status(400).json({ message: 'Email or password is incorrect' })
        })
        .catch(err => next(err));
}

function register(req, res, next) {
    userService.create(req.body) 
        .then((user) => {
            delete user.password;
            res.json(user);
        })
        .catch(err => next(err));
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    userService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then((user) => res.json(user))
        .catch(err => next(err));
}

function addFriend(req, res, next) {
    userService.addFriend(req.params.id, req.body)
        .then((user) => res.json(user))
        .catch(err => next(err));
}

function getFeed(req, res, next) {
    userService.getFeed(req.params.id)
        .then((feed) => res.json(feed))
        .catch(err => next(err));
}

function deleteUser(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}
