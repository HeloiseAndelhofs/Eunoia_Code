const router = require('express').Router();
const userController = require('../controllers/user.controller');
const jwtVerification = require('../middleware/jwtVerification')
const groupChatController = require('../controllers/groupChat.controller')

router.get('/profile', jwtVerification, userController.getYourProfile)
router.put('/profile/edit', jwtVerification, userController.updateUserProfile)
router.delete('/profile', jwtVerification, userController.archiveUser)


//mettre delete dans settings ?
router.get('/settings', jwtVerification, userController.getUserSettings);
router.put('/settings/email', jwtVerification, userController.updateUserEmail);
router.put('/settings/password', jwtVerification, userController.updateUserPassword);


router.get('/search', userController.getUserByName);

router.get('/message', groupChatController.getAllUserGroup)
router.get('/message/:groupId', groupChatController.getGroupMessages)
router.post('/message/:groupId', groupChatController.postMessage)

module.exports = router