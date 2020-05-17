const isAuthenticated = require('../middlewares/auth.middleware');
const controller = require('../controllers/user.controller');
const validation = require('../validations/user.validation');

module.exports = (app) => {
    app.post('/users', validation.addUser, controller.addUser);
    app.get('/users', isAuthenticated, validation.getUsers, controller.getUsers);
};
