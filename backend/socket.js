const socketIo = require('socket.io')
const roomsController = require('./controllers/rooms.controller')
const groupChatController = require('./controllers/groupChat.controller')

const configureSocketIo = (server) => {

    const io = socketIo(server);
     
    io.on('connection', (socket) => {
        console.log('Un utilisateur s\'est connecté : ', socket.id);

        socket.on('joinGroup', (groupId) => groupController.joinGroup(socket, groupId));
        socket.on('sendMessageToGroup', ({ groupId, message }) => groupController.sendMessageToGroup(socket, groupId, message, io));

        socket.on('sendPrivateMessage', ({ recipientId, message }) => privateMessageController.sendPrivateMessage(socket, recipientId, message, io));
        socket.on('acceptPrivateMessage', ({ messageId }) => privateMessageController.acceptPrivateMessage(socket, messageId, io));

        socket.on('disconnect', () => {
            console.log('user disconnected:', socket.id);
        })
    })

    return io
}

module.exports = configureSocketIo