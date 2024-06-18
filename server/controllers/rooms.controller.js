const roomsService = require('../services/rooms.service');
const userService = require('../services/userService');

const roomsController = {

    // Permet à un utilisateur de rejoindre un salon
    joinRoom: async (req, res) => {
        try {
            const { userId, roomId } = req.body;

            // Appelle le service pour ajouter l'utilisateur au salon
            await roomsService.joinRoom(userId, roomId);

            // Répond avec un message de succès
            return res.status(200).json({ message: 'L\'utilisateur a bien rejoint le salon' });
        } catch (error) {
            console.error(error);
            // En cas d'erreur, renvoie une réponse 500 avec le message d'erreur
            return res.status(500).json({ message: 'Erreur pour rejoindre un salon', erreur: error });
        }
    },

    // Envoie un message dans un salon
    sendMessageToRoom: async (req, res) => {
        try {
            // Debugging console log
            console.log('PUTAIN DE MERDE JE VAIS ME TUER !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
            // console.log('AAAAAAAAAAAAAAAAAAA ' + req.body.roomId, req.body.sender, req.body.content);
            const { content, roomId, sender } = req.body;

            // Appelle le service pour envoyer un message au salon
            const messageResponse = await roomsService.sendMessageToRoom(content, roomId, sender);

            // Renvoie la réponse avec le message envoyé
            return res.status(200).json(messageResponse);
        } catch (error) {
            console.error(error);
            // En cas d'erreur, renvoie une réponse 500 avec le message d'erreur
            return res.status(500).json({ message: 'Erreur lors de l\'envoi du message', erreur: error });
        }
    },

    // Récupère les messages d'un salon
    getRoomMessages: async (req, res) => {
        try {
            const roomId = req.params.roomId;

            // Appelle le service pour obtenir les messages du salon
            const response = await roomsService.getRoomMessages(roomId);

            // Renvoie les messages du salon
            return res.status(200).json(response);
        } catch (error) {
            console.error(error);
            // En cas d'erreur, renvoie une réponse 500 avec le message d'erreur
            return res.status(500).json({ message: 'Erreur lors de la récupération des messages', erreur: error });
        }
    },

    // Crée un nouveau salon
    createRoom: async (req, res) => {
        try {
            const { name, description, category } = req.body;

            // Appelle le service pour créer un nouveau salon
            const response = await roomsService.createRoom(name, description, category);

            // Renvoie la réponse avec le salon créé
            return res.status(200).json(response);
        } catch (error) {
            console.error(error);
            // En cas d'erreur, renvoie une réponse 500 avec le message d'erreur
            return res.status(500).json({ message: 'Erreur lors de la création du salon', erreur: error });
        }
    },

    // Récupère tous les salons
    getAllRooms: async (req, res) => {
        try {
            // Appelle le service pour obtenir la liste de tous les salons
            const response = await roomsService.getAllRooms();

            // Renvoie la réponse avec la liste des salons
            return res.status(200).json(response);
        } catch (error) {
            console.error(error);
            // En cas d'erreur, renvoie une réponse 500 avec le message d'erreur
            return res.status(500).json({ message: 'Erreur lors de la récupération des salons', erreur: error });
        }
    }
};

module.exports = roomsController;
