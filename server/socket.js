const socketIo = require('socket.io');
const roomsController = require('./controllers/rooms.controller');
const groupChatService = require('./services/groupChat.service');

const configureSocketIo = (server) => {
    const io = socketIo(server, {
        cors: {
            origin: 'http://localhost:5173',
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log(`${socket.id} connected`);
        socket.emit('connection');

        socket.on('joinGroup', (groupId) => {
            socket.join(groupId);
            socket.emit('joinGroup');
            console.log(`${socket.id} joined group ${groupId}`);
        });

        socket.on('leaveGroup', (groupId) => {
            socket.leave(groupId);
            console.log(`${socket.id} left group ${groupId}`);
        });

        socket.on('privateMessage', async (message) => {
            const { content, groupId, sender } = message;

            // Enregistrer le message dans la base de données
            try {
                const savedMessage = await groupChatService.postMessage({ content, groupId, sender });
                io.to(groupId).emit('newPrivateMessage', savedMessage);
            } catch (error) {
                console.error('Erreur lors de l\'enregistrement du message privé:', error);
            }
        });

        socket.on('logout', () => {
            console.log(`${socket.id} logout`);
            socket.emit('logout');
        });
    });
};

module.exports = configureSocketIo;
