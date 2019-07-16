const joi = require('@hapi/joi');

const addUser = (req, res, cb) => {
    const schema = joi.object().keys({
        name: joi.string().required(),
        emailAddress: joi.string().required(),
        password: joi.string().required(),
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

const getUsers = (req, res, cb) => {
    cb();
};

module.exports = {
    addUser,
    getUsers,
};
