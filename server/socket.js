const socketIo = require('socket.io');
const groupChatService = require('./services/groupChat.service');
const roomsService = require('./services/rooms.service');
const utilityFuncService = require('./services/utilityFunctions.service')

const configureSocketIo = (server) => {
    const io = socketIo(server, {
        cors: {
            origin: 'http://localhost:5173',
            credentials: true
        }
    });

    const users = {};

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

                const user = await utilityFuncService.selectUserById(sender)
                const username = user.username
          
                const formattedMessage = {
                    private_message_id: savedMessage.private_message_id,
                    content: savedMessage.content,
                    send_at: savedMessage.send_at,
                    group_id: savedMessage.group_id,
                    user_id: savedMessage.user_id,
                    username: username
                };

                console.log(`${formattedMessage} a été envoyé au groupe ${groupName}`);
                console.log(formattedMessage);

                io.emit('receivePrivateMessage', formattedMessage)
            } catch (error) {
                console.error('Erreur lors de l\'enregistrement du message privé:', error);
            }
        });

        socket.on('joinEunoia', ({ userId, roomId }) => {
            socket.join(roomId);
            users[socket.id] = userId;
            socket.emit('userConnected', userId);
        });
    
        socket.on('publicMessage', async ( message ) => {
            const { content, sender, roomId } = message;

            console.log(content, sender, roomId + ' IUEZGHFDEIUZDFGZEAIUDFHEIUZGDFLAUZEGI');
            try {
                const savedMessage = await roomsService.sendMessageToRoom( content, roomId, sender );

                const user = await utilityFuncService.selectUserById(sender)
                const username = user.username

                const formattedMessage = {
                    public_message_id: savedMessage.public_message_id,
                    content: savedMessage.content,
                    send_at: savedMessage.send_at,
                    room_id: savedMessage.room_id,
                    user_id: savedMessage.user_id,
                    username: username
                };

                io.emit('receiveEunoiaMessage', formattedMessage);
                console.log({savedMessage, username});
            } catch (error) {
                console.error('Erreur lors de l\'enregistrement du message public:', error);
            }
        });

        socket.on('logout', () => {
            console.log(`${socket.id} déconnecté`);
            socket.emit('logout');
        });
    });
};

module.exports = configureSocketIo;
