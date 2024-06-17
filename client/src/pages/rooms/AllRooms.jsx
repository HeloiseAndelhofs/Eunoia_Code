import React, { useState, useEffect } from "react";
import axios from 'axios';
import AuthNav from '../../components/AuthNav';
import { Link } from "react-router-dom";
import add from '../../assets/add.svg';

const AllRooms = () => {
    const [rooms, setRooms] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getRooms = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/eunoia/rooms', {
                    withCredentials: true
                });

                console.log(response.data);

                setRooms(response.data.filter((room) => room.name !== 'Eunoia')); 
            } catch (error) {
                console.error("Error fetching rooms:", error);
                setError(error.response ? error.response.data.message : error.message);
            }
        };
        getRooms();
    }, []); // Tableau de dépendances vide pour ne pas exécuter le useEffect en boucle

    return (
        <>
            <AuthNav />
            <h1>Salons publics</h1>
            <div>
                <h2>Nouveau salon</h2>
                <Link to={'/eunoia/rooms/createRoom'}>
                    <img src={add} alt="create room" />
                </Link>
            </div>
            
            {error && <p>Erreur : {error}</p>}
            {rooms.length > 0 ? (
                <ul>
                    {rooms.map((room) => (
                        <li key={room.room_id}>
                            <Link to={`/eunoia/rooms/${room.room_id}`}>
                                {room.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Il n'y a encore aucun salon.</p>
            )}
        </>
    );
};

export default AllRooms;
