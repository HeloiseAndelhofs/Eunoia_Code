import React, { useState, useEffect } from "react"; // Importation des hooks useState et useEffect depuis React
import socket from '../../socket'; // Importation de la configuration du socket.io
import axios from 'axios'; // Importation du module Axios pour les requêtes HTTP
import AuthNav from '../../components/AuthNav'; // Composant de navigation pour les utilisateurs authentifiés
import { useParams, useLocation } from "react-router-dom"; // Hooks pour récupérer les paramètres d'URL et la localisation

const RoomMessages = () => {
    const location = useLocation(); // Utilisation du hook useLocation pour obtenir l'URL courante
    const { pathname } = location; // Récupération du chemin de l'URL
    let roomId; // Variable pour stocker l'ID de la salle

    // Vérification du chemin de l'URL pour récupérer l'ID de la salle
    if (pathname !== "/eunoia" ) {
        ({ roomId } = useParams()); // Récupération de l'ID de la salle depuis les paramètres d'URL
    } else {
        roomId = 1; // Définition d'un ID par défaut si l'URL ne contient pas d'ID valide
    }

    // États locaux pour gérer les messages, les nouveaux messages, les erreurs, le nom de la salle et l'ID de l'utilisateur
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [error, setError] = useState(null);
    const [roomName, setRoomName] = useState('');
    const userId = localStorage.getItem('userId'); // Récupération de l'ID de l'utilisateur depuis le localStorage

    useEffect(() => {
        const getMessages = async () => {
            try {
                // Requête GET pour récupérer les messages de la salle spécifiée par roomId
                const response = await axios.get(`http://localhost:3000/api/eunoia/rooms/${roomId}`, {
                    withCredentials: true // Utilisation des credentials pour les requêtes avec axios
                });

                // Mise à jour de l'état des messages et du nom de la salle à partir des données récupérées
                setMessages(response.data.messages);
                setRoomName(response.data.roomName);
            } catch (error) {
                console.error("Error fetching messages:", error); // Affichage des erreurs dans la console
                setError(error.response ? error.response.data.message : error.message); // Gestion des erreurs
            }
        };

        getMessages(); // Appel de la fonction pour récupérer les messages au chargement initial

        // Émission de l'événement 'joinRoom' pour que l'utilisateur rejoigne la salle spécifiée
        socket.emit('joinRoom', roomName);

        // Écoute des événements 'publicMessage' pour recevoir de nouveaux messages publics
        socket.on('publicMessage', (message) => {
            setMessages((prevMessages) => {
                // Vérification si le message existe déjà dans la liste des messages précédents
                const messageExists = prevMessages.some(msg => msg.public_message_id === message.public_message_id);
                if (!messageExists) {
                    // Ajout du nouveau message à la liste des messages précédents
                    return [...prevMessages, message];
                } else {
                    // Retour des messages précédents sans ajout si le message existe déjà
                    return prevMessages;
                }
            });
        });

        // Nettoyage : retour de la fonction de nettoyage pour débrancher l'écoute des événements socket
        return () => {
            socket.emit('leaveRoom', roomName); // Émission de l'événement 'leaveRoom' lors du démontage du composant
            socket.off('publicMessage'); // Désabonnement de l'écoute des événements 'publicMessage'
        };
    }, [roomId, roomName]); // Déclenchement de l'effet uniquement lorsque roomId ou roomName change

    // Fonction pour formater une date ISO en format date/heure locale
    const formatDate = (isoString) => {
        const date = new Date(isoString); // Conversion de la chaîne ISO en objet Date

        // Options pour formater la date et l'heure en format français
        const optionsDate = { day: '2-digit', month: '2-digit', year: '2-digit' };
        const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: false };

        // Formatage de la date et de l'heure selon les options définies
        const formattedDate = date.toLocaleDateString('fr-FR', optionsDate);
        const formattedTime = date.toLocaleTimeString('fr-FR', optionsTime);

        // Retour de la chaîne formatée combinant date et heure
        return `${formattedDate} ${formattedTime}`;
    };

    // Fonction pour envoyer un nouveau message à la salle spécifiée
    const postMessage = async () => {
        try {
            // Création de l'objet message à envoyer via socket
            const message = {
                content: newMessage,
                roomName: roomName,
                sender: userId,
                roomId: roomId
            };

            socket.emit('publicMessage', message); // Émission de l'événement 'publicMessage' avec le message créé
            setNewMessage(''); // Réinitialisation du champ de saisie de nouveau message après envoi
        } catch (error) {
            console.error("Error sending message:", error); // Affichage des erreurs dans la console
            setError(error.response ? error.response.data.message : error.message); // Gestion des erreurs
        }
    };

    if (error) {
        return <p>Erreur : {error}</p>; // Affichage d'un message d'erreur si une erreur est présente
    }

    // Rendu JSX du composant RoomMessages
    return (
        <>
            <AuthNav /> {/* Composant de navigation pour les utilisateurs authentifiés */}
            <h1>{roomName}</h1> {/* Affichage du nom de la salle */}
            <div>
                <ul>
                    {messages.map((message) => (
                        <li key={message.public_message_id}>
                            {message.username} : {message.content} {/* Affichage du contenu du message et de l'utilisateur */}
                            <p>{formatDate(message.send_at)}</p> {/* Affichage de la date et heure du message */}
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <input
                    type="text"
                    placeholder="message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                /> {/* Champ de saisie pour entrer un nouveau message */}
                <button onClick={postMessage}>Envoyer</button> {/* Bouton pour envoyer le message */}
            </div>
        </>
    );
};

export default RoomMessages; // Exportation du composant RoomMessages
