const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userService = require('../services/userService')

const userController = {

    login : async (req, res) => {

        

    },

    register : async (req, res) => {

    },

    getUserByName : async (req, res) => {
        try {
            const username = req.query.username
            if (!username) {
                return res.status(400).json({message :"Veuillez rentrer un nom d'utilisateur pour la recherche."})
            }
            const result = await userService.getUserByUsername(username);
            if (result) {
                return res.status(200).json(result)
            } else {
                return res.status(404).json({message :"Aucun utilisateur trouvé."})
            }
        } catch (error) {
            console.error(error);
            return res.sendStatus(500).json({message :"Une erreur interne au serveur est survenue."})
        }
    }

};

module.exports = userController