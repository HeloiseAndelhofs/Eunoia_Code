import React, { useState } from "react";
import axios from 'axios';
import deleteImg from '../assets/delete-user.svg';
import styles from '../css_module/Settings.module.css';

const DeleteProfile = ({ navigate, setError }) => {
    const [isDeletingProfile, setIsDeletingProfile] = useState(false);

    const deleteProfile = async () => {
        try {   
            await axios.delete('http://localhost:3000/api/eunoia/profile', { withCredentials: true });
            navigate('/');
        } catch (error) {
            console.error(error);
            setError(error.response ? error.response.data.message : error.message); 
        }
    };

    return (
        <section className={styles.section}>
            <p>Supprimer le profil</p>
            {isDeletingProfile ? (
                <>
                    <p>Voulez vous vraiment supprimer votre profil ?</p>
                    <button className={styles.deleteButton} type="button" onClick={deleteProfile}>Oui</button>
                    <button type="button" onClick={() => setIsDeletingProfile(false)}>Non</button>
                </>
            ) : (
                <>                       
                    <button type="button" onClick={() => setIsDeletingProfile(true)} className={styles.deleteButton}>
                        <img src={deleteImg} alt="supprimer le profil" />
                    </button>
                </>
            )}
        </section>
    );
};

export default DeleteProfile;
