const socketIo = require('socket.io');
const groupChatService = require('./services/groupChat.service');
const roomsService = require('./services/rooms.service');
const utilityFuncService = require('./services/utilityFunctions.service');

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

        // group chat !!
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

                io.to(groupName).emit('receivePrivateMessage', formattedMessage)
            } catch (error) {
                console.error('Erreur lors de l\'enregistrement du message privé:', error);
            }
        });

        //fin group chat !!

        //rooms
        socket.on('joinRoom', (roomName) => {
            socket.join(roomName)
            //socket.emmit('connection')
        })

        socket.on('publicMessage', async (message) => {
            const { content, sender, roomId, roomName } = message;

            try {
                const savedMessage = await roomsService.sendMessageToRoom( content, roomId, sender );

                const user = await utilityFuncService.selectUserById(sender)
                const username = user.username

                const result = {
                    public_message_id: savedMessage.public_message_id,
                    content: savedMessage.content,
                    send_at: savedMessage.send_at,
                    room_id: savedMessage.room_id,
                    user_id: savedMessage.user_id,
                    username: username
                }
                io.to(roomName).emit('publicMessage', result)
                console.log(result);
            } catch (error) {
                console.error('Erreur lors de l\'enregistrement du message public:', error);
            }
        })

        socket.on('logout', () => {
            console.log(`${socket.id} déconnecté`);
            socket.emit('logout');
        });
    });
};

module.exports = configureSocketIo;
