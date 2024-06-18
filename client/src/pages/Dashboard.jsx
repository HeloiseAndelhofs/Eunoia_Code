import React, { useState, useEffect } from "react";
import AuthNav from "../components/AuthNav"; // Composant de navigation pour les utilisateurs authentifiés
import axios from 'axios'; // Module Axios pour les requêtes HTTP
import Profile from "../components/Profile"; // Composant Profile pour afficher les données du profil

const Dashboard = () => {
    const [profileData, setProfileData] = useState(null); // État local pour stocker les données du profil
    const [error, setError] = useState(null); // État local pour gérer les erreurs

    useEffect(() => {
        // Fonction asynchrone pour récupérer les données du profil depuis l'API
        const getProfileData = async () => {
            try {
                // Requête GET vers l'API pour récupérer les données du profil
                const result = await axios.get('http://localhost:3000/api/eunoia/profile', {
                    withCredentials: true // Utilisation des cookies avec les requêtes Axios
                });

                // Mise à jour de l'état avec les données du profil récupérées
                setProfileData(result.data);

                // Exemple de stockage de l'ID utilisateur dans le localStorage
                localStorage.setItem('userId', result.data.user.userId);

            } catch (error) {
                console.error(error);
                // Gestion des erreurs : affichage du message d'erreur de l'API ou d'une erreur générique
                setError(error.response ? error.response.data.message : error.message);
            }
        };

        // Appel de la fonction pour récupérer les données du profil lors du montage du composant
        getProfileData();
    }, []); // Le tableau vide comme deuxième argument signifie que useEffect s'exécute une fois après le premier rendu

    // Affichage du message d'erreur s'il y en a
    if (error) {
        return <p>Erreur : {error}</p>;
    }

    // Rendu JSX du composant Dashboard
    return (
        <>
            <AuthNav /> {/* Composant de navigation pour les utilisateurs authentifiés */}

            {/* Affichage du composant Profile avec les données du profil */}
            <Profile profileData={profileData} />
        </>
    );
};

export default Dashboard;
