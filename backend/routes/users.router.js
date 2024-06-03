const router = require('express').Router();
const { JsonWebTokenError } = require('jsonwebtoken');
const userController = require('../controllers/user.controller');
const jwtVerification =require('../middleware/jwtVerification')



router.post('/register',  userController.register);
router.post('/login', jwtVerification, userController.login)


module.exports = router