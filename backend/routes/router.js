const router = require('express').Router()
const userRouter = require('./users.router')

router.use('/wanted', userRouter)


module.exports = router