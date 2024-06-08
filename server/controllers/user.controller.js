const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userService = require('../services/userService');
const loginValidators = require('../validators/login.validators');
const registerValidator = require('../validators/register.validators');
const updateValidator = require('../validators/update.validators');
const utilityFunc = require('../services/utilityFunctions.service');
const sql = require('mssql');
const database = require('../database')

const userController = {

    login : async (req, res) => {

        try {
            const token = req.cookies.token

            
            if (token) {
                try {
                    
                    const payload = jwt.verify(token, process.env.JWT_SECRET)
                    const user = await utilityFunc.selectUserById(payload.userId)

                    if (user) {
                        return res.status(200).json({message : `Utilisateur connecté avec succès via le token, utilisateur : ${user.username}`})
                    }

                } catch (error) {
                    if (error.name !== "TokenExpiredError") {
                        return res.status(403).json({ message: "Token invalide." });
                    }
                }
            }


            const validateReq = await loginValidators.validate(req.body);
            // console.log('validateReq :' + validateReq);
            if (validateReq.error) {
                return res.status(400).json({message : validateReq.error.details[0].message}) //vérifier le code http
            }
            
            //enableToken sera une case à cochée
            const { username, password, tokenAccepted } = validateReq
            
            const user = await userService.login(username, password, token)
            
            if (!user) {
                 return res.status(404).json({message : "Aucun utilisateur n'a été trouvé, voulez vous créer un compte ?"})
             }

            let tokenStatus = await  utilityFunc.tokenStatus(username)

            const tokenStatusForm = tokenAccepted

            if (tokenStatus !== tokenStatusForm) {
                tokenStatus = await utilityFunc.tokenStatusUpdate(tokenStatusForm, username) 
                // console.log('token status : ' + tokenStatus);
            }

            const payload = {
                userId: user.user_id,
                email: user.email,
                username: user.username,
            }
            const option = {
                expiresIn :'9d'
            }
            const secret= process.env.JWT_SECRET
            const newToken = jwt.sign(payload, secret, option)

            switch (tokenStatus) {
                case true:
                    res.cookie('token', newToken, { expires : new Date(Date.now() + 86400000), httpOnly : true })
                    return res.status(201).json({token : token, message: "Utilisateur connecté." });

                    // break;
            
                case false:
                    res.cookie('token', newToken)
                    return res.status(201).json({token : token, message: "Utilisateur connecté." });
                    
                    // break;

                default:
                    return res.status(500).json({ message: "Status du token innatendu." });
                    // break;
            }


        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error." });
        }

    },

    register: async (req, res) => {

        let transaction;

        try {

            const validateReq = await registerValidator.validate(req.body, {abortEarly: false})
            if (validateReq.error) {
                return res.status(400).json({message : validateReq.error})
            }

            //tokenAccepted sera une case à coché
            const { username, email, password, birthday, description, avatar_url, preferences, tokenAccepted } = validateReq;
            const hashedPassword = await bcrypt.hash(password, 10);

            transaction = new sql.Transaction(await sql.connect(database))
            await transaction.begin()

            const user = await userService.registerUser({ username, email, hashedPassword, birthday, description, avatar_url, enableToken : tokenAccepted }, transaction);
            const userId = user.user_id

            if (preferences && preferences.length > 0) {
                await userService.addUserPreferences(userId, preferences, transaction);
            }

            await transaction.commit()

            const payload = {
                userId: userId,
                email: user.email,
                username: user.username,
            }
            const option = {
                expiresIn : '9d'
            }
            const secret= process.env.JWT_SECRET
            const token = jwt.sign(payload, secret, option)

            if (tokenAccepted === true) {
                console.log("DANS LE COOKIE");
                res.cookie('token', token, { expires : new Date(Date.now() + 86400000), httpOnly : true })
                return res.status(201).json({token : token, message: "Utilisateur connecté et enregistré." });


            } 

            console.log("DANS LE SESSION COOKIE ");
                   res.cookie('token', token)
            return res.status(201).json({token : token, message: "Utilisateur connecté et enregistré." });

        } catch (error) {
                if (transaction) {
                    await transaction.rollback()
                    throw new Error('Le rollback fonctionne')
                }
            console.error(error);
            return res.status(500).json({ message: "Internal server error." });
        }
    },

    getUserByName : async (req, res) => {
        try {
            const username = req.query.username
            if (!username) {
                return res.status(400).json({message :"Veuillez rentrer un nom d'utilisateur pour la recherche."}) //vérifier le code http
            }
            const result = await userService.getUserByUsername(username);
            if (result) {
                return res.status(200).json(result) //vérifier le code http
            } else {
                return res.status(404).json({message :"Aucun utilisateur trouvé."}) //vérifier le code http
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({message :"Une erreur interne au serveur est survenue."}) //vérifier le code http
        }
    },

    getYourProfile : async (req, res) => {

        try {
            const username = req.payload.username

            // console.log('USERNAME : ' + username);
            const result = await userService.getUserByUsername(username);
            // console.log('RESULT : ' + result);
            if (result) {
                return res.status(200).json(result) //vérifier le code http
            } else {
                return res.status(404).json({message :"Aucun utilisateur trouvé."}) 
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({message :"Une erreur interne au serveur est survenue."}) 
        }

    },


    getUserSettings: async (req, res) => {
        try {
            const { userId } = req.payload;
            const user = await userService.getUserSettings(userId);
            if (user) {
                return res.status(200).json(user);
            } else {
                return res.status(404).json({ message: "Utilisateur non trouvé." });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erreur interne du serveur" });
        }
    },

    updateUserProfile : async (req, res) => {
        let transaction
        try {
            
            const { userId } = req.payload;
            //IL MANQUAIT UN AWAIT SA MERE LA PUTE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            const validateReq = await updateValidator.validate(req.body, {abortEarly: false})
            // console.log('VALIDATE REQ : ' + (await validateReq).description);
            
            if (validateReq.error) {
                return res.status(400).json({message : validateReq.error.details[0].message})
            }
            
            const { username, description, avatar_url, preferences } = validateReq;
            // console.log(description + ' DESCRIPTION IN CONTROLLER');

            transaction = new sql.Transaction(await sql.connect(database))
            await transaction.begin()

            const updatedUser = await userService.updateUserProfile({ username, description, avatar_url, preferences }, userId) 

             if (!updatedUser) {
                return res.status(400).json({message : 'Erreur lors de la mise à jour du profil'})
             }

             await transaction.commit();
             return res.status(200).json({ message: 'Profil mis à jour avec succès', user: updatedUser });

         } catch (error) {
             if (transaction) {
                 await transaction.rollback();
             }
             console.error(error);
             return res.status(500).json({ message: 'Erreur interne du serveur' });
         }
    },

    updateUserEmail : async (req, res) =>{
        try {
            
            const { userId } = req.payload
            const { email } = req.body

            const updatedEmail = await userService.updateEmail(userId, email)

            if (!updatedEmail) {
                return res.status(400).json({message : 'Erreur lors de la mise à jour de l\'email.'})
            }

            return res.status(201).json({message : 'Email mis à jour'})

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erreur interne du serveur' });
        }
    },

    updateUserPassword : async (req, res) => {
        try {

            const { userId } = req.payload;
            // console.log('USER ID UPDATE PASSWORD : ' + userId);
            const { oldPassword, newPassword } = req.body;
            // console.log('OLD PASSWORD : ' + oldPassword);
            // console.log('NEW PASSWORD : ' + newPassword);

            const updatedUser = await userService.updateUserPassword(userId, oldPassword, newPassword);
            if (!updatedUser) {
                return res.status(400).json({ message: 'Erreur lors de la mise à jour du mot de passe' });
            }

            return res.status(200).json({ message: 'Mot de passe mis à jour avec succès'})

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erreur interne du serveur' });
        }
    },

    archiveUser : async (req, res) => {
        let transaction
        try {

            const userId = req.payload.userId

            transaction = new sql.Transaction(await sql.connect(database))
            await transaction.begin()

            const result = await userService.archiveUser(userId, transaction)

            if (result) {
                await transaction.commit()

                return res.status(201).json({message : 'Utilisateur supprimé avec succès'})
            }

            return res.status(500).json({message: 'Erreur interne du serveur'})


        } catch (error) {
            if (transaction) {
                await transaction.rollback();
            }
            console.error(error);
            return res.status(500).json({ message: 'Erreur interne du serveur' });
        }
    }

};

module.exports = userController