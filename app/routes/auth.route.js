const controller = require('../controllers/auth.controller');
const validation = require('../validations/auth.validation');

module.exports = (app) => {
    app.post('/login', validation.login, controller.login);
};
