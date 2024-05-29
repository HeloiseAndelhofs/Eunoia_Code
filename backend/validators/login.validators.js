const yup = require('yup');

const loginValidators = yup.object({

    username : yup.string()
        .min(1).max(50)
        .required(),
    password : yup.string()
        .min(1).max(100)
        .required(),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password')], 'Les mots de passe doivent correspondre')
        .min(1).max(100)
        .required('Veuillez confirmer votre mot de passe'),
    //vérifier les max charactères + vérification du mot de passe dans le register par rapport à la sécurité

});

module.exports = loginValidators