import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import AuthNav from "../components/AuthNav.jsx"; // Composant de navigation pour les utilisateurs authentifiés
import styles from '../css_module/UpdateProfile.module.css'; // Styles CSS pour le composant
import deleteImg from '../assets/trash.svg'; // Icône pour supprimer une préférence

const Edit = () => {
    // État local pour les données du formulaire
    const [formData, setFormData] = useState({
        username: '',
        description: '',
        preferences: []
    });

    const [error, setError] = useState(null); // État local pour gérer les erreurs
    const navigate = useNavigate(); // Hook de navigation

    // Effet de chargement initial pour récupérer les données du profil depuis l'API
    useEffect(() => {
        const getProfileData = async () => {
            try {
                const result = await axios.get('http://localhost:3000/api/eunoia/profile', {
                    withCredentials: true // Utilisation des cookies avec les requêtes Axios
                });

                // Mise à jour de l'état avec les données récupérées
                setFormData({
                    username : result.data.user.username,
                    description : result.data.user.description,
                    preferences : result.data.preferences
                });

            } catch (error) {
                console.error(error);
                setError(error.response ? error.response.data.message : error.message); // Gestion des erreurs
            }
        };
        getProfileData(); // Appel de la fonction pour récupérer les données du profil lors du montage du composant
    }, []);

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

    // Fonction pour gérer les changements dans les préférences
    const handlePreferenceChange = (index, field, value) => {
        const newPreferences = [...formData.preferences];
        newPreferences[index] = {
            ...newPreferences[index],
            [field]: value
        };
        setFormData({
            ...formData,
            preferences: newPreferences
        });
    };

    // Fonction pour ajouter une nouvelle préférence
    const handleAddPreference = () => {
        setFormData({
            ...formData,
            preferences: [...formData.preferences, { type: "", name: "", is_liked: false }]
        });
    };

    // Fonction pour supprimer une préférence
    const handleRemovePref = (index) => {
        const updatedPrefs = [...formData.preferences];
        updatedPrefs.splice(index, 1);
        setFormData({
            ...formData,
            preferences: updatedPrefs
        });
    };

    // Fonction pour soumettre les modifications du profil
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Envoi des données mises à jour vers l'API pour modification du profil
            await axios.put('http://localhost:3000/api/eunoia/profile/edit', formData, {
                withCredentials: true // Utilisation des cookies avec les requêtes Axios
            });

            navigate('/eunoia/profile'); // Redirection vers la page de profil après la mise à jour

        } catch (error) {
            console.error(error);
            setError(error.response ? error.response.data.message : error.message); // Gestion des erreurs
        }
    };

    // Affichage du message d'erreur s'il y en a
    if (error) {
        return <p className={styles.errorMessage}>Erreur : {error}</p>;
    }

    // Rendu JSX du composant
    return (
        <>
            <AuthNav /> {/* Composant de navigation pour les utilisateurs authentifiés */}

            <div className={styles.updateProfileContainer}>
                <h1>Mettre à jour votre profil</h1>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="username">Nom d'utilisateur</label>
                        <input 
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="description">Description</label>
                        <textarea 
                            name="description" 
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Préférences</label>
                        {/* Affichage des préférences sous forme de champs de formulaire */}
                        {formData.preferences && formData.preferences.map((pref, index) => (
                            <div key={index}>
                                <input
                                    type="text"
                                    name={`type-${index}`}
                                    value={pref.type}
                                    onChange={(e) => handlePreferenceChange(index, 'type', e.target.value)}
                                />
                                <input
                                    type="text"
                                    name={`name-${index}`}
                                    value={pref.name}
                                    onChange={(e) => handlePreferenceChange(index, 'name', e.target.value)}
                                />
                                <label htmlFor={`is_liked-${index}`}>
                                    <input
                                        type="checkbox"
                                        name={`is_liked-${index}`}
                                        checked={pref.is_liked}
                                        onChange={(e) => handlePreferenceChange(index, 'is_liked', e.target.checked)}
                                    />
                                    Est-ce que vous appréciez jouer/écouter au jeu/musique que vous venez de mentionner ?
                                </label>

                                <button type="button" onClick={(e) => handleRemovePref(index)}><img src={deleteImg} alt="delete" /></button>
                            </div>
                        ))}
                        <button type="button" id="addPref" onClick={handleAddPreference}>Ajouter une préférence</button>
                    </div>
                    <button type="submit">Mettre à jour</button>
                </form>
            </div>
        </>
    );
};

export default Edit;
