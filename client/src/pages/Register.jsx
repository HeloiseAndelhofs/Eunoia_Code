import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import NoAuthNav from "../components/NoAuthNav";
import axios from 'axios';
import Step1Form from '../components/Step1Form';
import Step2Form from '../components/Step2Form';

const Register = () => {
    // États locaux pour gérer les étapes du formulaire d'inscription
    const [step, setStep] = useState(1); // État pour suivre l'étape actuelle (1ère étape par défaut)

    // États locaux pour stocker les données des formulaires des étapes 1 et 2
    const [formDataStep1, setFormDataStep1] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        birthday: "",
    });

    const [formDataStep2, setFormDataStep2] = useState({
        description: "",
        avatar_url: "",
        tokenAccepted: false,
        preferences: []
    });

    const navigate = useNavigate(); // Hook de navigation pour rediriger l'utilisateur

    // Fonction pour gérer les changements dans le formulaire de la première étape
    const handleChangeStep1 = (e) => {
        const { name, value, type, checked } = e.target;
        setFormDataStep1({
            ...formDataStep1,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // Fonction pour gérer les changements dans le formulaire de la deuxième étape
    const handleChangeStep2 = (e) => {
        const { name, value, type, checked } = e.target;
        setFormDataStep2({
            ...formDataStep2,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // Fonction pour gérer les changements dans les préférences de la deuxième étape
    const handlePreferencesChange = (index, field, value) => {
        const newPreferences = [...formDataStep2.preferences];
        newPreferences[index] = {
            ...newPreferences[index],
            [field]: field === 'is_liked' ? value.target.checked : value
        };
        setFormDataStep2({
            ...formDataStep2,
            preferences: newPreferences
        });
    };

    // Fonction pour ajouter une nouvelle préférence dans la deuxième étape
    const handleAddPreference = () => {
        setFormDataStep2({
            ...formDataStep2,
            preferences: [...formDataStep2.preferences, { type: "", name: "", is_liked: false }]
        });
    };

    // Fonction pour soumettre le formulaire de la première étape
    const handleSubmitStep1 = async (e) => {
        e.preventDefault();
        try {
            // Envoie des données au serveur pour la première étape d'inscription
            await axios.post('http://localhost:3000/api/register', {
                step: 1,
                ...formDataStep1
            }, {
                withCredentials: true // Inclut les credentials dans la requête (cookies, tokens, etc.)
            });
            setStep(2); // Passe à la deuxième étape après soumission réussie
        } catch (error) {
            console.error("There was an error!", error);
        }
    };

    // Fonction pour soumettre le formulaire de la deuxième étape
    const handleSubmitStep2 = async (e) => {
        e.preventDefault();
        try {
            // Envoie des données au serveur pour la deuxième étape d'inscription
            await axios.post('http://localhost:3000/api/register', {
                step: 2,
                ...formDataStep2
            }, {
                withCredentials: true // Inclut les credentials dans la requête (cookies, tokens, etc.)
            });
            navigate('/login'); // Redirige vers la page de connexion après soumission réussie
        } catch (error) {
            console.error("There was an error!", error);
        }
    };

    // Rendu du composant d'inscription

    return (
        <>
            <NoAuthNav />
            <h1>Inscription</h1>
            {/* Affiche le formulaire de la première étape si step === 1 */}
            {step === 1 && (
                <Step1Form
                    formData={formDataStep1}
                    handleChange={handleChangeStep1}
                    handleSubmit={handleSubmitStep1}
                />
            )}
            {/* Affiche le formulaire de la deuxième étape si step === 2 */}
            {step === 2 && (
                <Step2Form
                    formData={formDataStep2}
                    handleChange={handleChangeStep2}
                    handlePreferencesChange={handlePreferencesChange}
                    handleAddPreference={handleAddPreference}
                    handleSubmit={handleSubmitStep2}
                />
            )}
        </>
    );
};

export default Register;
