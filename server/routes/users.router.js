const router = require('express').Router();
const userController = require('../controllers/user.controller');
const jwtVerification =require('../middleware/jwtVerification')



router.post('/register',  userController.registerStep1);
router.post('/register/step2', userController.registerStep2)
router.post('/login', jwtVerification, userController.login)


module.exports = router