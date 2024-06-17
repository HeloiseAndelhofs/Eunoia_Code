import React, { useState, useEffect, useLayoutEffect } from "react";
import axios from 'axios';
import AuthNav from '../../components/AuthNav';
import { Link } from "react-router-dom";
import add from '../../assets/add.svg'

const AllUsersGroup = () => {
    const [groups, setGroups] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getGroups = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/eunoia/message', {
                    withCredentials: true
                });

                console.log(response.data);

                setGroups([response.data])
            } catch (error) {
                console.error("Error fetching groups:", error);
                setError(error.response ? error.response.data.message : error.message);
            }
        };
        getGroups();
    }, []); //tableau de dépendances vide pour ne pas exécuter le useEffect en boucle

    if (error) {
        return <p>Erreur : {error}</p>;
    }

    return (
        <>
            <AuthNav />
            <h1>Vos messages privés</h1>
            <div>
                <h2>Nouveau groupe</h2>
                <Link to={'/eunoia/message/createGroup'}>
                    <img src={add} alt="create group" />
                </Link>
            </div>
            
            {groups.length > 0 ? (
                <ul>
                    {groups.map((group) => (
                        <li key={group.group_chat_id}>
                            <Link to={`/eunoia/message/${group.group_chat_id}`}>
                                {group.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Vous n'avez encore aucune discussion</p>
            )}
            
        </>
    );
};

export default AllUsersGroup;
