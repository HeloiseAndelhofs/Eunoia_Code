const sql = require('mssql')
const sqlConfig = require('../database')

// Service pour gérer les opérations liées aux salons (rooms)
const roomsService = {

    // Fonction pour rejoindre un salon
    joinRoom: async (userId, roomId) => {
        try {
            // Connexion à la base de données
            await sql.connect(sqlConfig)

            // Création d'une nouvelle requête SQL
            const request = new sql.Request()
            await request
                .input('userId', sql.Int, userId) // Ajout du paramètre userId
                .input('roomId', sql.Int, roomId) // Ajout du paramètre roomId
                .input('joined_at', sql.Date, new Date()) // Ajout de la date actuelle pour la colonne joined_at
                .query('INSERT INTO room_members (joined_at, room_id, user_id) VALUES (@joined_at, @roomId, @userId)') // Requête d'insertion

        } catch (error) {
            console.error(error);
            throw new Error()
        }
    },

    // Fonction pour envoyer un message dans un salon
    sendMessageToRoom: async (content, roomId, sender) => {
        try {
            // Connexion à la base de données
            await sql.connect(sqlConfig);

            // Création d'une nouvelle requête SQL
            const request = new sql.Request();
            const result = await request
                .input('roomId', sql.Int, roomId) // Ajout du paramètre roomId
                .input('sender', sql.Int, sender) // Ajout du paramètre sender
                .input('content', sql.NVarChar, content) // Ajout du paramètre content
                .input('send_at', sql.SmallDateTime, new Date()) // Ajout de la date actuelle pour la colonne send_at
                .query('INSERT INTO public_messages (room_id, user_id, content, send_at) OUTPUT INSERTED.* VALUES (@roomId, @sender, @content, @send_at)'); // Requête d'insertion avec récupération des valeurs insérées

            console.log(result.recordset[0]);
            return result.recordset[0]
        } catch (error) {
            console.error("[sendMessageToRoom] Error sending message:", error.message);
            throw error;
        }
    },

    // Fonction pour récupérer les messages d'un salon
    getRoomMessages: async (roomId) => {
        try {
            // Connexion à la base de données
            await sql.connect(sqlConfig);

            // Création d'une nouvelle requête SQL pour récupérer les messages
            const request = new sql.Request();
            const messagesRes = await request
                .input('room_id', sql.Int, roomId) // Ajout du paramètre roomId
                .query('SELECT * FROM public_messages WHERE room_id = @room_id'); // Requête de sélection des messages

            // Création d'une nouvelle requête SQL pour récupérer le nom du salon
            const room = await new sql.Request()
                .input('roomId', sql.Int, roomId) // Ajout du paramètre roomId
                .query('SELECT name FROM rooms WHERE room_id = @roomId') // Requête de sélection du nom du salon

            const messages = messagesRes.recordset
            const roomName = room.recordset[0].name

            console.log(messages);
            console.log(roomName);
            return { messages, roomName };
        } catch (error) {
            console.error("[getRoomMessages] Error getting group messages:", error.message);
            throw error;
        }
    },

    // Fonction pour créer un nouveau salon
    createRoom: async (name, description, category) => {
        try {
            // Connexion à la base de données
            await sql.connect(sqlConfig);

            // Création d'une nouvelle requête SQL
            const request = new sql.Request();
            const result = await request
                .input('name', sql.NVarChar, name) // Ajout du paramètre name
                .input('description', sql.NVarChar, description) // Ajout du paramètre description
                .input('category', sql.NVarChar, category) // Ajout du paramètre category
                .input('created_at', sql.Date, new Date()) // Ajout de la date actuelle pour la colonne created_at
                .query('INSERT INTO rooms (name, description, category, created_at) VALUES (@name, @description, @category, @created_at); SELECT SCOPE_IDENTITY() as room_id'); // Requête d'insertion avec récupération de l'ID généré

            return result.recordset[0].room_id; // Retourne l'ID du salon créé
        } catch (error) {
            console.error("[createRoom] Error creating room:", error.message);
            throw error;
        }
    },

    // Fonction pour récupérer tous les salons
    getAllRooms: async () => {
        try {
            // Connexion à la base de données
            await sql.connect(sqlConfig);

            // Création d'une nouvelle requête SQL
            const request = new sql.Request();
            const result = await request.query('SELECT * FROM rooms'); // Requête de sélection de tous les salons

            return result.recordset; // Retourne les salons
        } catch (error) {
            console.error("[getAllRooms] Error getting all rooms:", error.message);
            throw error;
        }
    }
}

// Exportation du service pour pouvoir l'utiliser dans d'autres parties de l'application
module.exports = roomsService
