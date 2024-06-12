import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import NoAuthNav from "../components/NoAuthNav";


const Login = () => {

    const [ formData, setFormData ] = useState({
        "username" : '',
        "password" : '',
        "tokenAccepted" : false
    })    


    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData({
                ...formData,
                [name]: checked
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            
            const result = await axios.post('http://localhost:3000/api/login', {
                username : formData.username,
                password : formData.password,
                tokenAccepted : formData.tokenAccepted
            }, {
                withCredentials: true
            })

            console.log(result);
            navigate('/eunoia/profile')

        } catch (error) {
            console.error("There was an error!", error);
            if (error.response) {
                console.error("Server responded with a status:", error.response.status);
                console.error("Response data:", error.response.data);
            } else if (error.request) {
                console.error("No response received:", error.request);
            } else {
                console.error("Error setting up the request:", error.message);
            }
        }
    }

    return (
        <>
        
            <NoAuthNav />

            <h1>Connexion</h1>

            <form onSubmit={handleSubmit} >
                <div className="login_form">
                    <label htmlFor="username">Nom d'utilisateur</label>
                    <input name="username" type="text" value={formData.username} onChange={handleChange} />
                </div>
                <div className="login_form">
                    <label htmlFor="password">Mot de passe</label>
                    <input name="password" type="password" value={formData.password} onChange={handleChange} />
                </div>
                <div className="login_form">
                    <label htmlFor="tokenAccepted">J'accepte les cookies</label>
                    <input type="checkbox" name="tokenAccepted" checked={formData.tokenAccepted} onChange={handleChange}/>
                </div>
                <button type="submit">Connexion</button>
            </form>

        </>
    )

}

export default Login