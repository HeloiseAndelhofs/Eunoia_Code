import React, { useState } from "react";
import axios from 'axios';
import socket from '../../socket';
import AuthNav from '../../components/AuthNav';
import { useNavigate } from "react-router-dom";

const CreateGroup = () => {
    const [groupName, setGroupName] = useState('');
    const [membersName, setMembersName] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate()

    const handleCreateGroup = async () => {
        try {
            // Vérification des champs requis
            if (!groupName.trim() || !membersName.trim()) {
                setError('Nom du groupe et membres sont requis.');
                return;
            }

            // Séparer les noms des membres en tableau
            const membersArray = membersName.split(',');

            // Appel à l'API pour créer le groupe
            const response = await axios.post('http://localhost:3000/api/eunoia/createGroup', {
                groupName: groupName,
                membersName: membersArray.map(name => name.trim())
            });

            // Vérifier si la création du groupe a réussi
            if (response.status === 200) {
                const { resultGroup } = response.data;
                console.log('Nouveau groupe créé:', resultGroup);

                const groupId = resultGroup.groupId
                console.log('GROUP ID !!!!!!! ' + groupId);
                
                navigate(`/eunoia/message/${groupId}`)

                // Rejoindre le groupe via socket.io
                socket.emit('joinGroup', groupId);

            }
        } catch (error) {
            console.error('Erreur lors de la création du groupe:', error);
            setError(error.response ? error.response.data.message : error.message);
        }
    };

    return (
        <>
            <AuthNav />
            <h1>Créer un nouveau groupe</h1>
            {error && <p>{error}</p>}
            <div>
                <label>Nom du groupe :</label>
                <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                />
            </div>
            <div>
                <label>Membres (séparés par des virgules) :</label>
                <input
                    type="text"
                    value={membersName}
                    onChange={(e) => setMembersName(e.target.value)}
                />
            </div>
            <button onClick={handleCreateGroup}>Créer le groupe</button>
        </>
    );
};

export default CreateGroup;
