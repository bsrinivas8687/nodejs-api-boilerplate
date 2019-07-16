const async = require('async');
const userDBO = require('../dbos/user.dbo');
const userHelper = require('../helpers/user.helper');
const authUtil = require('../utils/auth.util');
const processJSONResponse = require('../utils/response.util');

const addUser = (req, res) => {
    const {
        name,
        emailAddress,
        password,
    } = req.body;

    async.waterfall([
        (next) => {
            userHelper.hashPassword(password,
                (error, hashedPassword) => {
                    if (error) {
                        console.log(error);
                        next({
                            error,
                            message: 'Error occurred while hashing the password.',
                        });
                    } else {
                        next(null, hashedPassword);
                    }
                });
        }, (hashedPassword, next) => {
            userDBO.save({
                name: name,
                email_address: emailAddress,
                password: hashedPassword,
            }, (error, result) => {
                if (error) {
                    console.log(error);
                    next({
                        error,
                        message: 'Error occurred while saving the user.',
                    });
                } else {
                    next(null, result['_id']);
                }
            });
        }, (_id, next) => {
            const payload = { _id };
            const remoteAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            const accessToken = authUtil.generateAccessToken(payload);
            const refreshToken = authUtil.generateRefreshToken(payload);

            userDBO.findOneAndUpdate({
                _id,
            }, {
                $addToSet: {
                    login_infos: {
                        access_token: accessToken,
                        refresh_token: refreshToken,
                        remote_address: remoteAddress,
                    },
                },
            }, {
                new: true,
            }, (error, result) => {
                if (error) {
                    console.log(error);
                    next({
                        error,
                        message: 'Error occurred while updating the user.',
                    });
                } else {
                    result = result.toObject();
                    delete (result['password']);
                    delete (result['profile_image']);
                    delete (result['login_infos']);
                    delete (result['__v']);

                    next(null, {
                        status: 201,
                        result: Object.assign(result, {
                            access_token: accessToken,
                            refresh_token: refreshToken,
                        }),
                    });
                }
            });
        },
    ], (error, result) => {
        processJSONResponse(res, error, result);
    });
};

const getUsers = (req, res) => {
    async.waterfall([
        (next) => {
            userDBO.find({},
                {
                    password: false,
                    profile_image: false,
                    login_infos: false,
                    __v: false,
                }, {}, (error, result) => {
                    if (error) {
                        console.log(error);
                        next({
                            error,
                            message: 'Error occurred while finding the users.',
                        });
                    } else {
                        next(null, {
                            status: 200,
                            result,
                        });
                    }
                });
        },
    ], (error, result) => {
        processJSONResponse(res, error, result);
    });
};

module.exports = {
    addUser,
    getUsers,
};
