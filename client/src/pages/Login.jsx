import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import NoAuthNav from "../components/NoAuthNav";
import { useAuth } from '../AuthContext'; // Importation du hook useAuth depuis le contexte d'authentification
import socket from '../socket'; // Importation du socket pour la connexion en temps réel

const Login = () => {
    const { login } = useAuth(); // Utilisation du hook useAuth pour accéder à la fonction login du contexte

    const [ formData, setFormData ] = useState({
        "username" : '',
        "password" : '',
        "tokenAccepted" : false
    });

    const navigate = useNavigate(); // Hook de navigation

    // Fonction pour gérer les changements dans les champs du formulaire
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData({
                ...formData,
                [name]: checked
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    // Fonction pour soumettre le formulaire de connexion
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Appel à l'API backend pour la connexion
            const result = await axios.post('http://localhost:3000/api/login', {
                username : formData.username,
                password : formData.password,
                tokenAccepted : formData.tokenAccepted
            }, {
                withCredentials: true // Utilisation des cookies avec les requêtes Axios
            });

            // Si la connexion réussit (réponse HTTP 200)
            if (result.status === 200) {
                socket.connect(); // Connexion au socket pour les fonctionnalités en temps réel
                login(); // Appel à la fonction login du contexte d'authentification pour marquer l'utilisateur comme connecté
                navigate('/eunoia/profile'); // Redirection vers la page de profil après la connexion
            }

        } catch (error) {
            console.error("There was an error!", error);
            if (error.response) {
                console.error("Server responded with a status:", error.response.status);
                console.error("Response data:", error.response.data);
            } else if (error.request) {
                console.error("No response received:", error.request);
            } else {
                console.error("Error setting up the request:", error.message);
            }
        }
    };
    
    return (
        <>
            <NoAuthNav /> {/* Composant de navigation pour les utilisateurs non connectés */}

            <h1>Connexion</h1>

            {/* Formulaire de connexion */}
            <form onSubmit={handleSubmit}>
                <div className="login_form">
                    <label htmlFor="username">Nom d'utilisateur</label>
                    <input name="username" type="text" value={formData.username} onChange={handleChange} />
                </div>
                <div className="login_form">
                    <label htmlFor="password">Mot de passe</label>
                    <input name="password" type="password" value={formData.password} onChange={handleChange} />
                </div>
                <div className="login_form">
                    <label htmlFor="tokenAccepted">J'accepte les cookies</label>
                    <input type="checkbox" name="tokenAccepted" checked={formData.tokenAccepted} onChange={handleChange} />
                </div>
                <button type="submit">Connexion</button>
            </form>
        </>
    );
};

export default Login;
