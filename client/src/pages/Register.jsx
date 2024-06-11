import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import NoAuthNav from "../components/NoAuthNav";
import axios from 'axios';

const Register = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        birthday: "",
        description: "",
        avatar_url: "",
        tokenAccepted: false,
        preferences: []
    });

    const [currentPreference, setCurrentPreference] = useState({
        type: "",
        name: "",
        isLiked: false
    });

    const navigate = useNavigate();

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

    const handlePreferenceChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCurrentPreference({
            ...currentPreference,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const addPreference = () => {
        setFormData({
            ...formData,
            preferences: [...formData.preferences, currentPreference]
        });
        setCurrentPreference({ type: "", name: "", isLiked: false }); // Reset current preference
    };

    const handleSubmitStep1 = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/register', {
                step: 1,
                username: formData.username,
                email: formData.email,
                password: formData.password,
                confirmPassword: formData.confirmPassword
            });
            console.log(response.data);
            setStep(2);
        } catch (error) {
            console.error(error.response.data);
        }
    };

    const handleSubmitStep2 = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/register', {
                step: 2,
                birthday: formData.birthday,
                description: formData.description,
                avatar_url: formData.avatar_url,
                tokenAccepted: formData.tokenAccepted,
                preferences: formData.preferences
            });
            console.log(response.data);
            navigate('/login');
        } catch (error) {
            console.error(error.response.data);
        }
    };

    return (
        <>
            <NoAuthNav />
            <h1>Inscription</h1>
            {step === 1 && (
                <form onSubmit={handleSubmitStep1}>
                    <div className="register_form">
                        <label htmlFor="username">Nom d'utilisateur</label>
                        <input name="username" type="text" value={formData.username} onChange={handleChange} required />
                    </div>
                    <div className="register_form">
                        <label htmlFor="email">Email</label>
                        <input name="email" type="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="register_form">
                        <label htmlFor="password">Mot de passe</label>
                        <input name="password" type="password" value={formData.password} onChange={handleChange} required />
                    </div>
                    <div className="register_form">
                        <label htmlFor="confirmPassword">Confirmez votre mot de passe</label>
                        <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />
                    </div>
                    <button type="submit">Suivant</button>
                </form>
            )}
            {step === 2 && (
                <form onSubmit={handleSubmitStep2}>
                    <div className="register_form">
                        <label htmlFor="birthday">Date de naissance</label>
                        <input name="birthday" type="date" value={formData.birthday} onChange={handleChange} required />
                    </div>
                    <div className="register_form">
                        <label htmlFor="description">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} />
                    </div>
                    <div className="register_form">
                        <label htmlFor="avatar_url">URL de l'avatar</label>
                        <input name="avatar_url" type="url" value={formData.avatar_url} onChange={handleChange} required />
                    </div>
                    <div className="register_form">
                        <label>Préférences</label>
                        <input name="type" type="text" placeholder="Type, -Jeu-vidéos-, -musique-, -RPG-, -FPS-, -Rock- " value={currentPreference.type} onChange={handlePreferenceChange} required />
                        <input name="name" type="text" placeholder="Nom, -LoL-, -Guild Of Wars-, -Ramones-, -Tchaikovsky-" value={currentPreference.name} onChange={handlePreferenceChange} required />
                        <label htmlFor="isLiked">
                            <input type="checkbox" name="isLiked" checked={currentPreference.isLiked} onChange={handlePreferenceChange} />
                            Est ce que vous appreciez jouer/écouter au jeu/musique que vous venez de mentionner ?
                        </label>
                        <button type="button" onClick={addPreference}>Ajouter Préférence</button>
                    </div>
                    <div className="preferences_list">
                        <h3>Préférences ajoutées</h3>
                        <ul>
                            {formData.preferences.map((pref, index) => (
                                <li key={index}>
                                    {pref.type} - {pref.name} - {pref.isLiked ? "Aime" : "N'aime pas"}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="register_form">
                        <label>
                            <input name="tokenAccepted" type="checkbox" checked={formData.tokenAccepted} onChange={(e) => setFormData({...formData, tokenAccepted: e.target.checked})} required />
                            J'accepte les cookies
                        </label>
                    </div>
                    <button type="submit">Inscription</button>
                </form>
            )}
        </>
    );
};

export default Register;
