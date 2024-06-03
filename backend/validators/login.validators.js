const yup = require('yup');

const loginValidators = yup.object({

    username : yup.string()
        .min(1).max(50)
        .required(),
    password : yup.string()
        .min(1).max(100)
        .required(),
    tokenAccepted : yup.boolean()
        .default(false)

});

module.exports = loginValidators