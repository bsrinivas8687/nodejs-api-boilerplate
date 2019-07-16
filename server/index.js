const async = require('async');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const database = require('../database');
const utils = require('./utils/server.util');

const init = (cb) => {
    async.waterfall([
        (next) => {
            database.init((error) => {
                if (error) {
                    console.error('Failed to initialize database connection!');
                    process.exit(1);
                } else {
                    console.log('');
                    next(null);
                }
            });
        }, (next) => {
            utils.getFiles([
                './server/models/*.js',
            ]).forEach((modelPath) => {
                console.log('modelPath', modelPath);
                require(path.resolve(modelPath));
            });

            console.log('');
            next(null);
        }, (next) => {
            const server = express();
            const corsOptions = {
                origin: '*',
                methods: 'GET, OPTIONS, PUT, POST, DELETE',
            };
            server.use(cors(corsOptions));
            server.use(bodyParser.json({
                limit: '1mb',
            }));
            server.use(bodyParser.urlencoded({
                limit: '1mb',
                extended: true,
            }));
            server.use(morgan(':date[clf] :method :url :status :res[content-length] - :response-time ms'));

            next(null, server);
        },
    ], (error, server) => {
        utils.getFiles([
            './server/routes/*.js',
        ]).forEach((routePath) => {
            console.log('routePath', routePath);
            require(path.resolve(routePath))(server);
        });

        console.log('');
        cb(error, server);
    });
};

module.exports = {
    init,
};
