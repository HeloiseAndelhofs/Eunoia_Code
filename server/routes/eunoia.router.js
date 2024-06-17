const router = require('express').Router();
const userController = require('../controllers/user.controller');
const jwtVerification = require('../middleware/jwtVerification')
const groupChatController = require('../controllers/groupChat.controller')
const roomsController = require('../controllers/rooms.controller');

router.get('/profile', jwtVerification, userController.getYourProfile)
router.put('/profile/edit', jwtVerification, userController.updateUserProfile)
router.delete('/profile', jwtVerification, userController.archiveUser)



router.get('/settings', jwtVerification, userController.getUserSettings);
router.put('/settings/email', jwtVerification, userController.updateUserEmail);
router.put('/settings/password', jwtVerification, userController.updateUserPassword);


router.get('/search', userController.getUserByName);

router.post('/createGroup', jwtVerification, groupChatController.createGroup)
router.get('/message', jwtVerification, groupChatController.getAllUserGroup)
router.get('/message/:groupId', jwtVerification, groupChatController.getGroupMessages)
router.post('/message/:groupId', jwtVerification, groupChatController.postMessage)


router.get('/rooms', jwtVerification, roomsController.getAllRooms)
router.post('/createRoom', jwtVerification, roomsController.createRoom)
router.get('/rooms/:roomId', jwtVerification, roomsController.getRoomMessages)
router.post('/rooms/:roomId', jwtVerification, roomsController.sendMessageToRoom)
router.post('/rooms', jwtVerification, roomsController.joinRoom)

module.exports = router