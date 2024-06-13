import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import AuthNav from "../components/AuthNav.jsx";
import styles from '../css_module/UpdateProfile.module.css';
import deleteImg from '../assets/delete-blanc.svg'

const Edit = () => {
    // const [profileData, setProfileData] = useState(null)
    const [formData, setFormData] = useState({
        username: '',
        description: '',
        preferences: []
    });
    // const [formData, setFormData] = useState(null)

    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getProfileData = async () => {
            try {
                const result = await axios.get('http://localhost:3000/api/eunoia/profile', {
                    withCredentials: true
                });

                setFormData({
                    username : result.data.user.username,
                    description : result.data.user.description,
                    preferences : result.data.preferences
                });
                // console.log('PROFILE DATA :' + formData);

            } catch (error) {
                console.error(error);
                setError(error.response ? error.response.data.message : error.message);
            }
        };
        getProfileData();
    }, []);

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

    const handleAddPreference = () => {
        setFormData({
            ...formData,
            preferences: [...formData.preferences, { type: "", name: "", is_liked: false }]
        });
    };

    const handleRemovePref = (index) => {
        const updatedPrefs = [...formData.preferences];
        updatedPrefs.splice(index, 1);
        setFormData({
            ...formData,
            preferences: updatedPrefs
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put('http://localhost:3000/api/eunoia/profile/edit', formData, {
                withCredentials: true
            });

            navigate('/eunoia/profile');
        } catch (error) {
            console.error(error);
            setError(error.response ? error.response.data.message : error.message);
        }
    };

    if (error) {
        return <p className={styles.errorMessage}>Erreur : {error}</p>;
    }

    return (
        <>
            <AuthNav />
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
                                    Est ce que vous appréciez jouer/écouter au jeu/musique que vous venez de mentionner ?
                                </label>

                                <button type="button" onClick={(e) => handleRemovePref(index)}><img src={deleteImg} alt="delete" /></button>
                            </div>
                        ))}
                        <button type="button" onClick={handleAddPreference}>Ajouter une préférence</button>
                    </div>
                    <button type="submit">Mettre à jour</button>
                </form>
            </div>
        </>
    );
};

export default Edit;
