import React, { useState, useEffect } from "react";
import AuthNav from "../components/AuthNav";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import styles from '../css_module/Settings.module.css';

import EditEmail from '../components/EditEmail';
import EditPassword from '../components/EditPassword';
import DeleteProfile from '../components/DeleteProfile';

const Settings = () => {
    const [email, setEmail] = useState(null);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const getEmail = async () => {
            try {    
                const response = await axios.get('http://localhost:3000/api/eunoia/settings', { withCredentials: true });
                setEmail(response.data.email);
            } catch (error) {
                console.error(error);
                setError(error.response ? error.response.data.message : error.message);
            }
        };
        getEmail();
    }, []);

    if (error) {
        return <p className={styles.errorMessage}>Erreur : {error}</p>;
    }

    return (
        <>
            <AuthNav />
            <div className={styles.settingsContainer}>
                <h1>Parametres</h1>
                <EditEmail email={email} setEmail={setEmail} setError={setError} />
                <EditPassword setError={setError} />
                <DeleteProfile navigate={navigate} setError={setError} />
            </div>
        </>
    );
};

export default Settings;
