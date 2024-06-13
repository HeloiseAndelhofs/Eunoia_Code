import React from "react";

const Step2Form = ({ formData, handleChange, handlePreferencesChange, handleAddPreference, handleSubmit }) => (
    <form onSubmit={handleSubmit}>
        <div className="register_form">
            <label htmlFor="description">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} />
        </div>
        <div className="register_form">
            <label htmlFor="avatar_url">URL de l'avatar</label>
            <input name="avatar_url" type="text" value={formData.avatar_url} onChange={handleChange} required />
        </div>
        <div className="register_form">
            <label>Préférences</label>
            {formData.preferences.map((preference, index) => (
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
                    <label htmlFor={`is_liked-${index}`}>
                        <input
                            type="checkbox"
                            name={`is_liked-${index}`}
                            checked={preference.is_liked}
                            onChange={(e) => handlePreferencesChange(index, 'is_liked', e)}
                        />
                        Est ce que vous appreciez jouer/écouter au jeu/musique que vous venez de mentionner ?
                    </label>
                </div>
            ))}
            <button type="button" onClick={handleAddPreference}>Ajouter une préférence</button>
        </div>
        <div className="register_form">
            <label htmlFor="tokenAccepted"> J'accepte les cookies </label>
            <input name="tokenAccepted" type="checkbox" checked={formData.tokenAccepted} onChange={handleChange} />
        </div>
        <button type="submit">Inscription</button>
    </form>
);

export default Step2Form;
