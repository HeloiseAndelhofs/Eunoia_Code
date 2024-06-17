const roomsService = require('../services/rooms.service')
const userService = require('../services/userService')

const roomsController =  {

    joinRoom : async (req, res) => {
        try {
            const { userId, roomId } = req.body;

            await roomsService.joinRoom(userId, roomId)

            return res.status(200).json({mesage : 'L\'utilisateur a bien rejoin le salon'})
        } catch (error) {
            console.error(error);
            return res.status(500).json({message : 'Erreur pour rejoindre un salon', erreur : error}) 
        }
    },

    sendMessageToRoom : async (req, res) => {

        try {
            const {roomId, senderId, message} = req.body

            const messageResponse = await roomsService.sendMessageToRoom(roomId, senderId, message)

            return res.status(200).json(messageResponse)
        } catch (error) {
            console.error(error);
            return res.status(500).json({message : 'Erreur lors de l\'envoie du message', erreur : error}) 
        }

    },

    getRoomMessages : async (req, res) => {
        try {
            const roomId = req.params

            const response = await roomsService.getRoomMessages(roomId)

            return res.status(200).json(response)

        } catch (error) {
            console.error(error);
            return res.status(500).json({message : 'Erreur lors de la récupération des messages', erreur : error}) 
        }
    },

    createRoom : async (req, res) => {
        try {
            const {name, description, category} = req.body

            const response = await roomsService.createRoom(name, description, category)

            return res.status(200).json(response)
        } catch (error) {
            console.error(error);
            return res.status(500).json({message : 'Erreur lors de la création du salon', erreur : error})  
        }
    },

    getAllRooms : async (req, res) => {
        try {
            const response = await roomsService.getAllRooms()

            return res.status(200).json(response)
        } catch (error) {
            console.error(error);
            return res.status(500).json({message : 'Erreur lors de la récupération des salons', erreur : error}) 
        }
    }


}

module.exports = roomsController