const express = require('express');
const router = express.Router();
const postService = require('./posts.service');

// Routes
router.post('/:id', create);
router.get('/:id', getAll);
router.get('/post/:id', getById);
router.get('/:id/comments', getComments);
router.put('/:id', update);
router.put('/like/:id', addLike);
router.delete('/:id', _delete);

module.exports = router;

function create(req, res, next) {
    postService.create(req.body) 
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    postService.getAll(req.params.id)
        .then(posts => res.json(posts))
        .catch(err => next(err));
}

function getById(req, res, next) {
    postService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    postService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    postService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function addLike(req, res, next) {
    postService.addLike(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getComments(req, res, next) {
    postService.getComments(req.params.id)
        .then((comments) => res.json(comments))
        .catch(err => next(err));
}
