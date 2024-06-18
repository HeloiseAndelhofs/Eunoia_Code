const sql = require('mssql');
const sqlConfig = require('../database');
const bcrypt = require('bcrypt');
const utilityFunc = require('../services/utilityFunctions.service');
const jwt = require('jsonwebtoken');

const userService = {

    // Fonction pour gérer la connexion de l'utilisateur
    login : async (username, password, token) => {
        try {
            await sql.connect(sqlConfig);
    
            if (token) {
                try {
                    // Vérifier la validité du token
                    const payload = jwt.verify(token, process.env.JWT_SECRET);
                    const userId = payload.userId;
    
                    // Requête pour obtenir l'utilisateur par ID
                    const tokenUserReq = new sql.Request();
                    const user = await tokenUserReq
                        .input('userId', sql.Int, userId)
                        .query('SELECT * FROM users WHERE user_id = @userId');

                    if (user.recordset.length > 0) {
                        return user.recordset[0];
                    } else {
                        throw new Error('Aucun utilisateur trouvé');
                    }
                } catch (error) {
                    if (error.name === "TokenExpiredError") {
                        // Vérifier l'utilisateur par nom d'utilisateur et mot de passe si le token a expiré
                        return await utilityFunc.checkUserByUsernameAndPassword(username, password);
                    } else {
                        throw new Error(error, 'Token invalide');
                    }
                }
            } else {
                if (username && password) {
                    console.log(username, password);
                    // Vérifier l'utilisateur par nom d'utilisateur et mot de passe
                    return await utilityFunc.checkUserByUsernameAndPassword(username, password);
                } else {
                    throw new Error(`Aucun utilisateur n'a été trouvé.`);
                }
            }
        } catch (error) {
            console.error(error);
            throw new Error('Erreur lors de la connexion');
        }
    },
    
    // Fonction pour enregistrer un utilisateur (étape 1)
    registerUserStep1: async (data, transaction) => {
        try {
            const userExistReq = new sql.Request(transaction);
            const { username, email, hashedPassword, birthday } = data;
            
            // Vérifier si l'utilisateur existe déjà
            const userExist = await userExistReq
                .input('username', sql.NVarChar, username)
                .query('SELECT * FROM users WHERE username = @username');

            if (userExist.rowsAffected > 0) {
                throw new Error("L'utilisateur avec ce username existe déjà.");
            }

            // Insérer un nouvel utilisateur
            const pushNewUserReq = new sql.Request(transaction);
            const pushNewUser = await pushNewUserReq
                .input('username', sql.NVarChar, username)
                .input('email', sql.NVarChar, email)
                .input('hashedPassword', sql.NVarChar, hashedPassword)
                .input('birthday', sql.Date, birthday)
                .query('INSERT INTO users (username, email, hashedPassword, birthday) OUTPUT INSERTED.* VALUES (@username, @email, @hashedPassword, @birthday)');

            return pushNewUser.recordset[0];
        } catch (error) {
            console.error(error);
            throw new Error(error.message);
        }
    },

    // Fonction pour enregistrer un utilisateur (étape 2)
    registerUserStep2: async (userId, data, transaction) => {
        try {
            const { description, avatar_url, tokenAccepted } = data;

            // Mise à jour des informations de l'utilisateur
            const registerUserReq = new sql.Request(transaction);
            await registerUserReq
                .input('userId', sql.Int, userId)
                .input('description', sql.NVarChar, description)
                .input('avatar_url', sql.NVarChar, avatar_url)
                .input('tokenAccepted', sql.Bit, tokenAccepted)
                .query('UPDATE users SET description = @description, avatar_url = @avatar_url, tokenAccepted = @tokenAccepted WHERE user_id = @userId');
        } catch (error) {
            console.error(error);
            throw new Error(error.message);
        }
    },

    // Fonction pour ajouter des préférences utilisateur
    addUserPreferences: async (userId, preferences, transaction) => {
        try {
            await sql.connect(sqlConfig);

            for (const preference of preferences) {
                const { type, name, is_liked } = preference;
                const pushUserPreferenceReq = new sql.Request(transaction);
                
                // Insérer une nouvelle préférence utilisateur
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

    // Fonction pour obtenir un utilisateur par nom d'utilisateur
    getUserByUsername: async (username) => {
        try {
            await sql.connect(sqlConfig);
            const request = new sql.Request();

            const userResult = await request
                .input('username', sql.NVarChar, username)
                .query('SELECT user_id, username, description, avatar_url, birthday, created_at FROM users WHERE username = @username');

            if (userResult.recordset.length > 0) {
                const user = userResult.recordset[0];
                
                // Obtenir les préférences utilisateur
                const prefRequest = new sql.Request();
                const prefResult = await prefRequest
                    .input('user_id', sql.Int, user.user_id)
                    .query('SELECT user_preference_id, type, name, is_liked FROM user_preference WHERE user_id = @user_id');

                if (prefResult.recordset.length > 0) {
                    const userResponse = {
                        userId : user.user_id,
                        username: user.username,
                        description: user.description,
                        avatar_url: user.avatar_url,
                        created_at: user.created_at,
                        birthday : user.birthday
                    };

                    return {
                        user : userResponse,
                        preferences : prefResult.recordset
                    };
                }
            }
        } catch (error) {
            console.error("[getUserByUsername] Erreur lors de la recherche de l'utilisateur : ", error.message);
            throw new Error();
        }
    },

    // Fonction pour obtenir les paramètres utilisateur
    getUserSettings: async (userId) => {
        try {
            await sql.connect(sqlConfig);
            const request = new sql.Request();

            const result = await request
                .input('userId', sql.Int, userId)
                .query('SELECT email FROM users WHERE user_id = @userId');

            if (result.recordset.length > 0) {
                return result.recordset[0];
            } else {
                return null;
            }
        } catch (error) {
            console.error("[getUserSettings] Erreur lors de la récupération des paramètres utilisateur : ", error.message);
            throw new Error();
        }
    },

    // Fonction pour mettre à jour le profil utilisateur
    updateUserProfile: async (data, userId, transaction) => {
        try {
            await sql.connect(sqlConfig);
            const { username, description, avatar_url, preferences } = data;
            
            console.log('DATA : ' + data);
            console.log(description);

            let updatedField = [];

            // Mise à jour des champs si présents
            if (username) {
                await utilityFunc.updateCheckFields('username', username, userId, transaction);
                updatedField.push(`username = '${username}'`);
            }

            if (description) {
                updatedField.push(`description = '${description}'`);
                console.log('coucou je suis la DESCRIPTION : ' + description);
            }

            if (avatar_url) {
                updatedField.push(`avatar_url = '${avatar_url}'`);
            }

            console.log('UPDATED FIELD ARRAY :' + updatedField.length);

            if (updatedField.length > 0) {
                const updateQuery = `UPDATE users SET ${updatedField.join(', ')} WHERE user_id = @userId`;
                const updateFieldsReq = new sql.Request(transaction);
                await updateFieldsReq
                    .input('userId', sql.Int, userId)
                    .query(updateQuery);
            }

            if (!(preferences && preferences.length > 0)) { 
                throw new Error('update user 2');
            }

            // Suppression des anciennes préférences utilisateur
            await new sql.Request(transaction)
                .input('userId', sql.Int, userId)
                .query('DELETE FROM user_preference WHERE user_id = @userId');

            // Insertion des nouvelles préférences utilisateur
            for (const pref of preferences) {
                const { type, name, is_liked } = pref;
                
                await new sql.Request(transaction)
                    .input('userId', sql.Int, userId)
                    .input('type', sql.NVarChar, type)
                    .input('name', sql.NVarChar, name)
                    .input('is_liked', sql.Bit, is_liked)
                    .query('INSERT INTO user_preference (user_id, type, name, is_liked) VALUES (@userId, @type, @name, @is_liked)');
            }

            return { message: 'Profil mis à jour avec succès' };
        } catch (error) {
            console.error(error);
            throw new Error(error.message);
        }
    },

    // Fonction pour mettre à jour l'email utilisateur
    updateEmail: async (userId, email) => {
        try {
            await sql.connect(sqlConfig);
            await utilityFunc.updateCheckFields('email', email, userId);

            const request = new sql.Request();

            const result = await request
                .input('userId', sql.Int, userId)
                .input('email', sql.NVarChar, email)
                .query('UPDATE users SET email = @email WHERE user_id = @userId');

            if (!(result.rowsAffected > 0)) {
                throw new Error();
            }

            return result;
        } catch (error) {
            console.error("[updateUserEmail] Erreur lors de la mise à jour de l'email : ", error.message);
            throw new Error(error);
        }
    },

    // Fonction pour mettre à jour le mot de passe utilisateur
    updateUserPassword: async (userId, currentPassword, newPassword) => {
        try {
            await sql.connect(sqlConfig);

            const user = await utilityFunc.selectUserById(userId);

            if (!user) {
                throw new Error('Aucun utilisateur trouvé');
            }

            // Vérifier si le mot de passe actuel correspond
            const isMatch = await bcrypt.compare(currentPassword, user.hashedPassword);
            if (!isMatch) {
                throw new Error('Les mot de passes ne correspondent pas');
            }

            // Hashage du nouveau mot de passe
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Mise à jour du mot de passe utilisateur
            const updatedPasswordField = await new sql.Request()
                .input('userId', sql.Int, userId)
                .input('hashedPassword', sql.NVarChar, hashedPassword)
                .query('UPDATE users SET hashedPassword = @hashedPassword WHERE user_id = @userId');

            if (!(updatedPasswordField.rowsAffected > 0)) {
                throw new Error();
            }

            return updatedPasswordField;
        } catch (error) {
            console.error("[updateUserPassword] Erreur lors de la mise à jour du mdp : ", error.message);
            throw new Error();
        }
    },

    // Fonction pour archiver un utilisateur
    archiveUser: async (userId, transaction) => {
        try {
            await sql.connect(sqlConfig);

            // Copier les informations de l'utilisateur vers une table d'archive
            const request = new sql.Request(transaction);
            const result = await request
                .input('userId', sql.Int, userId)
                .query(`
                    INSERT INTO archived_users (user_id, username, email, hashedPassword, description, avatar_url, created_at)
                    SELECT user_id, username, email, hashedPassword, description, avatar_url, created_at
                    FROM users
                    WHERE user_id = @userId
                `);  

            if (result.rowsAffected > 0) {
                // Supprimer les préférences utilisateur
                await new sql.Request(transaction)
                    .input('userId', sql.Int, userId)
                    .query('DELETE FROM user_preference WHERE user_id = @userId');

                // Supprimer l'utilisateur
                await new sql.Request(transaction)
                    .input('userId', sql.Int, userId)
                    .query('DELETE FROM users WHERE user_id = @userId');

                return result;
            } 
            throw new Error();
        } catch (error) {
            console.error(error);
            throw new Error(error.message);
        }
    }
};

module.exports = userService;
