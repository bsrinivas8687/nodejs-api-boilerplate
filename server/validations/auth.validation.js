const joi = require('@hapi/joi');

const login = (req, res, cb) => {
    const schema = joi.object().keys({
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

module.exports = {
    login,
};
