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

                    break;
            
                case false:
                    res.cookie('token', newToken)
                    return res.status(201).json({token : token, message: "Utilisateur connecté." });
                    
                    break;

                default:
                    return res.status(500).json({ message: "Status du token innatendu." });
                    break;
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

            const user = await userService.registerUser({ username, email, hashedPassword, birthday, description, avatar_url, enableToken : tokenAccepted, transaction });
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

    updateUserProfile : async (req, res) => {
        try {
            
            const { userId } = req.payload;
            const validateReq = updateValidator.validate(req.body, {abortEarly: false})
            const { username, email, oldPassword, newPassword, description, avatar_url, preferences } = validateReq;

            const checkedUserUpdateField = await userService.updateUserProfile({ username, email, oldPassword, newPassword, description, avatar_url, preferences }, userId) 

             


        } catch (error) {
            
        }
    }

};

module.exports = userController