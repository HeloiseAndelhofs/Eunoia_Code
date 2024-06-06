const socketIo = require('socket.io')
const roomsController = require('./controllers/rooms.controller')
const groupChatController = require('./controllers/groupChat.controller')

const configureSocketIo = (server) => {

    const io = socketIo(server);
     
    io.on('connection', (socket) => {
        console.log('Un utilisateur s\'est connecté : ', socket.id);

        socket.on('joinGroup', (roomId) => roomsController.joinRoom(socket, roomId));
        socket.on('sendMessageToGroup', ({ roomId, message }) => roomsController.sendMessageToRoom(socket, roomId, message, io));

        socket.on('sendPrivateMessage', ({ sender, message }) => groupChatController.sendPrivateMessage(socket, sender, message, io));
        socket.on('acceptPrivateMessage', ({ messageId }) => groupChatController.acceptPrivateMessage(socket, messageId, io));

        socket.on('disconnect', () => {
            console.log('user disconnected:', socket.id);
        })
    })

    return io
}

module.exports = configureSocketIo