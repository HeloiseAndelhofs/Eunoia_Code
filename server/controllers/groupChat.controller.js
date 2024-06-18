const groupChatService = require('../services/groupChat.service');
const utilityFunc = require('../services/utilityFunctions.service');

const groupChatController = {

    // Crée un nouveau groupe
    createGroup: async (req, res) => {
        try {
            const { groupName, membersName } = req.body;

            // Vérifie si le nom du groupe et les membres sont fournis
            if (!groupName || !membersName) {
                return res.status(400).json({ message: 'Nom du groupe et membres sont requis' });
            }

            const membersIds = [];

            // Récupère les identifiants des membres à partir de leurs noms
            for (const memberName of membersName) {
                const memberId = await utilityFunc.getUserId(memberName);
                if (memberId) {
                    membersIds.push(memberId);
                } else {
                    // Si un membre n'est pas trouvé, renvoie une erreur 404
                    return res.status(404).json({ message: `L'utilisateur ${memberName} n'a pas été trouvé.` });
                }
            }

            // Crée le groupe avec le nom et les identifiants des membres
            const resultGroup = await groupChatService.createGroup(groupName, membersIds);

            // Renvoie la réponse avec le groupe créé
            return res.status(200).json({ resultGroup });

        } catch (error) {
            console.error(error);
            // En cas d'erreur, renvoie une réponse 500 avec le message d'erreur
            return res.status(500).json({ message: 'Erreur pendant la création du chats', erreur: error });
        }
    },

    // Récupère tous les groupes d'un utilisateur
    getAllUserGroup: async (req, res) => {
        try {
            const userId = req.payload.userId;

            console.log(userId);
            const allUserGroup = await groupChatService.getAllUserGroup(userId);

            // Renvoie la liste des groupes de l'utilisateur
            return res.status(200).json(allUserGroup);

            // Si aucun groupe n'est trouvé, renvoie une erreur 404 (commenté car non utilisé)
            // return res.status(404).json({ message: 'Nous n\'avons pas trouvé de discussion associées à votre compte' });
        } catch (error) {
            console.error(error);
            // En cas d'erreur, renvoie une réponse 500 avec le message d'erreur
            return res.status(500).json({ message: 'Erreur pendant la récupération des chats.', erreur: error });
        }
    },

    // Récupère les messages d'un groupe
    getGroupMessages: async (req, res) => {
        try {
            const groupId = req.params.groupId;

            // Récupère les messages du groupe spécifié
            const data = await groupChatService.getGroupMessages(groupId);

            // Renvoie les messages du groupe
            return res.status(200).json(data);
        } catch (error) {
            console.error(error);
            // En cas d'erreur, renvoie une réponse 500 avec le message d'erreur
            return res.status(500).json({ message: 'Erreur lors de la récupération des messages', erreur: error });
        }
    },

    // Envoie un message dans un groupe
    postMessage: async (req, res) => {
        try {
            const { content, groupId, sender } = req.body;

            // Poste le message dans le groupe spécifié
            const postMessage = await groupChatService.postMessage({ content, groupId, sender });

            // Renvoie la réponse avec le message posté
            return res.status(200).json({ postMessage });
        } catch (error) {
            console.error(error);
            // En cas d'erreur, renvoie une réponse 500 avec le message d'erreur
            return res.status(500).json({ message: 'Erreur lors de l\'envoie du message.', erreur: error });
        }
    }
};

module.exports = groupChatController;
