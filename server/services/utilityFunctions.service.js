const sql = require('mssql');
const sqlConfig = require('../database');
const bcrypt = require('bcrypt');

const utilityFuncService = {

    // Vérifie le statut du token pour un utilisateur
    tokenStatus: async (username) => {
        try {
            await sql.connect(sqlConfig);

            // Requête pour vérifier le statut du token
            const checkStatusReq = new sql.Request();
            const checkStatus = await checkStatusReq
                .input('username', sql.NVarChar, username)
                .query('SELECT * FROM users WHERE username = @username');

            console.log(`Requête SQL exécutée : SELECT * FROM users WHERE username = ${username}`);
            console.log(`Résultat de la requête : `, checkStatus.recordset);

            if (!(checkStatus.recordset.length > 0)) {
                throw new Error('Utilisateur introuvable');
            }

            return checkStatus.recordset[0].tokenAccepted;
        } catch (error) {
            throw new Error(error);
        }
    },

    // Met à jour le statut du token pour un utilisateur
    tokenStatusUpdate: async (updateTokenStatus, username) => {
        try {
            await sql.connect(sqlConfig);

            const updateStatusReq = new sql.Request();
            await updateStatusReq
                .input('updateTokenStatus', sql.Bit, updateTokenStatus)
                .input('username', sql.NVarChar, username)
                .query('UPDATE users SET tokenAccepted = @updateTokenStatus WHERE username = @username');

            const selectStatusReq = new sql.Request();
            const selectStatus = await selectStatusReq
                .input('username', sql.NVarChar, username)
                .query('SELECT * FROM users WHERE username = @username');

            if (selectStatus.recordset.length > 0) {
                return selectStatus.recordset[0].tokenAccepted;
            }

            throw new Error('Problème pendant l\'update du statut du token');
        } catch (error) {
            throw new Error(error);
        }
    },

    // Vérifie un utilisateur par nom d'utilisateur et mot de passe
    checkUserByUsernameAndPassword: async (username, password) => {
        try {
            await sql.connect(sqlConfig);

            const checkUserReq = new sql.Request();
            const checkUser = await checkUserReq
                .input('username', sql.NVarChar, username)
                .query('SELECT user_id, username, email, hashedPassword, description, avatar_url, created_at FROM users WHERE username = @username');

            if (checkUser.recordset.length > 0) {
                const user = checkUser.recordset[0];
                console.log("USER", JSON.stringify(user));
                console.log("PASSWORD", user.hashedPassword);
                const passwordOK = await bcrypt.compare(password, user.hashedPassword);
                if (passwordOK) {
                    return user;
                } else {
                    throw new Error('Mot de passe incorrect');
                }
            } else {
                throw new Error(`Aucun utilisateur n'a été trouvé.`);
            }
        } catch (error) {
            console.error("ERREUR", error);
            throw new Error(error);
        }
    },

    // Sélectionne un utilisateur par son ID
    selectUserById: async (userId, transaction) => {
        try {
            await sql.connect(sqlConfig);

            const selectUserReq = transaction ? new sql.Request(transaction) : new sql.Request();
            const selectUser = await selectUserReq
                .input('userId', sql.Int, userId)
                .query('SELECT * FROM users WHERE user_id = @userId');

            console.log(userId);

            if (selectUser.recordset.length > 0) {
                console.log(selectUser.recordset[0]);
                return selectUser.recordset[0];
            }

            throw new Error('[LOGIN ==> UTILITY FUNC SERVICE ==> SELECT USER BY ID] : Aucun utilisateur trouvé');
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    },

    // Supprime u utilisateur d'une transaction register échouée
    deleteStep1: async (userId) => {
        try {
            await sql.connect(sqlConfig);

            const deleteUserReq = new sql.Request();
            const deleteUser = await deleteUserReq
                .input('userId', sql.Int, userId)
                .query('DELETE FROM users WHERE user_id = @userId');

            if (deleteUser.rowsAffected > 0) {
                console.log("C'est bon Les COPAINS");
                return;
            } else {
                throw new Error('Échec de la suppression de l\'utilisateur');
            }
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    },

    // Vérifie et met à jour les champs pour un utilisateur (juste le username et email)
    updateCheckFields: async (field, value, userId, transaction) => {
        try {
            await sql.connect(sqlConfig);

            const request = new sql.Request(transaction);
            const checkIfused = await request
                .input('userId', sql.Int, userId)
                .input('value', sql.NVarChar, value)
                .query(`SELECT * FROM users WHERE ${field} = @value AND user_id != @userId`);

            if (checkIfused.recordset.length > 0) {
                throw new Error(`${field} déjà utilisé, veuillez en choisir un autre`);
            }
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    },

    // Obtient l'ID utilisateur par nom d'utilisateur
    getUserId: async (username) => {
        try {
            await sql.connect(sqlConfig);
            const request = new sql.Request();

            const result = await request
                .input('username', sql.NVarChar, username)
                .query('SELECT user_id FROM users WHERE username = @username');

            return result.recordset.length > 0 ? result.recordset[0].user_id : null;
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }
}

module.exports = utilityFuncService;
