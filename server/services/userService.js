const sql = require('mssql');
const sqlConfig = require('../database');
const bcrypt = require('bcrypt');
const utilityFunc = require('../services/utilityFunctions.service')
const jwt = require('jsonwebtoken')

const userService = {

    
     login : async (username, password, token) => {
        try {
            await sql.connect(sqlConfig);
    
            if (token) {
                try {
                    const payload = jwt.verify(token, process.env.JWT_SECRET);
                    const userId = payload.userId;
    
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
                       return await utilityFunc.checkUserByUsernameAndPassword(username, password)

                    } else {
                        throw new Error(error, 'Token invalide');
                    }
                }
            } else {
                if(username && password) {
                    return await utilityFunc.checkUserByUsernameAndPassword(username, password)
                } else {
                    throw new Error(`Aucun utilisateur n'a été trouvé.`);
                }
            }
        } catch (error) {
            console.error(error);
            throw new Error('Erreur lors de la connexion');
        }
    },
    

    registerUserStep1: async (data, transaction) => {
        try {
            const userExistReq = new sql.Request(transaction);

            const { username, email, hashedPassword, birthday } = data;
            
            // await sql.connect(sqlConfig);

            const userExist = await userExistReq
                                .input('username', sql.NVarChar, username)
                            .query('SELECT * FROM users WHERE username = @username')
            

            if (userExist.rowsAffected > 0) {
                throw new Error("L'utilisateur avec ce username existe déjà.");
            }

            const pushNewUserReq = new sql.Request(transaction);

            const pushNewUser = await pushNewUserReq
                    .input('username', sql.NVarChar, username)
                    .input('email', sql.NVarChar, email)
                    .input('hashedPassword', sql.NVarChar, hashedPassword)
                    .input('birthday', sql.Date, birthday)

                .query('INSERT INTO users (username, email, hashedPassword, birthday) OUTPUT INSERTED. * VALUES (@username, @email, @hashedPassword, @birthday)');
 

            return pushNewUser.recordset[0];

        } catch (error) {
            console.error(error);
            throw new Error(error.message);
        }
    },

    registerUserStep2: async (userId, data, transaction) => {
        try {
            const { description, avatar_url, tokenAccepted } = data;

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

    addUserPreferences: async (userId, preferences, transaction) => {
        try {
            
            await sql.connect(sqlConfig)

            for (const preference of preferences) {
                const { type, name, is_liked } = preference;
                const pushUserPreferenceReq = new sql.Request(transaction);
                
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
            await sql.connect(sqlConfig);
            const request = new sql.Request();

            const userResult = await request
                .input('username', sql.NVarChar, username)
                .query('SELECT user_id, username, description, avatar_url, birthday, created_at FROM users WHERE username = @username');


            // console.log('userRESULT : ' + JSON.stringify(userResult.recordset[0]));

                if (userResult.recordset.length > 0) {
                    const user = userResult.recordset[0];
                    
                    const prefRequest = new sql.Request();
                    const prefResult = await prefRequest
                    .input('user_id', sql.Int, user.user_id)
                    .query('SELECT user_preference_id, type, name, is_liked FROM user_preference WHERE user_id = @user_id');
                    
                // console.log('USER ID : ' + user.user_id);
                // console.log('USER RESULT : ' + userResult.recordset[0]);
                // console.log('USER RESULT RECORDSET : ' + userResult.recordset[0]);
            
                // console.log('PREF RESULT : ' + prefResult);
                // console.log('PREF RESULT RECORDSET : ' + prefResult.recordset[0]);


                if (prefResult.recordset.length > 0) {

                    const userResponse = {
                        username: user.username,
                        description: user.description,
                        avatar_url: user.avatar_url,
                        created_at: user.created_at,
                        birthday : user.birthday
                    };

                    return {
                        user : userResponse,
                        preferences : prefResult.recordset
                    }
                }

            } 

        } catch (error) {
            console.error("[getUserByUsername] Erreur lors de la recherche de l'utilisateur : ", error.message);
            throw new Error();
        }
    },


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

    updateUserProfile : async (data, userId, transaction) => {
        try {

            await sql.connect(sqlConfig)

            const { username, description, avatar_url, preferences } = data
            
            console.log('DATA : ' + data);
            console.log(description);


            let updatedField = []

                if (username) {
                    await utilityFunc.updateCheckFields('username', username, userId, transaction )

                    updatedField.push(`username = '${username}'`)

                }

                if (description) {
                    updatedField.push(`description = '${description}'`)

                    console.log('coucou je suis la DESCRIPTION : ' + description);
                }

                if (avatar_url) {
                    updatedField.push(`avatar_url = '${avatar_url}'`)
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
                    throw new Error('update user 2')
                }

                await new sql.Request(transaction)
                        .input('userId', sql.Int, userId)                    
                        .query('DELETE FROM user_preference WHERE user_id = @userId')

                for(const pref of preferences){
                    const { type, name, is_liked } = pref
                    
                    await new sql.Request(transaction)
                        .input('userId', sql.Int, userId)
                        .input('type', sql.NVarChar, type)
                        .input('name', sql.NVarChar, name)
                        .input('is_liked', sql.Bit, is_liked)
                        .query('INSERT INTO user_preference (user_id, type, name, is_liked) VALUES (@userId, @type, @name, @is_liked)')
                }


            return {message : 'Profil mis à jour avec succès'}

        } catch (error) {
            console.error(error);
            throw new Error(error.message);
        }
    },

    updateEmail : async (userId, email) => {
        try {
            
            await sql.connect(sqlConfig)
            await utilityFunc.updateCheckFields('email', email, userId)

            const request = new sql.Request()

            const result = await request
                            .input('userId', sql.Int, userId)
                            .input('email', sql.NVarChar, email)
                            .query('UPDATE users SET email = @email WHERE user_id = @userId');

            if (!(result.rowsAffected > 0)) {
                throw new Error()
            }

            return result

        } catch (error) {
            console.error("[updateUserEmail] Erreur lors de la mise à jour de l'email : ", error.message);
            throw new Error(error);
        }
    },

    updateUserPassword : async (userId, currentPassword, newPassword) => {
        try {
            // console.log('SALUT BOUBOU 1');
            await sql.connect(sqlConfig)

            const user = await utilityFunc.selectUserById(userId)
            // console.log('HELLO 2');

            // console.log('USER : ' + user);

            if (!user) {
                throw new Error('Aucun utilisateur trouvé')
            }

            const isMatch = await bcrypt.compare(currentPassword, user.hashedPassword)
            if(!isMatch){
                throw new Error('Les mot de passes ne correspondent pas')
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10)

            const updatedPasswordField = await new sql.Request()
                                            .input('userId', sql.Int, userId)
                                            .input('hashedPassword', sql.NVarChar, hashedPassword)
                                            .query('UPDATE users SET hashedPassword = @hashedPassword WHERE user_id = @userId')

            if (!(updatedPasswordField.rowsAffected > 0)) {
                throw new Error()
            }

            return updatedPasswordField

        } catch (error) {
            console.error("[updateUserPassword] Erreur lors de la mise à jour du mdp : ", error.message);
            throw new Error();
        }
    },

    archiveUser : async (userId, transaction) => {
        try {
            
            await sql.connect(sqlConfig)

            const request = new sql.Request(transaction)
            const result = await request
                            .input('userId', sql.Int, userId)
                            .query(`
                            INSERT INTO archived_users (user_id, username, email, hashedPassword, description, avatar_url, created_at)
                            SELECT user_id, username, email, hashedPassword, description, avatar_url, created_at
                            FROM users
                            WHERE user_id = @userId
                        `);  


            if (result.rowsAffected > 0) {
                
                await new sql.Request(transaction)
                    .input('userId', sql.Int, userId)
                    .query('DELETE FROM user_preference WHERE user_id = @userId')


                await new sql.Request(transaction)
                    .input('userId', sql.Int, userId)
                    .query('DELETE FROM users WHERE user_id = @userId')


                return result

            } 
            throw new Error()

        } catch (error) {
            console.error(error);
            throw new Error(error.message);
        }
    }
};

module.exports = userService;
