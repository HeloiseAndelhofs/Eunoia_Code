const router = require('express').Router()
const userRouter = require('./users.router')
const eunoiaRouter = require('./eunoia.router')

//route pour login/register
router.use('/', userRouter)

//route pour tout ce qui peut se faire dans le salon principale (chercher un utilisateur, profil, messages,...)
router.use('/eunoia', eunoiaRouter)


module.exports = router


