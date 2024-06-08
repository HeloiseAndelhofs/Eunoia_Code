const yup = require('yup')

const updateValidator = yup.object({

    username: yup.string()
        .min(1).max(50)
        .matches(/^[A-Za-z0-9_\s]*$/),
    email: yup.string()
        .email(),
    oldPassword: yup.string()
        .min(8, 'Le mot de passe doit comporter au moins 8 caractères')
        .max(100)
        .matches(/^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?\s]*$/, 'Le mot de passe doit contenir des lettres, des chiffres et des caractères spéciaux'),
    password: yup.string()
        .min(8, 'Le mot de passe doit comporter au moins 8 caractères')
        .max(100)
        .matches(/^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?\s]*$/, 'Le mot de passe doit contenir des lettres, des chiffres et des caractères spéciaux'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password')], 'Les mots de passe doivent correspondre')
        .min(1).max(100),
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


