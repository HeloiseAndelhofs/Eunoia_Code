const sql = require('mssql');
const sqlConfig = require('../database');

const groupChatService = {

    // Fonction pour créer un groupe de discussion
    createGroup: async (name, membersIds) => {
        let transaction;
        try {
            // Connexion à la base de données
            await sql.connect(sqlConfig);
            transaction = new sql.Transaction();
            await transaction.begin();

            // Insertion du nouveau groupe de discussion et récupération de l'ID généré
            const group = await new sql.Request(transaction)
                .input('name', sql.NVarChar, name)
                .query('INSERT INTO group_chat (name) OUTPUT INSERTED.group_chat_id VALUES (@name)');

            const groupId = group.recordset[0].group_chat_id;
            console.log('GROUP ID !!!!!!!!!! ' + groupId);

            // Ajout des membres au groupe de discussion
            for (const memberId of membersIds) {
                await new sql.Request(transaction)
                    .input('userId', sql.Int, memberId)
                    .input('groupId', sql.Int, groupId)
                    .query(`
                        INSERT INTO group_members (joined_at, group_chat_id, user_id) 
                        OUTPUT INSERTED.group_member_id 
                        VALUES (CONVERT(DATETIME2(0),SYSDATETIME()), @groupId, @userId)
                    `);
            }

            // Commit de la transaction
            await transaction.commit();
            return { groupId, name, membersIds };

        } catch (error) {
            // Rollback de la transaction en cas d'erreur
            if (transaction) await transaction.rollback();
            console.error(error);
            throw error;
        }
    },

    // Fonction pour récupérer tous les groupes d'un utilisateur
    getAllUserGroup: async (userId) => {
        try {
            // Connexion à la base de données
            await sql.connect(sqlConfig);

            console.log(userId);

            // Requête pour obtenir tous les groupes auxquels un utilisateur appartient
            const userGroups = await new sql.Request()
                .input('userId', sql.Int, userId)
                .query(`
                    SELECT gc.name, gc.group_chat_id
                    FROM group_chat gc
                    INNER JOIN group_members gm ON gc.group_chat_id = gm.group_chat_id
                    WHERE gm.user_id = @userId
                `);

            console.log(userGroups.recordset[0]);
            return userGroups.recordset[0];

        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    // Fonction pour récupérer tous les messages d'un groupe de discussion
    getGroupMessages: async (groupId) => {
        try {
            // Connexion à la base de données
            await sql.connect(sqlConfig);

            // Requête pour obtenir les messages du groupe
            const messages = await new sql.Request()
                .input('groupId', sql.Int, groupId)
                .query(`
                    SELECT pm.private_message_id, pm.content, pm.send_at, pm.sender, u.username as sender_username
                    FROM private_messages pm
                    JOIN users u ON pm.sender = u.user_id
                    WHERE pm.group_chat_id = @groupId
                    ORDER BY pm.send_at ASC
                `);

            // Requête pour obtenir le nom du groupe
            const group = await new sql.Request()
                .input('groupId', sql.Int, groupId)
                .query(`
                    SELECT name FROM group_chat
                    WHERE group_chat_id = @groupId
                `);
            
            return { messages: messages.recordset, name: group.recordset };

        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    // Fonction pour poster un message dans un groupe de discussion
    postMessage: async (data) => {
        try {
            // Connexion à la base de données
            await sql.connect(sqlConfig);

            const { content, groupId, sender } = data;

            // Insertion du message dans la base de données et récupération des informations insérées
            const result = await new sql.Request()
                .input('content', sql.NVarChar, content)
                .input('groupId', sql.Int, groupId)
                .input('sender', sql.Int, sender)
                .query(`
                    INSERT INTO private_messages (content, send_at, group_chat_id, sender) 
                    OUTPUT INSERTED.private_message_id, INSERTED.content, INSERTED.send_at, INSERTED.group_chat_id, INSERTED.sender 
                    VALUES (@content, CONVERT(DATETIME2(0),SYSDATETIME()), @groupId, @sender)
                `);

            return result.recordset[0];

        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};

module.exports = groupChatService;
