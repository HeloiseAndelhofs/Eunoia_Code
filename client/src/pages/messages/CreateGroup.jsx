import React, { useState } from "react";
import axios from 'axios'; // Importation du module Axios pour les requêtes HTTP
import socket from '../../socket'; // Importation du module socket.io-client pour la communication en temps réel
import AuthNav from '../../components/AuthNav'; // Composant de navigation pour les utilisateurs authentifiés
import { useNavigate } from "react-router-dom"; // Hook useNavigate pour la navigation programmée

const CreateGroup = () => {
    const [groupName, setGroupName] = useState(''); // État local pour gérer le nom du groupe saisi par l'utilisateur
    const [membersName, setMembersName] = useState(''); // État local pour gérer les noms des membres du groupe saisis par l'utilisateur
    const [error, setError] = useState(null); // État local pour gérer les erreurs
    const navigate = useNavigate(); // Fonction de navigation fournie par useNavigate

    const handleCreateGroup = async () => {
        try {
            // Vérification des champs requis (nom du groupe et membres)
            if (!groupName.trim() || !membersName.trim()) {
                setError('Nom du groupe et membres sont requis.'); // Affichage d'une erreur si les champs sont vides
                return;
            }

            // Séparation des noms des membres en un tableau
            const membersArray = membersName.split(',');

            // Appel à l'API pour créer le groupe
            const response = await axios.post('http://localhost:3000/api/eunoia/createGroup', {
                groupName: groupName,
                membersName: membersArray.map(name => name.trim()) // Envoi des noms des membres après suppression des espaces inutiles
            });

            // Vérification si la création du groupe a réussi
            if (response.status === 200) {
                const { resultGroup } = response.data; // Récupération des données du groupe créé depuis la réponse de l'API
                console.log('Nouveau groupe créé:', resultGroup);

                const groupId = resultGroup.groupId; // Récupération de l'ID du groupe créé
                console.log('GROUP ID !!!!!!! ' + groupId);
                
                navigate(`/eunoia/message/${groupId}`); // Redirection vers la page de messages du nouveau groupe créé

                // Rejoindre le groupe via socket.io
                socket.emit('joinGroup', groupId); // Émettre un événement pour rejoindre le groupe créé via socket.io
            }
        } catch (error) {
            console.error('Erreur lors de la création du groupe:', error);
            setError(error.response ? error.response.data.message : error.message); // Gestion des erreurs
        }
    };

    // Rendu JSX du composant CreateGroup
    return (
        <>
            <AuthNav /> {/* Composant de navigation pour les utilisateurs authentifiés */}
            <h1>Créer un nouveau groupe</h1> {/* Titre de la page */}
            {error && <p>{error}</p>} {/* Affichage de l'erreur s'il y en a une */}
            <div>
                <label>Nom du groupe :</label>
                <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)} // Gestion du changement de la valeur du nom du groupe
                />
            </div>
            <div>
                <label>Membres (séparés par des virgules) :</label>
                <input
                    type="text"
                    value={membersName}
                    onChange={(e) => setMembersName(e.target.value)} // Gestion du changement de la valeur des noms des membres
                />
            </div>
            <button onClick={handleCreateGroup}>Créer le groupe</button> {/* Bouton pour créer le groupe */}
        </>
    );
};

export default CreateGroup;
