import React, { useState, useEffect } from "react";
import socket from '../../socket';
import axios from 'axios';
import AuthNav from '../../components/AuthNav';
import { useParams, useLocation } from "react-router-dom";


const RoomMessages = () => {

    const location = useLocation()
    const { pathname } = location
    let roomId;
console.log(pathname);
    if (pathname !== "/eunoia" ) {
        ({ roomId } = useParams())
    } else {
        roomId = 1
        console.log(roomId);
    }

    console.log(roomId);
    // const { roomId }  = useParams()
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState([])
    const [error, setError] = useState(null)
    const [roomName, setRoomName] = useState('')
    const userId = localStorage.getItem('userId')
        
    useEffect(() => {

        const getMessages = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/eunoia/rooms/${roomId}`, {
                    withCredentials : true
                })

                setMessages(response.data.messages)
                console.log(response.data);
                setRoomName(response.data.roomName)
                console.log(response.data.roomName);
            } catch (error) {
                console.error("Error fetching messages:", error);
                setError(error.response ? error.response.data.message : error.message);
            }
        }
        console.log('MESSAGES ' + messages);
        getMessages()

        socket.emit('joinRoom', roomName)

        //peut etre socket.on('connect') pour dire quels utilisateurs du groupes sont connectés

        socket.on('publicMessage', (message) => {
            console.log('Message public reçu ' + message );
            setMessages((prevMessages) => {
                const messageExists = prevMessages.some(msg => msg.public_message_id === message.public_message_id)
                if (!messageExists) {
                    return [...prevMessages, message]
                } else {
                    return prevMessages
                }
            });
        });

        return () => {
            socket.emit('leaveRoom', roomName);
            socket.off('newPublicMessage');
        }
    }, [roomId])

    const postMessage = async () => {
        try {
            const message = {
                content : newMessage,
                roomName : roomName,
                sender : userId,
                roomId : roomId
            }
            socket.emit('publicMessage', message)
            setNewMessage('')
        } catch (error) {
            console.error("Error sending message:", error);
            setError(error.response ? error.response.data.message : error.message); 
        }
    };

    if (error) {
        return <p>Erreur : {error}</p>
    }

    return (
        <>
            <AuthNav />
            <h1>{roomName}</h1>
            <div>
                <ul>
                    {messages.map((message) => (
                        <li key={message.public_message_id}>
                            {message.username} : {message.content}
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
    )

}

export default RoomMessages