const yup = require('yup')

const updatePasswordValidator = yup.object({
        currentPassword: yup.string()
            .min(8, 'Le mot de passe doit comporter au moins 8 caractères')
            .max(100)
            .matches(/^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?\s]*$/, 'Le mot de passe doit contenir des lettres, des chiffres et des caractères spéciaux'),
        newPassword: yup.string()
            .min(8, 'Le mot de passe doit comporter au moins 8 caractères')
            .max(100)
            .matches(/^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?\s]*$/, 'Le mot de passe doit contenir des lettres, des chiffres et des caractères spéciaux'),
        confirmNewPassword: yup.string()
            .oneOf([yup.ref('newPassword')], 'Les mots de passe doivent correspondre')
            .min(1).max(100)
})

module.exports = updatePasswordValidator