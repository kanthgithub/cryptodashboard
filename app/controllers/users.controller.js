const userService = require('../authentication/user.service');

module.exports = {

    authenticate: (req, res, next) => {
        userService.authenticate(req.body)
            .then(user => user ? res.json(user) : res.status(400).json({message: 'Username or password is incorrect'}))
            .catch(err => next(err));
    },


    register: (req, res, next) => {
        userService.create(req.body)
            .then(() => res.json({}))
            .catch(err => next(err));
    },

    getAll: (req, res, next) => {
        userService.getAll()
            .then(users => res.json(users))
            .catch(err => next(err));
    },

    getCurrent: (req, res, next) => {
        userService.getById(req.user.sub)
            .then(user => user ? res.json(user) : res.sendStatus(404))
            .catch(err => next(err));
    },

    getById: (req, res, next) => {
        userService.getById(req.params.id)
            .then(user => user ? res.json(user) : res.sendStatus(404))
            .catch(err => next(err));
    },

    update: (req, res, next) => {
        userService.update(req.params.id, req.body)
            .then(() => res.json({}))
            .catch(err => next(err));
    },

    _delete: (req, res, next) => {
        userService.delete(req.params.id)
            .then(() => res.json({}))
            .catch(err => next(err));
    }
}