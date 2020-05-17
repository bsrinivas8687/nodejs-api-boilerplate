const async = require('async');
const mongoose = require('mongoose');
const xyzURI = require('./xyz');
const logger = require('../logger');

const options = {
    poolSize: 16,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
};

module.exports = {
    init: (cb) => {
        async.waterfall([
            (next) => {
                module.exports.xyz = mongoose.createConnection(xyzURI, options, (error) => {
                    if (error) {
                        next(error);
                    } else {
                        logger.info(`Connected to database: ${xyzURI}`);
                        next(null);
                    }
                });
            },
        ], cb);
    },
};
