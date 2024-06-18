const yup = require('yup');

const loginValidators = yup.object().shape({
    username: yup.string()
        .min(1).max(50)
        .when('tokenAccepted', {
            is: false,
            then: () => yup.string().required(), //champ requis si pas de token
            otherwise: () => yup.string().notRequired(), //si token champ n'est pas requis
        }),
    password: yup.string()
        .min(1).max(100)
        .when('tokenAccepted', {
            is: false,
            then: () => yup.string().required(), //champ requis si pas de token
            otherwise: () => yup.string().notRequired(), //si token champ n'est pas requis
        }),
    tokenAccepted: yup.boolean()
        .default(false)
});

module.exports = loginValidators;
