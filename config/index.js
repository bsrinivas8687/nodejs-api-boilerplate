module.exports = {
    server: {
        address: process.env.ADDRESS || '127.0.0.1',
        port: process.env.PORT || 8000,
    },
    database: {
        xyz: {
            address: process.env.XYZ_DATABASE_ADDRESS || '127.0.0.1',
            port: process.env.XYZ_DATABASE_PORT || 27017,
            username: process.env.XYZ_DATABASE_USERNAME || '',
            password: process.env.XYZ_DATABASE_PASSWORD || '',
            name: process.env.XYZ_DATABASE_NAME || 'xyz',
        },
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'xyz',
    },
    cors: {
        origin: (process.env.CORS_ORIGIN && process.env.CORS_ORIGIN.split(',')) || ['*'],
    },
    sendGrid: {
        APIKey: process.env.SEND_GRID_API_KEY || '',
    },
};
