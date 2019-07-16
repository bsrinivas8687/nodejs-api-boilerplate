const authenticate = require('../middlewares/auth.middleware');
const controller = require('../controllers/user.controller');
const validation = require('../validations/user.validation');

module.exports = (server) => {
    server.post('/users', validation.addUser, controller.addUser);
    server.get('/users', authenticate, validation.getUsers, controller.getUsers);
};
