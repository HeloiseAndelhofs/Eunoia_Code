const sql = require('mssql')
const sqlConfig = require('../database')


//RAJOUTER POUR VOIR TOUS LES MEMBRES D'UN GROUP (NOMBRE,...)
//RAJOUTER UNE METHODE POUR CREER UN SALON
//RAJOUTER LES ADMINS


const roomsService = {

    joinRoom : async (userId, roomId) => {
        try {
            
            await sql.connect(sqlConfig)

            const request = new sql.Request()
            await request
                .input('userId', sql.Int, userId)
                .input('roomId', sql.Int, roomId)
                .input('joined_at', sql.Date, new Date())
                .query('INSERT INTO room_members (joined_at, room_id, user_id) VALUES (@joined_at, @roomId, @userId)')

        } catch (error) {
            console.error(error);
            throw new Error()
        }
    },

    sendMessageToRoom : async (roomId, senderId, message) => {
        try {
            await sql.connect(sqlConfig);
            const request = new sql.Request();
            await request
                .input('roomId', sql.Int, roomId)
                .input('sender', sql.Int, senderId)
                .input('content', sql.NVarChar, message)
                .input('send_at', sql.SmallDateTime, new Date())
                .query('INSERT INTO public_messages (room_id, user_id, content, send_at) VALUES (@group_chat_id, @sender, @content, @send_at)');
        } catch (error) {
            console.error("[sendMessageToRoom] Error sending message:", error.message);
            throw error;
        }
    },

    getRoomMessages : async (roomId) => {
        try {
            await sql.connect(sqlConfig);
            const request = new sql.Request();
            const result = await request
                .input('room_id', sql.Int, roomId)
                .query('SELECT * FROM public_messages WHERE room_id = @room_id');
            return result.recordset;
        } catch (error) {
            console.error("[getRoomMessages] Error getting group messages:", error.message);
            throw error;
        }
    }

}

module.exports = roomsService