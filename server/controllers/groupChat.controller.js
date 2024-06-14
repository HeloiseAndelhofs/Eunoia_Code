const groupChatService = require('../services/groupChat.service')
const utilityFunc = require('../services/utilityFunctions.service')


const groupChatController = {

    createGroup : async (req, res) => {
        try {
            const { groupName, membersName } = req.body

            if (!groupName || !membersName) {
                return res.status(400).json({ message: 'Nom du groupe et membres sont requis' });
            }

            const membersIds = []

            for (const memberName of membersName) {
                const memberId = await utilityFunc.getUserId(memberName)
                if (memberId) {
                    membersIds.push(memberId)
                } else {
                    return res.status(404).json({message : `L\'utilisateur ${memberName} n\'a pas été trouvé.`})
                }
            }

            const resultGroup = await groupChatService.createGroup(groupName, membersIds)

            return res.status(200).json({resultGroup})

        } catch (error) {
            console.error(error);
            return res.status(500).json({message : 'Erreur pendant la création du chats', erreur : error})    
        }
    }, 

    getAllUserGroup : async (req, res) => {
        try {
            const userId = req.token.userId

            const allUserGroup = await groupChatService.getAllUserGroup(userId)

            if (allUserGroup) {
                return res.status(200).json({userGroup : allUserGroup})
            }

            return res.status(404).json({message : 'Nous n\'avons pas trouvé de discussion associées à votyre compte'})
        } catch (error) {
            console.error(error);
            return res.status(500).json({message : 'Erreur pendant la récupération des chats.', erreur : error})
        }
    },

    getGroupMessages : async (req, res) => {
        try {
            const groupId = req.params.groupId

            const message =  await groupChatService.getGroupMessages(groupId)

            return res.status(200).json({message})
        } catch (error) {
            console.error(error);
            return res.status(500).json({message : 'Erreur lors de la récupération des messages', erreur : error})
        }
    },

    postMessage : async (req, res) => {
        try {
            const { content, groupId, sender } = req.body

            const postMessage = await groupChatService.postMessage({content, groupId, sender})

            return res.status(200).json({postMessage})
        } catch (error) {
            console.error(error);
            return res.status(500).json({message : 'Erreur lors de l\'envoie du message.', erreur : error})
        }
    }

}

module.exports = groupChatController