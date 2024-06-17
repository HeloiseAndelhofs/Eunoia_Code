import React, { useState, useEffect } from "react";
import axios from 'axios';
import AuthNav from '../../components/AuthNav';
import { Link } from "react-router-dom";
import add from '../../assets/add.svg';
import styles from '../../css_module/Messages.module.css'

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

        const joinRoom = async (roomId) => {
        if (window.confirm("Voulez-vous vraiment rejoindre ce salon ?")) {
            try {
                const response = await axios.post('http://localhost:3000/api/eunoia/rooms', {
                    roomId: roomId
                }, {
                    withCredentials: true
                });

                alert("Vous avez rejoint le salon !");
            } catch (error) {
                console.error("Error joining room:", error);
                setError(error.response ? error.response.data.message : error.message);
            }
        }
    };

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
