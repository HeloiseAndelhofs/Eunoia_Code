const sql = require('mssql');
const sqlConfig = require('../database');

const groupChatService = {

    createGroup: async (name, membersIds) => {
        let transaction;
        try {
            await sql.connect(sqlConfig);
            transaction = new sql.Transaction();
            await transaction.begin();

            const group = await new sql.Request(transaction)
                .input('name', sql.NVarChar, name)
                .query('INSERT INTO group_chat (name) OUTPUT INSERTED.group_chat_id VALUES (@name)');

            const groupId = group.recordset[0].group_chat_id;

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

            await transaction.commit();
            return { groupId, name, membersIds };

        } catch (error) {
            if (transaction) await transaction.rollback();
            console.error(error);
            throw error;
        }
    },

    getAllUserGroup: async (userId) => {
        try {
            await sql.connect(sqlConfig);

            const userGroups = await new sql.Request()
                .input('userId', sql.Int, userId)
                .query(`
                    SELECT gc.name 
                    FROM group_chat gc
                    INNER JOIN group_members gm ON gc.group_chat_id = gm.group_chat_id
                    WHERE gm.user_id = @userId
                `);

            return userGroups.recordset;

        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    getGroupMessages: async (groupId) => {
        try {
            await sql.connect(sqlConfig);

            const messages = await new sql.Request()
                .input('groupId', sql.Int, groupId)
                .query(`
                    SELECT pm.private_message_id, pm.content, pm.send_at, pm.sender, u.username as sender_username
                    FROM private_messages pm
                    JOIN users u ON pm.sender = u.user_id
                    WHERE pm.group_chat_id = @groupId
                    ORDER BY pm.send_at ASC
                `);

            return messages.recordset;

        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    postMessage: async (data) => {
        try {
            await sql.connect(sqlConfig);

            const { content, groupId, sender } = data;

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
