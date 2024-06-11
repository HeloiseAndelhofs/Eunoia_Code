const yup = require('yup');

const registerValidatorStep1 = yup.object({
    username: yup.string()
        .min(1).max(50)
        .matches(/^[A-Za-z0-9_\s]*$/)
        .required('Veuillez renseigner votre nom d\'utilisateur.'),
    email: yup.string()
        .email()
        .required('Veuillez renseigner votre email.'),
    password: yup.string()
        .min(8, 'Le mot de passe doit comporter au moins 8 caractères')
        .max(100)
        .matches(/^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?\s]*$/, 'Le mot de passe doit contenir des lettres, des chiffres et des caractères spéciaux')
        .required('Veuillez renseigner votre mot de passe.'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password')], 'Les mots de passe doivent correspondre')
        .min(1).max(100)
        .required('Veuillez confirmer votre mot de passe'),
    birthday: yup.date()
        .max(new Date(), "La date de naissance ne peut pas être dans le futur")
        .required('Veuillez fournir votre date de naissance'),
});

const registerValidatorStep2 = yup.object({
    description: yup.string()
        .max(250),
    avatar_url: yup.string()
        .url()
        .required(),
    tokenAccepted: yup.boolean().required('Veuillez cocher la case si vous acceptez les cookies.'),
    preferences: yup.array().of(
        yup.object().shape({
            type: yup.string().required('Le type est requis.'),
            name: yup.string().required('Le nom est requis.'),
            is_liked: yup.boolean().required('Veuillez cocher la case pour indiquer si vous aimez ou non le sujet ajouté.')
        })
    )
});

module.exports = { registerValidatorStep1, registerValidatorStep2 };
