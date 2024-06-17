import React, { useState, useEffect } from "react";
import axios from 'axios'
import socket from '../socket'
import AuthNav from "../components/AuthNav";


const Eunoia = () => {

    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [onlineUsers, setOnlineUsers] = useState([])
    const [error, setError] = useState(null)
    const userId = localStorage.getItem('userId')
    const [username, setUsername] = useState('')

    useEffect(() => {
        const getMessages = async () => {
            try {   
                const response = await axios.get('http://localhost:3000/api/eunoia/rooms/1', {
                    withCredentials : true
                })
                
                setMessages(response.data)
                console.log(response.data);
            } catch (error) {
                console.error(error);
                setError(error.response ? error.response.data.message : error.message);
            }
        }
        getMessages()

        socket.on('receiveEunoiaMessage', (newMessage) => {
            setMessages((prevMessages) => {
                const messageExists = prevMessages.some(msg => msg.public_message_id === messages.public_message_id);
                if (!messageExists) {
                    return [...prevMessages, newMessage];
                } else {
                    return prevMessages;
                }
            });
        });

        console.log(messages);

        socket.on('userConnected', (userId) => {
            console.log(onlineUsers + ' online users');
            setOnlineUsers((prevUsers) => [...prevUsers, userId]);
        });

        socket.on('userDisconnected', (userId) => {
            setOnlineUsers((prevUsers) => prevUsers.filter((id) => id !== userId));
        });

        socket.emit('joinEunoia', {userId : socket.id, roomId : 1})

        return () => {
            socket.off('receiveMessage');
            socket.off('userConnected');
            socket.off('userDisconnected');
        };

    },[])

    const postMessage = async () => {
        try {
            const message = {
                content: newMessage,
                roomName: "Eunoia",
                sender: userId,
                roomId: 1
            };
            // Envoyer le message via socket
            socket.emit('publicMessage', message);
            setNewMessage('');
        } catch (error) {
            console.error("Error sending message:", error);
            setError(error.response ? error.response.data.message : error.message);
        }
    };

    return (

        <>
            <AuthNav />

            <h1>Eunoia</h1>
            <div>
                <h2>Messages</h2>
                <ul>
                    {messages.map((msg) => (
                        <li key={msg.public_message_id}>
                            {msg.username} : {msg.content}
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Tapez votre message..."
                />
                <button onClick={postMessage}>Envoyer</button>
            </div>
            <div>
                <h2>Utilisateurs en ligne</h2>
                <ul>
                    {onlineUsers.map((userId, index) => (
                        <li key={index}>{userId}</li>
                    ))}
                </ul>
            </div>
        </>
    )

}

//verifier les onlinesUsers


export default Eunoia