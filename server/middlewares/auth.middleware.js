const async = require('async');
const userDBO = require('../dbos/user.dbo');
const { verifyJWT } = require('../utils/auth.util');
const processJSONResponse = require('../utils/response.util');

const authenticate = (req, res, cb) => {
    let token = null;
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
        token = req.query.token;
    }

    async.waterfall([
        (next) => {
            if (token) {
                verifyJWT(token,
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
            } else {
                next({
                    status: 400,
                    message: 'JWT token is required for this request.',
                });
            }
        }, (_id, next) => {
            userDBO.findOne({
                _id,
                'login_infos.access_token': token,
            }, {}, {}, (error, result) => {
                if (error) {
                    console.log(error);
                    next({
                        error,
                        message: 'Error occurred while finding the user.',
                    });
                } else if (result) {
                    req.user = result;
                    next(null);
                } else {
                    next({
                        status: 400,
                        message: 'User Id and token combination does not exist.',
                    });
                }
            });
        },
    ], (error) => {
        if (error) {
            processJSONResponse(res, error);
        } else {
            cb();
        }
    });
};

module.exports = authenticate;
