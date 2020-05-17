const { xyz } = require('../config').database;

let URL = `mongodb://${xyz.address}:${xyz.port}/${xyz.name}`;
if (xyz.username && xyz.password) {
    URL = `mongodb://${xyz.username}:${xyz.password}@${xyz.address}:${xyz.port}/${xyz.name}`;
}

module.exports = URL;
