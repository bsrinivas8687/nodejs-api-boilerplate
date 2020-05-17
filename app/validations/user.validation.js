const joi = require('@hapi/joi');
const { validate } = require('./common');

const addUserSchema = joi.object().keys({
    name: joi.string().required(),
    emailAddress: joi.string().required(),
    password: joi.string().required(),
});

module.exports = {
    addUser: (req, res, cb) => validate(addUserSchema, req, res, cb),
    getUsers: (req, res, cb) => cb(),
};
