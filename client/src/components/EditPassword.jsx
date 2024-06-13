import React, { useState } from "react";
import axios from 'axios';
import edit from "../assets/edit.svg";
import styles from '../css_module/Settings.module.css';

const EditPassword = ({ setError }) => {
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const updatePassword = async () => {
        try {
            await axios.put('http://localhost:3000/api/eunoia/settings/password', { currentPassword, newPassword, confirmNewPassword }, { withCredentials: true });
            setIsEditingPassword(false);
        } catch (error) {
            console.error(error);
            setError(error.response ? error.response.data.message : error.message);
        }
    };

    return (
        <section className={styles.section}>
            <p>Password</p>
            {isEditingPassword ? (
                <>
                    <label htmlFor="currentPassword">Mot de passe actuel</label>
                    <input 
                        type="password" 
                        name="currentPassword"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <label htmlFor="newPassword">Nouveau mot de passe</label>
                    <input 
                        type="password" 
                        name="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <label htmlFor="confirmNewPassword">Confirmez votre nouveau mot de passe</label>
                    <input 
                        type="password"
                        name="confirmNewPassword" 
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                    <button type="button" onClick={updatePassword}>Confirmer</button>
                    <button type="button" onClick={() => setIsEditingPassword(false)}>Annuler</button>
                </>
            ) : (
                <>
                    <button type="button" onClick={() => setIsEditingPassword(true)}>
                        <img src={edit} alt="edit password" />
                    </button>
                </>
            )}
        </section>
    );
};

export default EditPassword;
