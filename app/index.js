const async = require('async');
const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const database = require('../database');
const utils = require('./utils/file.util');
const { origin } = require('../config').cors;
const processJSONResponse = require('./utils/response.util');
const logger = require('../logger');

const morganFormat = ':remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms ":referrer" ":user-agent"';

const corsOptions = (req, cb) => {
    if (origin[0] === '*') {
        cb(null, true);
    } else if (origin.indexOf(req.header('Origin')) !== -1) {
        cb(null, {
            origin: true,
        });
    } else {
        // eslint-disable-next-line standard/no-callback-literal
        cb({
            status: 403,
            message: 'Request not allowed by CORS.',
        });
    }
};

const init = (cb) => {
    async.waterfall([
        (next) => {
            database.init((error) => {
                if (error) {
                    logger.error('Failed to initialize database connection!');
                    next(error);
                } else {
                    next(null);
                }
            });
        }, (next) => {
            utils.getFiles([
                './app/models/*.model.js',
            ]).forEach((modelPath) => {
                logger.info(`modelPath ${modelPath}`);
                require(path.resolve(modelPath));
            });

            logger.info('');
            next(null);
        }, (next) => {
            const app = express();
            app.use(cors(corsOptions));
            app.use((error, req, res, _) => {
                logger.error(error);
                processJSONResponse(res, error);
            });

            app.use(compression());
            app.use(bodyParser.json({
                limit: '1mb',
            }));
            app.use(bodyParser.urlencoded({
                limit: '1mb',
                extended: true,
            }));
            app.use(morgan(morganFormat, {
                stream: logger.stream,
            }));

            next(null, app);
        }, (app, next) => {
            utils.getFiles([
                './app/routes/*.route.js',
            ]).forEach((routePath) => {
                logger.info(`routePath ${routePath}`);
                require(path.resolve(routePath))(app);
            });

            logger.info('');
            next(null, app);
        },
    ], cb);
};

module.exports = {
    init,
};
