const express = require('express');
const router = express.Router();
const commentService = require('./comments.service');

// Routes
router.post('/', create);
router.get('/:id', getAll);
router.get('/comment/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;

function create(req, res, next) {
    commentService.create(req.body) 
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    commentService.getAll(req.params.id)
        .then(comments => res.json(comments))
        .catch(err => next(err));
}

function getById(req, res, next) {
    commentService.getById(req.params.id)
        .then(comment => comment ? res.json(comment) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    commentService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    commentService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}
