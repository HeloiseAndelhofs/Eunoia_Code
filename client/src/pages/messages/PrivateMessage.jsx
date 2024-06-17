import React, { useState, useEffect } from "react";
import socket from '../../socket';
import axios from 'axios';
import AuthNav from '../../components/AuthNav';
import { useParams } from "react-router-dom";
import styles from '../../css_module/Messages.module.css'

const Message = () => {
    const { groupId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [error, setError] = useState(null);
    const [groupName, setGroupName] = useState('');
    const userId = localStorage.getItem('userId')

    console.log(userId);

    useEffect(() => {

        const getMessages = async () => {
            try {
                console.log(groupId);
                const response = await axios.get(`http://localhost:3000/api/eunoia/message/${groupId}`, {
                    withCredentials : true
                });
                setMessages(response.data.messages);
                setGroupName(response.data.name[0].name);
                console.log(response.data.messages);
            } catch (error) {
                console.error("Error fetching messages:", error);
                setError(error.response ? error.response.data.message : error.message);
            }
        };

        getMessages();

        // Rejoindre la salle du groupe
        socket.emit('joinGroup', groupName);

        
        
        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
        });
        
        // Écouter les nouveaux messages
        socket.on('receivePrivateMessage', (message) => {
            console.log('Received newPrivateMessage:', message);
            console.log('Message socket ' + message);
            setMessages((prevMessages) => {
                const messageExists = prevMessages.some(msg => msg.private_message_id === message.private_message_id);
                if (!messageExists) {
                    return [...prevMessages, message];
                } else {
                    return prevMessages;
                }
            });
        });


        socket.on('disconnect', () => {
            console.log('Socket disconnected:', socket.id);
        });

        // Quitter la salle lorsque le composant est démonté
        // return () => {
        //     socket.emit('leaveGroup', groupName);
        //     socket.off('newPrivateMessage');
        // };
    }, [groupId, groupName]);

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
            setNewMessage('');
        } catch (error) {
            console.error("Error sending message:", error);
            setError(error.response ? error.response.data.message : error.message);
        }
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
    
        const optionsDate = { day: '2-digit', month: '2-digit', year: '2-digit' };
        const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: false };
    
        const formattedDate = date.toLocaleDateString('fr-FR', optionsDate);
        const formattedTime = date.toLocaleTimeString('fr-FR', optionsTime);
    
        return `${formattedDate} ${formattedTime}`;
    };

    return (
        <>
            <AuthNav />
            <h1>{groupName}</h1>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.container}>
                <ul>
                    {messages.map((message) => (
                        <li key={message.private_message_id} className={styles.messageContent}>
                            {message.username}: {message.content}
                            <p className={styles.messageTime}>{formatDate((message.send_at))}</p>
                        </li>
                    ))}
                </ul> 
            </div> 
            {/* tester si pas de messages erreur !!!!! */}
            <div className={styles.inputContainer}>
                <input
                    type="text"
                    placeholder="message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button onClick={postMessage}>Envoyer</button>
            </div>
        </>
    );
};

export default Message;
