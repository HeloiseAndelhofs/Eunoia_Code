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
        console.log(`${socket.id} connecté`);
        socket.emit('connection');

        socket.on('joinGroup', (groupName) => {
            socket.join(groupName);
            socket.emit('joinGroup');
            console.log(`${socket.id} a rejoint le groupe ${groupName}`);
        });

        socket.on('leaveGroup', (groupName) => {
            socket.leave(groupName);
            console.log(`${socket.id} left group ${groupName}`);
        });

        socket.on('privateMessage', async (message) => {
            const { content, groupName, sender, groupId } = message;

            // Enregistrer le message dans la base de données
            try {
                const savedMessage = await groupChatService.postMessage({ content, groupId, sender });
                console.log(`Saved message: ${savedMessage.content}`);
          
                console.log(`${savedMessage} a été envoyé au groupe ${groupName}`);
                console.log(savedMessage);

                io.emit('receivePrivateMessage', savedMessage)
            } catch (error) {
                console.error('Erreur lors de l\'enregistrement du message privé:', error);
            }
        });

        socket.on('logout', () => {
            console.log(`${socket.id} déconnecté`);
            socket.emit('logout');
        });
    });
};

module.exports = configureSocketIo;
