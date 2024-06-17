import React, { useState, useEffect } from "react";
import socket from '../../socket';
import axios from 'axios';
// import jwtDecode from 'jwt-decode';
import AuthNav from '../../components/AuthNav';
import { useParams } from "react-router-dom";

const Message = () => {
    const { groupId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [error, setError] = useState(null);
    const [groupName, setGroupName] = useState('');
    // const [userId, setUserId] = useState(null);
    const userId = localStorage.getItem('userId')

    console.log(userId);

    useEffect(() => {

        const getMessages = async () => {
            try {
                console.log(groupId);
                const response = await axios.get(`http://localhost:3000/api/eunoia/message/${groupId}`);
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
            console.log('SALUTTTTTTT');
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
        return () => {
            socket.emit('leaveGroup', groupName);
            socket.off('newPrivateMessage');
        };
    }, [groupId]);

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

    return (
        <>
            <AuthNav />
            <h1>{groupName}</h1>
            {error && <p>{error}</p>}
            <div>
                <ul>
                    {messages.map((message) => (
                        <li key={message.private_message_id}>
                            {message.sender_username}: {message.content}
                            <p>{message.send_at}</p>
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
                />
                <button onClick={postMessage}>Envoyer</button>
            </div>
        </>
    );
};

export default Message;
