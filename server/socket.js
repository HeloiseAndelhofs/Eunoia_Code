const socketIo = require('socket.io');
const roomsController = require('./controllers/rooms.controller');
const groupChatController = require('./controllers/groupChat.controller');

const configureSocketIo = (server) => {
    const io = socketIo(server, {
        cors: {
            origin: 'http://localhost:5173',
            credentials: true
        }
    });

    io.on('connection', socket => {
        console.log(`${socket.id} connected`);
        socket.emit('connection')


        
        socket.on('logout', () => {
            console.log(`${socket.id} logout`);
            socket.emit('logout')
        }); 

    });
};

module.exports = configureSocketIo;
