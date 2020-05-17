const joi = require('@hapi/joi');
const { validate } = require('./common');

const loginSchema = joi.object().keys({
    emailAddress: joi.string().required(),
    password: joi.string().required(),
});

module.exports = {
    login: (req, res, cb) => validate(loginSchema, req, res, cb),
};
