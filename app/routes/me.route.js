const isAuthenticated = require('../middlewares/auth.middleware');
const controller = require('../controllers/me.controller');
const validation = require('../validations/me.validation');

module.exports = (app) => {
    app.post('/me/access-token', validation.getMyAccessToken, controller.getMyAccessToken);
    app.get('/me/profile/details', isAuthenticated, validation.getMyProfileDetails, controller.getMyProfileDetails);
    app.get('/me/profile/image', isAuthenticated, validation.getMyProfileImage, controller.getMyProfileImage);
    app.put('/me/profile/details', isAuthenticated, validation.updateMyProfileDetails, controller.updateMyProfileDetails);
    app.put('/me/profile/image', isAuthenticated, validation.updateMyProfileImage, controller.updateMyProfileImage);
    app.post('/me/logout', validation.logoutMe, controller.logoutMe);
};
