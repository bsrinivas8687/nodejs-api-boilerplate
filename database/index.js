const async = require('async');
const mongoose = require('mongoose');
const xyzURI = require('./xyz');

const options = {
    poolSize: 16,
    reconnectTries: 600,
    reconnectInterval: 500,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
};

module.exports = {
    init: (cb) => {
        async.waterfall([
            (next) => {
                module.exports.xyz = mongoose.createConnection(xyzURI, options,
                    (error) => {
                        if (error) {
                            next(error);
                        } else {
                            console.log(`Connected to database: ${xyzURI}`);
                            next(null);
                        }
                    });
            },
        ], cb);
    },
};
