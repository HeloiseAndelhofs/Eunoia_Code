const yup = require('yup')

const updateValidator = yup.object({

    username: yup.string()
        .min(1).max(50)
        .matches(/^[A-Za-z0-9_\s]*$/),
    description: yup.string()
        .max(250),
    avatar_url: yup.string()
        .url(),
    tokenAccepted: yup.boolean(),
    preferences: yup.array().of(
        yup.object().shape({
            type: yup.string().required('Le type est requis.'),
            name: yup.string().required('Le nom est requis.'),
            is_liked: yup.boolean()
        })
    )

});

module.exports = updateValidator;


