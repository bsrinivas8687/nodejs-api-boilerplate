const joi = require('@hapi/joi');
const { validate } = require('./common');

const getMyAccessTokenSchema = joi.object().keys({
    refreshToken: joi.string().required(),
});

const updateMyProfileDetailsSchema = joi.object().keys({
    name: joi.string(),
    password: joi.string(),
});

const updateMyProfileImageSchema = joi.object().keys({
    send: joi.boolean(),
});

const logoutMeSchema = joi.object().keys({
    refreshToken: joi.string().required(),
});

module.exports = {
    getMyAccessToken: (req, res, cb) => validate(getMyAccessTokenSchema, req, res, cb),
    getMyProfileDetails: (req, res, cb) => cb(),
    getMyProfileImage: (req, res, cb) => cb(),
    updateMyProfileDetails: (req, res, cb) => validate(updateMyProfileDetailsSchema, req, res, cb),
    updateMyProfileImage: (req, res, cb) => validate(updateMyProfileImageSchema, req, res, cb),
    logoutMe: (req, res, cb) => validate(logoutMeSchema, req, res, cb),
};
