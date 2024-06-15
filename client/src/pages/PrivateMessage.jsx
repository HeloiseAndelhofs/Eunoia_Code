//page avec la discussion. postMessage, getAllMessage


import React, { useState, useEffect } from "react";
import socket from '../socket'
import { useAuth } from '../AuthContext'
import axios from 'axios'
import AuthNav from '../components/AuthNav'

const Message = () => {
    const { isAuthenticated } = useState()  
    const [ message, setMessage ] = useState([])
    const [ newMessage, setNewMessage ] = useState('')
    const [ error, setError ] = useState(null)
    const [ prevMessage, setPrevMessage ] = useState([])

    useEffect(() => {
        if (isAuthenticated) {

            socket.emit('joinGroup', groupId)

            // axios.get('')
            
        }
    })

    return (

        <>
        
        <AuthNav />

        <h1>Hello c'est les messages</h1>
        
        </>
    )
}



export default Message