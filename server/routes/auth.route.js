const controller = require('../controllers/auth.controller');
const validation = require('../validations/auth.validation');

module.exports = (server) => {
    server.post('/login', validation.login, controller.login);
};
