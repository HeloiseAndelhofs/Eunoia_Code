import React, { useState, useEffect } from "react";
import axios from 'axios'; // Importation du module Axios pour les requêtes HTTP
import AuthNav from '../../components/AuthNav'; // Composant de navigation pour les utilisateurs authentifiés
import { Link } from "react-router-dom"; // Composant de lien pour la navigation interne
import add from '../../assets/add.svg'; // Importation de l'icône pour ajouter un nouveau salon
import styles from '../../css_module/Messages.module.css'; // Importation des styles CSS pour le composant

const AllRooms = () => {
    const [rooms, setRooms] = useState([]); // État local pour stocker la liste des salons
    const [error, setError] = useState(null); // État local pour gérer les erreurs

    useEffect(() => {
        const getRooms = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/eunoia/rooms', {
                    withCredentials: true // Utilisation des credentials pour les requêtes avec axios
                });

                console.log(response.data); // Affichage des données de réponse dans la console

                setRooms(response.data.filter((room) => room.name !== 'Eunoia')); // Mise à jour de l'état avec les salons reçus, en excluant le salon 'Eunoia'
            } catch (error) {
                console.error("Error fetching rooms:", error); // Affichage des erreurs de requête dans la console
                setError(error.response ? error.response.data.message : error.message); // Gestion des erreurs
            }
        };
        getRooms(); // Appel de la fonction pour récupérer les salons au montage du composant
    }, []); // Utilisation d'un tableau de dépendances vide pour exécuter useEffect une seule fois

    // Fonction pour rejoindre un salon
    const joinRoom = async (roomId) => {
        if (window.confirm("Voulez-vous vraiment rejoindre ce salon ?")) { // Confirmation avant de rejoindre le salon
            try {
                const response = await axios.post('http://localhost:3000/api/eunoia/rooms', {
                    roomId: roomId
                }, {
                    withCredentials: true // Utilisation des credentials pour les requêtes avec axios
                });

                alert("Vous avez rejoint le salon !"); // Message d'alerte après avoir rejoint le salon
            } catch (error) {
                console.error("Error joining room:", error); // Affichage des erreurs de requête dans la console
                setError(error.response ? error.response.data.message : error.message); // Gestion des erreurs
            }
        }
    };

    // Rendu JSX du composant AllRooms

    return (
        <>
            <AuthNav />
            <h1>Salons publics</h1>
            <div>
                <Link to={'/eunoia/rooms/createRoom'} className={styles.link}>
                    <img src={add} alt="create room" />
                    Nouveau salon
                </Link>
            </div>
            
            {error && <p className={styles.error}>Erreur : {error}</p>}
            <div className={styles.container}>
                {rooms.length > 0 ? (
                    <ul>
                        {rooms.map((room) => (
                            <li key={room.room_id}>
                                <Link to={`/eunoia/rooms/${room.room_id}`} className={styles.link}>
                                    {room.name}
                                </Link>
                                <p>{room.description}</p>
                                <p>{room.category}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Il n'y a encore aucun salon.</p>
                )}
            </div>
        </>
    );
};

export default AllRooms;
