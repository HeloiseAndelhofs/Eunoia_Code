const sql = require('mssql');
const sqlConfig = require('../database');
const bcrypt = require('bcrypt');

const userService = {

    
     login : async (username, password, token) => {
        try {
            sql.connect(sqlConfig);
    
            if (token) {
                try {
                    const payload = jwt.verify(token, process.env.SECRET);
                    const userId = payload.userId;
    
                    const tokenUserReq = new sql.Request();
                    const userResult = await tokenUserReq
                        .input('userId', sql.Int, userId)
                        .query('SELECT * FROM users WHERE user_id = @userId');
    
                    if (userResult.recordset.length > 0) {
                        return userResult.recordset[0];
                    } else {
                        throw new Error('Aucun utilisateur trouvé');
                    }
                } catch (error) {
                    if (error.name === "TokenExpiredError") {
                        const checkReq = new sql.Request();
                        const checkUserResult = await checkReq
                            .input('username', sql.NVarChar, username)
                            .query('SELECT username, email, password, description, avatar_url, created_at FROM users WHERE username = @username');
    
                        if (checkUserResult.recordset.length > 0) {
                            const user = checkUserResult.recordset[0];
    
                            const passwordOK = await bcrypt.compare(password, user.password);
                            if (passwordOK) {
                                return user;
                            } else {
                                throw new Error('Mot de passe incorrect');
                            }
                        } else {
                            throw new Error(`Aucun utilisateur n'a été trouvé.`);
                        }
                    } else {
                        throw new Error('Token invalide');
                    }
                }
            } else {
                if(username && password) {
                    const checkNoTokenReq = new sql.Request();
                    const checkUserNoTokenResult = await checkNoTokenReq
                        .input('username', sql.NVarChar, username)
                            .query('SELECT username, email, password, description, avatar_url, created_at FROM users WHERE username = @username');

                    if (checkUserNoTokenResult.recordset.length > 0) {
                        const user = checkUserNoTokenResult.recordset[0];

                        const passwordOK = await bcrypt.compare(password, user.password);
                        if (passwordOK) {
                            return user;
                        } else {
                            throw new Error('Mot de passe incorrect');
                        }
                    } else {
                        throw new Error(`Aucun utilisateur n'a été trouvé.`);
                    }
                }
            }
        } catch (error) {
            console.error(error);
            throw new Error('Erreur lors de la connexion');
        }
    },
    

    registerUser: async (data) => {
        try {
            const { username, email, hashedPassword, birthday, description, avatar_url, tokenAccepted } = data;
            
             sql.connect(sqlConfig);
            const userExistReq = new sql.Request();

            
            const userExist = await userExistReq
                                .input('username', sql.NVarChar, username)
                            .query('SELECT * FROM users WHERE username = @username')
            

            if (userExist.rowsAffected > 0) {
                throw new Error("L'utilisateur avec ce username existe déjà.");
            }

            const pushNewUserReq = new sql.Request();

            const pushNewUser = await pushNewUserReq
                    .input('username', sql.NVarChar, username)
                    .input('email', sql.NVarChar, email)
                    .input('hashedPassword', sql.NVarChar, hashedPassword)
                    .input('birthday', sql.Date, birthday)
                    .input('description', sql.NVarChar, description)
                    .input('avatar_url', sql.NVarChar, avatar_url)
                    .input('tokenAccepted', sql.Bit, tokenAccepted)

                .query('INSERT INTO users (username, email, hashedPassword, birthday, description, avatar_url, tokenAccepted) OUTPUT INSERTED. * VALUES (@username, @email, @hashedPassword, @birthday, @description, @avatar_url, @tokenAccepted)');
 

            return pushNewUser.recordset[0].user_id;

        } catch (error) {
            console.error(error);
            throw new Error(error.message);
        }
    },

    addUserPreferences: async (userId, preferences) => {
        try {
             sql.connect(sqlConfig);
            
            for (const preference of preferences) {
                const { type, name, is_liked } = preference;
                const pushUserPreferenceReq = new sql.Request();
                
                await pushUserPreferenceReq
                        .input('user_id', sql.Int, userId)
                        .input('type', sql.NVarChar, type)
                        .input('name', sql.NVarChar, name)
                        .input('is_liked', sql.Bit, is_liked)
                    .query('INSERT INTO user_preference (user_id, type, name, is_liked) VALUES (@user_id, @type, @name, @is_liked)');
            }

            return { message: "Preferences added successfully." };

        } catch (error) {
            console.error(error);
            throw new Error(error.message);
        }
    },

    getUserByUsername: async (username) => {
        try {
             sql.connect(sqlConfig);
            const request = new sql.Request();

            // Utilisation de '=' pour une correspondance exacte
            const result = await request
                .input('username', sql.NVarChar, username)
                .query('SELECT username, email, description, avatar_ur, created_at FROM users WHERE username = @username');

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
