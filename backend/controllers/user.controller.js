const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userService = require('../services/userService');
const loginValidators = require('../validators/login.validators');
const registerValidator = require('../validators/register.validators')

const userController = {

    login : async (req, res) => {

        try {

            const validateReq = loginValidators.validate(req.body);
            if (validateReq.error) {
                return res.status(400).json({message : validateReq.error}) //vérifier le code http
            }

            const { username, password } = validateReq
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];

            const user = await userService.login(username, password, token)


        } catch (error) {
            
        }

    },

    register: async (req, res) => {
        try {

            const validateReq = await registerValidator.validate(req.body)
            if (validateReq.error) {
                return res.status(400).json({message : validateReq.error})
            }

            const { username, email, password, birthday, description, avatar_url, preferences } = validateReq;
            const hashedPassword = await bcrypt.hash(password, 10);
            const userId = await userService.registerUser({ username, email, hashedPassword, birthday, description, avatar_url });

            if (preferences && preferences.length > 0) {
                await userService.addUserPreferences(userId, preferences);
            }

            const payload = {
                userId: user.user_id,
                email: user.email,
                username: user.username,
                password : user.password
            }
            const option = {
                expiresIn : '9d'
            }
            const secret= process.env.JWT_SECRET
            const token = jwt.sign(payload, secret, option)

            res.setHeader('Authorization', `Bearer ${token}`)
            res.status(201).json({token : token, message: "User registered and connected successfully." });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error." });
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
    }

};

module.exports = userController