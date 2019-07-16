const server = {
    port: process.env.PORT || 8000,
};

const jwt = {
    secret: process.env.JWT_SECRET || 'xyz',
};

const sendGrid = {
    APIKey: process.env.SEND_GRID_API_KEY || '',
};

module.exports = {
    server,
    jwt,
    sendGrid,
};
