const async = require('async');
const userDBO = require('../dbos/user.dbo');
const userHelper = require('../helpers/user.helper');
const authUtil = require('../utils/auth.util');
const processJSONResponse = require('../utils/response.util');
const logger = require('../../logger');

const login = (req, res) => {
    const {
        emailAddress,
        password,
    } = req.body;

    async.waterfall([
        (next) => {
            userDBO.findOne({
                email_address: emailAddress,
            }, {
                password: true,
            }, {}, (error, result) => {
                if (error) {
                    logger.error(error);
                    next({
                        error,
                        message: 'Error occurred while finding the user.',
                    });
                } else if (result) {
                    next(null, result);
                } else {
                    next({
                        status: 400,
                        message: 'Email address does not exist.',
                    });
                }
            });
        }, (user, next) => {
            userHelper.comparePasswords(user.password, password, (error, result) => {
                if (error) {
                    logger.error(error);
                    next({
                        error,
                        message: 'Error occurred while comparing the passwords.',
                    });
                } else if (result) {
                    next(null, user);
                } else {
                    next({
                        status: 400,
                        message: 'Passwords do not match.',
                    });
                }
            });
        }, (user, next) => {
            const payload = {
                _id: user._id,
            };
            const remoteAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            const accessToken = authUtil.generateAccessToken(payload);
            const refreshToken = authUtil.generateRefreshToken(payload);

            userDBO.findOneAndUpdate({
                _id: user._id,
            }, {
                $addToSet: {
                    login_infos: {
                        access_token: accessToken,
                        refresh_token: refreshToken,
                        remote_address: remoteAddress,
                    },
                },
            }, {}, (error) => {
                if (error) {
                    logger.error(error);
                    next({
                        error,
                        message: 'Error occurred while updating the user.',
                    });
                } else {
                    next(null, {
                        status: 200,
                        result: {
                            access_token: accessToken,
                            refresh_token: refreshToken,
                        },
                    });
                }
            });
        },
    ], (error, result) => {
        processJSONResponse(res, error, result);
    });
};

module.exports = {
    login,
};
