import React, { useState } from 'react'; // Importation des hooks useState et useEffect depuis React
import axios from 'axios'; // Importation du module Axios pour les requêtes HTTP
import AuthNav from '../../components/AuthNav'; // Composant de navigation pour les utilisateurs authentifiés

const CreateRoom = () => {
    const [name, setName] = useState(''); // État local pour le nom de la salle
    const [description, setDescription] = useState(''); // État local pour la description de la salle
    const [category, setCategory] = useState(''); // État local pour la catégorie de la salle
    const [error, setError] = useState(null); // État local pour gérer les erreurs
    const [success, setSuccess] = useState(null); // État local pour gérer les succès

    const handleSubmit = async (e) => { // Fonction de gestion de la soumission du formulaire
        e.preventDefault(); // Empêche le comportement par défaut du formulaire (rechargement de la page)

        try {
            // Requête POST pour créer une nouvelle salle
            await axios.post('http://localhost:3000/api/eunoia/rooms/createRoom', {
                name,
                description,
                category
            }, {
                withCredentials: true // Utilisation des credentials pour les requêtes avec axios
            });

            // Si la création réussit, mettre à jour l'état de succès et réinitialiser les champs du formulaire
            setSuccess('Salle créée avec succès!');
            setName('');
            setDescription('');
            setCategory('');
        } catch (error) {
            console.error('Erreur lors de la création de la salle:', error); // Affichage des erreurs dans la console
            setError(error.response ? error.response.data.message : error.message); // Gestion des erreurs
        }
    };

    // Rendu JSX du composant CreateRoom
    return (
        <>
            <AuthNav /> {/* Composant de navigation pour les utilisateurs authentifiés */}

            <div>
                <h1>Créer une nouvelle salle</h1> {/* Titre de la page */}
                {error && <p style={{ color: 'red' }}>{error}</p>} {/* Affichage d'un message d'erreur s'il y en a une */}
                {success && <p style={{ color: 'green' }}>{success}</p>} {/* Affichage d'un message de succès s'il y en a un */}
                <form onSubmit={handleSubmit}> {/* Formulaire de création de salle */}
                    <div>
                        <label>Nom</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                        /> {/* Champ de saisie pour le nom de la salle */}
                    </div>
                    <div>
                        <label>Description</label>
                        <input 
                            type="text" 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            required 
                        /> {/* Champ de saisie pour la description de la salle */}
                    </div>
                    <div>
                        <label>Catégorie</label>
                        <input 
                            type="text" 
                            value={category} 
                            onChange={(e) => setCategory(e.target.value)} 
                            required 
                        /> {/* Champ de saisie pour la catégorie de la salle */}
                    </div>
                    <button type="submit">Créer</button> {/* Bouton pour soumettre le formulaire */}
                </form>
            </div>
        </>
    );
};

export default CreateRoom; // Exportation du composant CreateRoom
