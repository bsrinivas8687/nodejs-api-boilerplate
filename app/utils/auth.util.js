const jwt = require('jsonwebtoken');
const config = require('../../config').jwt;

const generateJWT = (payload, expiresIn) => {
    return jwt.sign(payload, config.secret, {
        algorithm: 'HS256',
        expiresIn,
    });
};

const generateAccessToken = (payload) => {
    return generateJWT(payload, 2 * 60 * 60);
};

const generateRefreshToken = (payload) => {
    return generateJWT(payload, 30 * 24 * 60 * 60);
};

const verifyJWT = (token, cb) => {
    jwt.verify(token, config.secret, (error, decoded) => {
        if (error) {
            cb(error);
        } else {
            cb(null, decoded);
        }
    });
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyJWT,
};
