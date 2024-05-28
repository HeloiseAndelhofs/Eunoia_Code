const yup = require('yup');
const { password } = require('../database');

const loginValidators = yup.object({

    email : yup.string().email().required(),
    password : yup.string().min(1).max(50).matches(/^[A-Za-z0-9_\s]*$/).required(),
    username : yup.string().min(1).max(50).matches(/^[A-Za-z0-9_\s]*$/).required()

    //vérifier les max charactères + vérification du mot de passe dans le register par rapport à la sécurité

})