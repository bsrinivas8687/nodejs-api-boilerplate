const config = require('./config/vars').server;
const server = require('./server');

server.init((error, serverInstance) => {
    if (error) {
        console.log(error);
    } else {
        serverInstance.listen(config.port);
        console.log(`Server is running on port: ${config.port}`);
    }
});
