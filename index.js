const config = require('./config').server;
const app = require('./app');
const logger = require('./logger');

app.init((error, instance) => {
    if (error) {
        logger.error(error);
        process.exit(1);
    } else {
        instance.listen(config.port);
        logger.info(`Server is running on port: ${config.port}`);
    }
});
