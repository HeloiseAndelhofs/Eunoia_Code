import React, { useState } from "react";
import axios from 'axios';
import edit from "../assets/edit.svg";
import styles from '../css_module/Settings.module.css';

const EditEmail = ({ email, setEmail, setError }) => {
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [newEmail, setNewEmail] = useState("");

    const updateEmail = async () => {
        try {
            await axios.put('http://localhost:3000/api/eunoia/settings/email', { newEmail }, { withCredentials: true });
            setEmail(newEmail);
            setIsEditingEmail(false);
        } catch (error) {
            console.error(error);
            setError(error.response ? error.response.data.message : error.message);
        }
    };

    return (
        <section className={styles.section}>
            <p>Email</p>
            {isEditingEmail ? (
                <>
                    <label htmlFor="newEmail">Nouvel email</label>
                    <input 
                        type="email" 
                        name="newEmail"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                    />
                    <button type="button" onClick={updateEmail}>Confirmer</button>
                    <button type="button" onClick={() => setIsEditingEmail(false)}>Annuler</button>
                </>
            ) : (
                <>
                    <button type="button" onClick={() => setIsEditingEmail(true)}>
                        <img src={edit} alt="edit email" />
                    </button>
                    <p>Email : {email}</p>
                </>
            )}
        </section>
    );
};

export default EditEmail;
