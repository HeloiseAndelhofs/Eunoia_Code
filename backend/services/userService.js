const sql = require('mssql');
const sqlConfig = require('../database');

const userService = {

    login : async () =>  {

    },

    register : async (data) => {

        try {
            const { username, email, hashedPassword, birthday, description, avatar_url, preferences } = data;

            await sql.connect(sqlConfig);
            const userExistReq = new sql.Request();

            const userExist = await userExistReq
                                .input('username', sql.NVarChar, username)
                                .query('SELECT * FROM users WHERE username = @username')

            if (userExist.rowsAffected > 0) {
                throw new Error("L'utilisateur avec ce username existe déja.")
            }

            const pushNewUserReq = new sql.Request()

            const pushNewUser = await pushNewUserReq
                                    .input('username', sql.NVarChar, username)
                                    .input('email', sql.NVarChar, email)
                                    .input('hashedPassword', sql.NVarChar, hashedPassword)
                                    .input('birthday', sql.Date, birthday)
                                    .input('description', sql.NVarChar, description)
                                    .input('avatar_url', sql.NVarChar, avatar_url)
                    .query('INSERT INTO users(username, email, hashedPassword, birthday, description, avatar_url) VALUES(@username, @email, @hashedPassword, @birthday, @description, @avatar_url)')

            if (pushNewUser.recordset <= 0) {
                console.error(error.message);
                return res.sendStatus(500).json({message : "Erreur interne du serveur"})
            }

            const userId = pushNewUser.recordset[0].user_id

            const pushUserPreferenceReq = new sql.Request()

            for (const preference of preferences) {
                const { type, name, is_liked } = preference

                await pushUserPreferenceReq
                                .input('user_id', sql.Int, userId)
                                .input('type', sql.NVarChar, type)
                                .input('name', sql.NVarChar, name)
                                .input('is_liked', sql.Bit, is_liked)
                    .query('INSERT INTO user_preference(user_id, type, name, is_liked) VALUES(@user_id, @type, @name, @is_liked)')
            }

            return {
                message : "Utilisateur enregistré avec succès."
            }

        } catch (error) {
            console.error(error);
            throw new Error
        }

    },

    getUserByUsername: async (username) => {
        try {
            await sql.connect(sqlConfig);
            const request = new sql.Request();

            // Utilisation de '=' pour une correspondance exacte
            const result = await request
                .input('username', sql.NVarChar, username)
                .query('SELECT username, description FROM users WHERE username = @username');

            if (result.recordset.length > 0) {
                return result.recordset[0]; // Retourner l'utilisateur s'il est trouvé
            } else {
                return null; // Retourner null si l'utilisateur n'est pas trouvé
            }
        } catch (error) {
            console.error("[getUserByUsername] Erreur lors de la recherche de l'utilisateur : ", error.message);
            throw error;
        }
    }
};

module.exports = userService;
