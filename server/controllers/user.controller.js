const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userService = require('../services/userService');
const loginValidators = require('../validators/login.validators');
const { registerValidatorStep1, registerValidatorStep2 } = require('../validators/register.validators');
const updateValidator = require('../validators/update.validators');
const utilityFunc = require('../services/utilityFunctions.service');
const sql = require('mssql');
const database = require('../database');
const updatePasswordValidator = require('../validators/updatePassword.validator');

const userController = {

    // Gestion de la connexion utilisateur
    login: async (req, res) => {
        try {
            const token = req.cookies.token;

            // Si un token existe, vérifier sa validité
            if (token) {
                try {
                    const payload = jwt.verify(token, process.env.JWT_SECRET);
                    console.log(payload.userId, payload);
                    const user = await utilityFunc.selectUserById(payload.userId);

                    //si le token est bon
                    if (user) {
                        return res.status(200).json({ message: `Utilisateur connecté avec succès via le token, utilisateur : ${user.username}` });
                    }

                    //si l'erreur vient de l'expiration du token
                } catch (error) {
                    if (error.name !== "TokenExpiredError") {
                        return res.status(403).json({ message: "Token invalide." });
                    }
                }
            }

            // Validation des informations de connexion
            const validateReq = await loginValidators.validate(req.body);
            if (validateReq.error) {
                return res.status(400).json({ message: validateReq.error.details[0].message });
            }

            const { username, password, tokenAccepted } = validateReq;
            const user = await userService.login(username, password, token);

            if (!user) {
                return res.status(404).json({ message: "Aucun utilisateur n'a été trouvé, voulez vous créer un compte ?" });
            }

            //on regarde si le status du token (accepté ou non) est d'actualité, si non on le met à jour
            let tokenStatus = await utilityFunc.tokenStatus(username);
            const tokenStatusForm = tokenAccepted;

            if (tokenStatus !== tokenStatusForm) {
                tokenStatus = await utilityFunc.tokenStatusUpdate(tokenStatusForm, username);
            }

            //création d'un nouveau payloas
            const payload = {
                userId: user.user_id,
                email: user.email,
                username: user.username,
                newToken: true
            };
            const option = { expiresIn: '9d' };
            const secret = process.env.JWT_SECRET;
            const newToken = jwt.sign(payload, secret, option);

            switch (tokenStatus) {
                //si token accepté, cookie qui dure 9 jours
                case true:
                    res.cookie('token', newToken, { expires: new Date(Date.now() + 86400000), httpOnly: true });
                    return res.status(201).json({ token: newToken, message: "Utilisateur connecté." });

                //si non session cookie
                case false:
                    res.cookie('token', newToken);
                    return res.status(201).json({ token: newToken, message: "Utilisateur connecté." });

                default:
                    return res.status(500).json({ message: "Status du token inattendu." });
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error." });
        }
    },

    // Gestion de l'inscription utilisateur
    register: async (req, res) => {
        let transaction;
        const { step } = req.body;
        console.log(req.body, step, req.cookies.userId);
        let userId;

        try {
            transaction = new sql.Transaction(await sql.connect(database));
            await transaction.begin();

            //si on l'étape est la premiere
            if (step === 1) {
                console.log('STEP 1');

                const validateReq = await registerValidatorStep1.validate(req.body, { abortEarly: false }); //retourn la premiere erreur de validation
                if (validateReq.error) {
                    return res.status(400).json({ message: validateReq.error });
                }

                const { username, email, password, birthday } = validateReq;
                const hashedPassword = await bcrypt.hash(password, 10);

                const user = await userService.registerUserStep1({ username, email, hashedPassword, birthday }, transaction);
                userId = user.user_id;
                await transaction.commit();

                //ajout du userId qui vient d'etre créé pour pouvoir l'utiliser dans le step 2
                res.cookie('userId', userId, { expires: new Date(Date.now() + 60000), httpOnly: true });
                return res.status(201).json({ userId: user.user_id, message: "Étape 1 de l'inscription réussie. Veuillez compléter l'étape 2." });

            //step 2
            } else if (step === 2 && req.cookies.userId) {
                console.log('STEP 2');

                userId = req.cookies.userId;

                const validateReq = await registerValidatorStep2.validate(req.body, { abortEarly: false });
                if (validateReq.error) {
                    return res.status(400).json({ message: validateReq.error });
                }

                const { description, avatar_url, preferences, tokenAccepted } = validateReq;

                await userService.registerUserStep2(userId, { description, avatar_url, tokenAccepted }, transaction);

                //si il y a bien des preferences ajoutés
                if (preferences && preferences.length > 0) {
                    await userService.addUserPreferences(userId, preferences, transaction);
                }

                await transaction.commit();

                const user = await utilityFunc.selectUserById(userId);

                //ajout du token dans cookie
                const payload = {
                    userId: userId,
                    email: user.email,
                    username: user.username,
                };

                const option = { expiresIn: '9d' };
                const secret = process.env.JWT_SECRET;
                const token = jwt.sign(payload, secret, option);

                if (tokenAccepted) {
                    res.cookie('token', token, { expires: new Date(Date.now() + 86400000), httpOnly: true });
                    return res.status(201).json({ token: token, message: "Register step 2 s'est bien passé, Utilisateur connecté et enregistré." });
                }

                res.cookie('token', token);
                return res.status(201).json({ token: token, message: "Register step 2 s'est bien passé." });

            } else {
                return res.status(400).json({ message: "Données invalides." });
            }
        } catch (error) {
            if (transaction) {
                await transaction.rollback();
            }
            console.error(error);
            return res.status(500).json({ message: "Erreur interne du serveur." });
        }
    },

    // Récupère un utilisateur par son nom d'utilisateur
    getUserByName: async (req, res) => {
        try {
            const username = req.query.username;
            if (!username) {
                return res.status(400).json({ message: "Veuillez rentrer un nom d'utilisateur pour la recherche." });
            }
            const result = await userService.getUserByUsername(username);
            if (result) {
                return res.status(200).json(result);
            } else {
                return res.status(404).json({ message: "Aucun utilisateur trouvé." });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Une erreur interne au serveur est survenue." });
        }
    },

    // Récupère le profil de l'utilisateur connecté
    getYourProfile: async (req, res) => {
        try {
            const username = req.payload.username;

            const result = await userService.getUserByUsername(username);
            if (result) {
                return res.status(200).json(result);
            } else {
                return res.status(404).json({ message: "Aucun utilisateur trouvé." });
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Une erreur interne au serveur est survenue." });
        }
    },

    // Récupère les paramètres utilisateur
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

    // Met à jour le profil utilisateur
    updateUserProfile: async (req, res) => {
        let transaction;
        try {
            const { userId } = req.payload;

            // Validation des données de mise à jour du profil
            const validateReq = await updateValidator.validate(req.body, { abortEarly: false });
            if (validateReq.error) {
                return res.status(400).json({ message: validateReq.error.details[0].message });
            }

            const { username, description, avatar_url, preferences } = validateReq;

            transaction = new sql.Transaction(await sql.connect(database));
            await transaction.begin();

            const updatedUser = await userService.updateUserProfile({ username, description, avatar_url, preferences }, userId, transaction);

            if (!updatedUser) {
                return res.status(400).json({ message: 'Erreur lors de la mise à jour du profil' });
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

    //mis à jour de l'email
    updateUserEmail : async (req, res) =>{
        try {
            
            const { userId } = req.payload
            const { newEmail } = req.body

            const updatedEmail = await userService.updateEmail(userId, newEmail)

            if (!updatedEmail) {
                return res.status(400).json({message : 'Erreur lors de la mise à jour de l\'email.'})
            }

            return res.status(201).json({message : 'Email mis à jour'})

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erreur interne du serveur' });
        }
    },

    //mis à jour du mot de passe
    updateUserPassword : async (req, res) => {
        try {

            const { userId } = req.payload;
            // console.log('USER ID UPDATE PASSWORD : ' + userId);
            const validateReq = await updatePasswordValidator.validate(req.body, {abortEarly : false})
            const { currentPassword, newPassword } = validateReq;
            // console.log('OLD PASSWORD : ' + oldPassword);
            // console.log('NEW PASSWORD : ' + newPassword);

            const updatedUser = await userService.updateUserPassword(userId, currentPassword, newPassword);
            if (!updatedUser) {
                return res.status(400).json({ message: 'Erreur lors de la mise à jour du mot de passe' });
            }

            return res.status(200).json({ message: 'Mot de passe mis à jour avec succès'})

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erreur interne du serveur' });
        }
    },

    //archiver utilisateur
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
            if (transaction.error) {
                await transaction.rollback();
            }
            console.error(error);
            return res.status(500).json({ message: 'Erreur interne du serveur' });
        }
    }

};

module.exports = userController