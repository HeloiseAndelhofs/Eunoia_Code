const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET
const io = require('socket.io')

io.use((socket, next) => {
    const token = socket.handshake.auth.token
})

//je l'ai oublié lui