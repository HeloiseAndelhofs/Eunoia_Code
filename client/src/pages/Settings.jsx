import React, { useState, useEffect } from "react";
import AuthNav from "../components/AuthNav";
import axios from 'axios'
import deleteImg from '../assets/delete-blanc.svg'
import edit from "../assets/edit.svg"
import { Link, useNavigate } from "react-router-dom";
import styles from '../css_module/Settings.module.css'


const Settings = () => {
    const [email, setEmail] = useState(null);
    const [error, setError] = useState(null);    

    const navigate = useNavigate()
    useEffect(() => {
        const getEmail = async () => {
            try {    
                    const response = await axios.get('http://localhost:3000/api/eunoia/settings', {
                        withCredentials : true
                    })

                setEmail(response.data.email)
            } catch (error) {
                console.error(error);
                setError(error.response ? error.response.data.message : error.message);
            }
        } 
        getEmail()
    }, []);


    const deleteProfile = async () => {
        await axios.delete('http://localhost:3000/api/eunoia/profile', {
            withCredentials : true
        })

    navigate('/')
    }


    if (error) {
        return <p className={styles.error-message}>Erreur : {error}</p>
    }

    return (
        <>
            <AuthNav />
            <div className={styles.settingsContainer}>
                <h1>Parametres</h1>
                <section className={styles.section}>
                    <Link to={'/email'}>
                        <img src={edit} alt="edit email" />
                    </Link>
                    <p>Email : {email}</p>
                </section>
                <section className={styles.section}>
                    <Link to={'/password'}>
                        <img src={edit} alt="edit password" />
                    </Link>
                    <p>Password</p>
                </section>
                <section className={styles.section}>
                    <p>Supprimer le profil</p>
                    <button type="button" onClick={deleteProfile} className={styles.deleteButton}>
                        <img src={deleteImg} alt="supprimer le profil" />
                    </button>
                </section>
            </div>
        </>
    )

}

export default Settings