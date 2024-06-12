import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import NoAuthNav from "../components/NoAuthNav";
import axios from 'axios';

const Register = () => {
    const [step, setStep] = useState(1);
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

    const navigate = useNavigate();

    const handleChangeStep1 = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormDataStep1({
                ...formDataStep1,
                [name]: checked
            });
        } else {
            setFormDataStep1({
                ...formDataStep1,
                [name]: value
            });
        }
    };

    const handleChangeStep2 = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormDataStep2({
                ...formDataStep2,
                [name]: checked
            });
        } else {
            setFormDataStep2({
                ...formDataStep2,
                [name]: value
            });
        }
    };

    const handlePreferencesChange = (index, field, value) => {
        const newPreferences = [...formDataStep2.preferences];
        newPreferences[index] = {
            ...newPreferences[index],
            [field]: field === 'isLiked' ? value.target.checked : value
        };
        setFormDataStep2({
            ...formDataStep2,
            preferences: newPreferences
        });
    };

    const handleAddPreference = () => {
        setFormDataStep2({
            ...formDataStep2,
            preferences: [...formDataStep2.preferences, { type: "", name: "", isLiked: false }]
        });
    };

    const handleSubmitStep1 = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/register', {
                step: 1,
                username: formDataStep1.username,
                email: formDataStep1.email,
                password: formDataStep1.password,
                confirmPassword: formDataStep1.confirmPassword,
                birthday: formDataStep1.birthday
            }, {
                withCredentials: true
            });
            console.log(formDataStep1);
            console.log(response.data);
            setStep(2);
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

    const handleSubmitStep2 = async (e) => {
        e.preventDefault();
        try {
            console.log(formDataStep2.description, formDataStep2.avatar_url, formDataStep2.tokenAccepted, formDataStep2.preferences);
            console.log(formDataStep2);

            const response = await axios.post('http://localhost:3000/api/register', {
                step: 2,
                description: formDataStep2.description,
                avatar_url: formDataStep2.avatar_url,
                tokenAccepted: formDataStep2.tokenAccepted,
                preferences: formDataStep2.preferences
            }, {
                withCredentials: true
            });
            console.log(response.data);
            navigate('/login');
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
            <NoAuthNav />
            <h1>Inscription</h1>
            {step === 1 && (
                <form onSubmit={handleSubmitStep1}>
                    <div className="register_form">
                        <label htmlFor="username">Nom d'utilisateur</label>
                        <input name="username" type="text" value={formDataStep1.username} onChange={handleChangeStep1} required />
                    </div>
                    <div className="register_form">
                        <label htmlFor="email">Email</label>
                        <input name="email" type="email" value={formDataStep1.email} onChange={handleChangeStep1} required />
                    </div>
                    <div className="register_form">
                        <label htmlFor="password">Mot de passe</label>
                        <input name="password" type="password" value={formDataStep1.password} onChange={handleChangeStep1} required />
                    </div>
                    <div className="register_form">
                        <label htmlFor="confirmPassword">Confirmez votre mot de passe</label>
                        <input name="confirmPassword" type="password" value={formDataStep1.confirmPassword} onChange={handleChangeStep1} required />
                    </div>
                    <div className="register_form">
                        <label htmlFor="birthday">Date de naissance</label>
                        <input name="birthday" type="date" value={formDataStep1.birthday} onChange={handleChangeStep1} required />
                    </div>
                    <button type="submit">Suivant</button>
                </form>
            )}
            {step === 2 && (
                <form onSubmit={handleSubmitStep2}>
                    <div className="register_form">
                        <label htmlFor="description">Description</label>
                        <textarea name="description" value={formDataStep2.description} onChange={handleChangeStep2} />
                    </div>
                    <div className="register_form">
                        <label htmlFor="avatar_url">URL de l'avatar</label>
                        <input name="avatar_url" type="text" value={formDataStep2.avatar_url} onChange={handleChangeStep2} required />
                    </div>
                    <div className="register_form">
                        <label>Préférences</label>
                        {formDataStep2.preferences.map((preference, index) => (
                            <div key={index}>
                                <input
                                    name={`type-${index}`}
                                    type="text"
                                    placeholder="Type"
                                    value={preference.type}
                                    onChange={(e) => handlePreferencesChange(index, 'type', e.target.value)}
                                    required
                                />
                                <input
                                    name={`name-${index}`}
                                    type="text"
                                    placeholder="Nom"
                                    value={preference.name}
                                    onChange={(e) => handlePreferencesChange(index, 'name', e.target.value)}
                                    required
                                />
                                <label htmlFor={`isLiked-${index}`}>
                                    <input
                                        type="checkbox"
                                        name={`isLiked-${index}`}
                                        checked={preference.isLiked}
                                        onChange={(e) => handlePreferencesChange(index, 'isLiked', e)}
                                    />
                                    Est ce que vous appreciez jouer/écouter au jeu/musique que vous venez de mentionner ?
                                </label>
                            </div>
                        ))}
                        <button type="button" onClick={handleAddPreference}>Ajouter une préférence</button>
                    </div>
                    <div className="register_form">
                        <label htmlFor="tokenAccepted"> J'accepte les cookies </label>
                            <input name="tokenAccepted" type="checkbox" checked={formDataStep2.tokenAccepted} onChange={(e) => setFormDataStep2({...formDataStep2, tokenAccepted: e.target.checked})} />
                    </div>
                    <button type="submit">Inscription</button>
                </form>
            )}
        </>
    );
};

export default Register;
