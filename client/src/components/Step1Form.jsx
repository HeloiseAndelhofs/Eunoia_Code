import React from "react";
import styles from '../css_module/LoginRegister.module.css'


const Step1Form = ({ formData, handleChange, handleSubmit }) => (
    <form onSubmit={handleSubmit} className={styles._form}>
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
        <div className="register_form">
            <label htmlFor="birthday">Date de naissance</label>
            <input name="birthday" type="date" value={formData.birthday} onChange={handleChange} required />
        </div>
        <button type="submit">Suivant</button>
    </form>
);

export default Step1Form;
