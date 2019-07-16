const db = {
    address: process.env.DATABASE_ADDRESS || '127.0.0.1',
    port: process.env.DATABASE_PORT || 27017,
    username: process.env.DATABASE_USERNAME || '',
    password: process.env.DATABASE_PASSWORD || '',
    name: process.env.DATABASE_NAME || 'xyz',
};

let URL = `mongodb://${db.address}:${db.port}/${db.name}`;
if (db.username.length && db.password.length) {
    URL = `mongodb://${db.username}:${db.password}@${db.address}:${db.port}/${db.name}`;
}

module.exports = URL;
