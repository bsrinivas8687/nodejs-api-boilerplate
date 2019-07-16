const async = require('async');
const path = require('path');
const userDBO = require('../dbos/user.dbo');
const userHelper = require('../helpers/user.helper');
const authUtil = require('../utils/auth.util');
const processJSONResponse = require('../utils/response.util');

const getMyAccessToken = (req, res) => {
    const { refreshToken } = req.body;

    async.waterfall([
        (next) => {
            authUtil.verifyJWT(refreshToken,
                (error, result) => {
                    if (error) {
                        console.log(error);
                        next({
                            error,
                            message: 'Error occurred while verifying the JWT token.',
                        });
                    } else {
                        next(null, result['_id']);
                    }
                });
        }, (_id, next) => {
            const payload = { _id };
            const accessToken = authUtil.generateAccessToken(payload);

            userDBO.findOneAndUpdate({
                _id,
                'login_infos.refresh_token': refreshToken,
            }, {
                $set: {
                    'login_infos.$.access_token': accessToken,
                    'login_infos.$.modified_at': Date.now(),
                },
            }, {}, (error, result) => {
                if (error) {
                    console.log(error);
                    next({
                        error,
                        message: 'Error occurred while finding the user.',
                    });
                } else if (result) {
                    next(null, {
                        status: 200,
                        result: {
                            access_token: accessToken,
                        },
                    });
                } else {
                    next({
                        status: 400,
                        message: 'Refresh token does not exist.',
                    });
                }
            });
        },
    ], (error, result) => {
        processJSONResponse(res, error, result);
    });
};

const getMyProfileDetails = (req, res) => {
    const { _id } = req.user;

    async.waterfall([
        (next) => {
            userDBO.findOne({
                _id,
            }, {
                password: false,
                profile_image: false,
                login_infos: false,
                __v: false,
            }, {}, (error, result) => {
                if (error) {
                    console.log(error);
                    next({
                        error,
                        message: 'Error occurred while finding the user.',
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

const getMyProfileImage = (req, res) => {
    const { _id } = req.user;

    async.waterfall([
        (next) => {
            userDBO.findOne({
                _id,
            }, {
                profile_image: true,
            }, {}, (error, result) => {
                if (error) {
                    console.log(error);
                    next({
                        error,
                        message: 'Error occurred while finding the user.',
                    });
                } else {
                    next(null, result['profile_image']);
                }
            });
        },
    ], (error, profileImage) => {
        if (error) {
            processJSONResponse(res, error, null);
        } else {
            const profileImagePath = path.resolve(path.join(profileImage['destination'], profileImage['name']));
            res.sendFile(profileImagePath);
        }
    });
};

const updateMyProfileDetails = (req, res) => {
    const { _id } = req.user;
    const {
        name,
        password,
    } = req.body;

    const updates = {
        modified_at: Date.now(),
    };
    if (name) updates['name'] = name;

    async.waterfall([
        (next) => {
            if (password) {
                userHelper.hashPassword(password,
                    (error, hashedPassword) => {
                        if (error) {
                            console.log(error);
                            next({
                                error,
                                message: 'Error occurred while hashing the password.',
                            });
                        } else {
                            updates['password'] = hashedPassword;
                            next(null);
                        }
                    });
            } else {
                next(null);
            }
        }, (next) => {
            userDBO.findOneAndUpdate({
                _id,
            }, {
                $set: updates,
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
                    delete (result['profile_password']);
                    delete (result['profile_image']);
                    delete (result['login_infos']);
                    delete (result['__v']);

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

const updateMyProfileImage = (req, res) => {
    const { _id } = req.user;

    async.waterfall([
        (next) => {
            userHelper.saveProfileImage(req, res,
                (error) => {
                    if (error) {
                        console.log(error);
                        next({
                            error,
                            message: 'Error occurred while saving the profile image.',
                        });
                    } else {
                        next(null);
                    }
                });
        }, (next) => {
            if (req.file) {
                next(null);
            } else {
                next({
                    status: 400,
                    message: 'No profile image data received from the request.',
                });
            }
        }, (next) => {
            userDBO.findOneAndUpdate({
                _id,
            }, {
                $set: {
                    'profile_image.name': req.file.filename,
                    'profile_image.destination': req.file.destination,
                    'profile_image.MIME_type': req.file.mimetype,
                    'profile_image.modified_at': Date.now(),
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
                    next(null, result['profile_image']);
                }
            });
        },
    ], (error, profileImage) => {
        if (error) {
            processJSONResponse(res, error, null);
        } else if (req.query['send']) {
            const profileImagePath = path.resolve(path.join(profileImage['destination'], profileImage['name']));
            res.sendFile(profileImagePath);
        } else {
            processJSONResponse(res, null, {
                status: 200,
            });
        }
    });
};

const logoutMe = (req, res) => {
    const { _id } = req.user;
    const { refreshToken } = req.body;

    async.waterfall([
        (next) => {
            userDBO.findOneAndUpdate({
                _id,
            }, {
                $pull: {
                    login_infos: {
                        $elemMatch: {
                            refresh_token: refreshToken,
                        },
                    },
                },
            }, {}, (error) => {
                if (error) {
                    console.log(error);
                    next({
                        error,
                        message: 'Error occurred while updating the user.',
                    });
                } else {
                    next(null, {
                        status: 200,
                    });
                }
            });
        },
    ], (error, result) => {
        processJSONResponse(res, error, result);
    });
};

module.exports = {
    getMyAccessToken,
    getMyProfileDetails,
    getMyProfileImage,
    updateMyProfileDetails,
    updateMyProfileImage,
    logoutMe,
};
