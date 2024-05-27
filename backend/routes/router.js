const router = require('express').Router()
const userRouter = require('./users.router')

router.use('/search', userRouter)


module.exports = router