// CreateRoom.js

import React, { useState } from 'react';
import axios from 'axios';

const CreateRoom = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/eunoia/rooms/createRoom', {
                name,
                description,
                category
            }, {
                withCredentials: true
            });

            setSuccess('Salle créée avec succès!');
            setName('');
            setDescription('');
            setCategory('');
        } catch (error) {
            console.error('Erreur lors de la création de la salle:', error);
            setError(error.response ? error.response.data.message : error.message);
        }
    };

    return (
        <div>
            <h1>Créer une nouvelle salle</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nom</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Description</label>
                    <input 
                        type="text" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Catégorie</label>
                    <input 
                        type="text" 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit">Créer</button>
            </form>
        </div>
    );
};

export default CreateRoom;
