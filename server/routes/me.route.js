const authenticate = require('../middlewares/auth.middleware');
const controller = require('../controllers/me.controller');
const validation = require('../validations/me.validation');

module.exports = (server) => {
    server.post('/me/access-token', validation.getMyAccessToken, controller.getMyAccessToken);
    server.get('/me/profile/details', authenticate, validation.getMyProfileDetails, controller.getMyProfileDetails);
    server.get('/me/profile/image', authenticate, validation.getMyProfileImage, controller.getMyProfileImage);
    server.put('/me/profile/details', authenticate, validation.updateMyProfileDetails, controller.updateMyProfileDetails);
    server.put('/me/profile/image', authenticate, validation.updateMyProfileImage, controller.updateMyProfileImage);
    server.post('/me/logout', validation.logoutMe, controller.logoutMe);
};
