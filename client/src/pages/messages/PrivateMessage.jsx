import React, { useState, useEffect } from "react";
import socket from '../../socket'; // Importation du module socket.io-client pour la communication en temps réel
import axios from 'axios'; // Importation du module Axios pour les requêtes HTTP
import AuthNav from '../../components/AuthNav'; // Composant de navigation pour les utilisateurs authentifiés
import { useParams } from "react-router-dom"; // Hook useParams pour récupérer les paramètres d'URL
import styles from '../../css_module/Messages.module.css'; // Styles CSS pour le composant

const Message = () => {
    const { groupId } = useParams(); // Récupération du paramètre d'URL 'groupId'
    const [messages, setMessages] = useState([]); // État local pour stocker les messages du groupe
    const [newMessage, setNewMessage] = useState(''); // État local pour gérer le nouveau message saisi par l'utilisateur
    const [error, setError] = useState(null); // État local pour gérer les erreurs
    const [groupName, setGroupName] = useState(''); // État local pour stocker le nom du groupe
    const userId = localStorage.getItem('userId'); // Récupération de l'ID utilisateur depuis le localStorage

    console.log(userId); // Affichage de l'ID utilisateur dans la console (pour le débogage)

    useEffect(() => {
        const getMessages = async () => {
            try {
                // Requête GET pour récupérer les messages du groupe depuis l'API
                const response = await axios.get(`http://localhost:3000/api/eunoia/message/${groupId}`, {
                    withCredentials: true // Utilisation des cookies avec les requêtes Axios
                });

                // Mise à jour de l'état avec les messages récupérés et le nom du groupe
                setMessages(response.data.messages);
                setGroupName(response.data.name[0].name);
                console.log(response.data.messages); // Affichage des messages dans la console (pour le débogage)
            } catch (error) {
                console.error("Error fetching messages:", error);
                setError(error.response ? error.response.data.message : error.message); // Gestion des erreurs
            }
        };

        getMessages(); // Appel de la fonction pour récupérer les messages du groupe lors du montage du composant

        // Connexion au socket et gestion des événements
        socket.emit('joinGroup', groupName); // Émettre un événement pour rejoindre le groupe

        socket.on('connect', () => {
            console.log('Socket connected:', socket.id); // Affichage de l'ID du socket lorsqu'il se connecte
        });
        
        // Écoute des nouveaux messages privés reçus
        socket.on('receivePrivateMessage', (message) => {
            console.log('Received newPrivateMessage:', message); // Affichage du nouveau message privé reçu dans la console
            setMessages((prevMessages) => {
                // Vérification si le message existe déjà dans la liste des messages
                const messageExists = prevMessages.some(msg => msg.private_message_id === message.private_message_id);
                if (!messageExists) {
                    // Ajout du nouveau message à la liste des messages précédents
                    return [...prevMessages, message];
                } else {
                    return prevMessages;
                }
            });
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected:', socket.id); // Affichage de l'ID du socket lorsqu'il se déconnecte
        });

        // Fonction de nettoyage pour quitter la salle du groupe lorsque le composant est démonté
        return () => {
            socket.emit('leaveGroup', groupName); // Émettre un événement pour quitter le groupe
            socket.off('newPrivateMessage'); // Désinscription de l'écoute des nouveaux messages privés
        };
    }, [groupId, groupName]); // Dépendances de useEffect : groupId et groupName

    // Fonction pour envoyer un nouveau message
    const postMessage = async () => {
        try {
            const message = {
                content: newMessage,
                groupName: groupName,
                sender: userId,
                groupId: groupId
            };
            // Envoyer le message via socket
            socket.emit('privateMessage', message);
            setNewMessage(''); // Réinitialisation du champ de saisie du message après l'envoi
        } catch (error) {
            console.error("Error sending message:", error);
            setError(error.response ? error.response.data.message : error.message); // Gestion des erreurs
        }
    };

    // Fonction pour formater la date d'un message
    const formatDate = (isoString) => {
        const date = new Date(isoString);
    
        const optionsDate = { day: '2-digit', month: '2-digit', year: '2-digit' };
        const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: false };
    
        const formattedDate = date.toLocaleDateString('fr-FR', optionsDate);
        const formattedTime = date.toLocaleTimeString('fr-FR', optionsTime);
    
        return `${formattedDate} ${formattedTime}`;
    };

    // Rendu JSX du composant Message
    return (
        <>
            <AuthNav /> {/* Composant de navigation pour les utilisateurs authentifiés */}

            <h1>{groupName}</h1> {/* Affichage du nom du groupe */}
            {error && <p className={styles.error}>{error}</p>} {/* Affichage de l'erreur s'il y en a une */}
            
            {/* Affichage des messages */}
            <div className={styles.container}>
                <ul>
                    {messages.map((message) => (
                        <li key={message.private_message_id} className={styles.messageContent}>
                            {message.username}: {message.content} {/* Affichage du contenu et de l'utilisateur du message */}
                            <p className={styles.messageTime}>{formatDate((message.send_at))}</p> {/* Affichage de l'heure du message */}
                        </li>
                    ))}
                </ul> 
            </div> 
            
            {/* Zone d'entrée pour saisir un nouveau message */}
            <div className={styles.inputContainer}>
                <input
                    type="text"
                    placeholder="message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)} // Gestion du changement de la valeur du message
                />
                <button onClick={postMessage}>Envoyer</button> {/* Bouton pour envoyer le message */}
            </div>
        </>
    );
};

export default Message;
