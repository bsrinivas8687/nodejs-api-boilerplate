const joi = require('@hapi/joi');

const getMyAccessToken = (req, res, cb) => {
    const schema = joi.object().keys({
        refreshToken: joi.string().required(),
    });
    const { error } = joi.validate(req.body, schema);

    if (error) {
        res.status(422).send({
            success: false,
            error,
        });
    } else {
        cb();
    }
};

const getMyProfileDetails = (req, res, cb) => {
    cb();
};

const getMyProfileImage = (req, res, cb) => {
    cb();
};

const updateMyProfileDetails = (req, res, cb) => {
    const schema = joi.object().keys({
        name: joi.string(),
        password: joi.string(),
    });
    const { error } = joi.validate(req.body, schema);

    if (error) {
        res.status(422).send({
            success: false,
            error,
        });
    } else {
        cb();
    }
};

const updateMyProfileImage = (req, res, cb) => {
    const schema = joi.object().keys({
        send: joi.boolean(),
    });
    const { error } = joi.validate(req.query, schema);

    if (error) {
        res.status(422).send({
            success: false,
            error,
        });
    } else {
        cb();
    }
};

const logoutMe = (req, res, cb) => {
    const schema = joi.object().keys({
        refreshToken: joi.string().required(),
    });
    const { error } = joi.validate(req.body, schema);

    if (error) {
        res.status(422).send({
            success: false,
            error,
        });
    } else {
        cb();
    }
};

module.exports = {
    getMyAccessToken,
    getMyProfileDetails,
    getMyProfileImage,
    updateMyProfileDetails,
    updateMyProfileImage,
    logoutMe,
};
