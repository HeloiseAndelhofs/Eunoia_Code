import React, { useState, useEffect } from "react";
import AuthNav from "../components/AuthNav";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import styles from '../css_module/Settings.module.css';

import EditEmail from '../components/EditEmail';
import EditPassword from '../components/EditPassword';
import DeleteProfile from '../components/DeleteProfile';

const Settings = () => {
    const [email, setEmail] = useState(null); // État local pour stocker l'email de l'utilisateur
    const [error, setError] = useState(null); // État local pour gérer les erreurs

    const navigate = useNavigate(); // Hook de navigation pour rediriger l'utilisateur

    useEffect(() => {
        // Fonction pour récupérer l'email de l'utilisateur depuis l'API
        const getEmail = async () => {
            try {    
                const response = await axios.get('http://localhost:3000/api/eunoia/settings', { withCredentials: true });
                setEmail(response.data.email); // Met à jour l'état local avec l'email récupéré depuis l'API
            } catch (error) {
                console.error(error);
                // Gère les erreurs en affichant un message d'erreur spécifique si disponible
                setError(error.response ? error.response.data.message : error.message);
            }
        };
        getEmail(); // Appelle la fonction getEmail une seule fois au chargement du composant
    }, []); // Tableau vide pour indiquer que useEffect ne dépend d'aucune variable et s'exécute une fois

    // Si une erreur est présente, affiche un message d'erreur stylisé
    if (error) {
        return <p className={styles.errorMessage}>Erreur : {error}</p>;
    }

    // Rendu du composant Settings
    return (
        <>
            <AuthNav /> {/* Composant de navigation authentifié */}
            <div className={styles.settingsContainer}>
                <h1>Paramètres</h1> {/* Titre de la page */}
                {/* Composant pour modifier l'email, passe les props nécessaires */}
                <EditEmail email={email} setEmail={setEmail} setError={setError} />
                {/* Composant pour modifier le mot de passe, passe la fonction setError */}
                <EditPassword setError={setError} />
                {/* Composant pour supprimer le profil, passe la fonction navigate et setError */}
                <DeleteProfile navigate={navigate} setError={setError} />
            </div>
        </>
    );
};

export default Settings;
