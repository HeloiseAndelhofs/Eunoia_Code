const yup = require('yup');

const loginValidators = yup.object().shape({
    username: yup.string()
        .min(1).max(50)
        .when('tokenAccepted', {
            is: false,
            then: yup.string().required(),
            otherwise: yup.string().notRequired(),
        }),
    password: yup.string()
        .min(1).max(100)
        .when('tokenAccepted', {
            is: false,
            then: yup.string().required(),
            otherwise: yup.string().notRequired(),
        }),
    tokenAccepted: yup.boolean()
        .default(false)
});

module.exports = loginValidators;
