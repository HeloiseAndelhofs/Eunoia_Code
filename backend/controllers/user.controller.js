const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userService = require('../services/userService');
const loginValidators = require('../validators/login.validators');

const userController = {

    // login : async (req, res) => {

    //     try {
    //         const validateReq = yup.validate(req.body);
    //         if (validateReq.error) {
    //             return res.status(400).json({message : validateReq.error}) //vérifier le code http
    //         }

    //         const { username, password } = validateReq
    //         const authHeader = req.headers['authorization'];
    //         const token = authHeader && authHeader.split(' ')[1];


    //     } catch (error) {
            
    //     }

    // },

    register : async (req, res) => {


        
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