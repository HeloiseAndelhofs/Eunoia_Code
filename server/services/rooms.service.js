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

    sendMessageToRoom : async (content, roomId, sender) => {
        try {
            await sql.connect(sqlConfig);
            const request = new sql.Request();
            const result = await request
                .input('roomId', sql.Int, roomId)
                .input('sender', sql.Int, sender)
                .input('content', sql.NVarChar, content)
                .input('send_at', sql.SmallDateTime, new Date())
                .query('INSERT INTO public_messages (room_id, user_id, content, send_at) OUTPUT INSERTED.* VALUES (@roomId, @sender, @content, @send_at)');

                console.log(result.recordset[0]);
                return result.recordset[0]
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
    },

    createRoom : async (name, description, category) => {
        try {
            await sql.connect(sqlConfig);
            const request = new sql.Request();
            const result = await request
                .input('name', sql.NVarChar, name)
                .input('description', sql.NVarChar, description)
                .input('category', sql.NVarChar, category)
                .input('created_at', sql.Date, new Date())
                .query('INSERT INTO rooms (name, description, category, created_at) VALUES (@name, @description, @category, @created_at); SELECT SCOPE_IDENTITY() as room_id');
            return result.recordset[0].room_id;
        } catch (error) {
            console.error("[createRoom] Error creating room:", error.message);
            throw error;
        }
    },

    getAllRooms : async () => {
        try {
            await sql.connect(sqlConfig);
            const request = new sql.Request();
            const result = await request.query('SELECT * FROM rooms');
            return result.recordset;
        } catch (error) {
            console.error("[getAllRooms] Error getting all rooms:", error.message);
            throw error;
        }
    }

}

module.exports = roomsService