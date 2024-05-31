const yup = require('yup')

const registerValidator = yup.object({

    username: yup.string()
        .min(1).max(50)
        .matches(/^[A-Za-z0-9_\s]*$/)
        .required(),
    email: yup.string()
        .email()
        .required(),
    password: yup.string()
        .min(8, 'Le mot de passe doit comporter au moins 8 caractères')
        .max(100)
        .matches(/^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?\s]*$/, 'Le mot de passe doit contenir des lettres, des chiffres et des caractères spéciaux')
        .required(),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password')], 'Les mots de passe doivent correspondre')
        .min(1).max(100)
        .required('Veuillez confirmer votre mot de passe'),
    birthday: yup.date()
        .max(new Date(), "La date de naissance ne peut pas être dans le futur")
        .required('Veuillez fournir votre date de naissance'),
    description: yup.string()
        .max(250),
    tokenAccepted: yup
        .oneOf([true, false])

});

module.exports = registerValidator;
