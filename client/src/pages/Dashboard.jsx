import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import AuthNav from "../components/AuthNav";
import axios from 'axios';
import { useEffect } from "react";
import edit from "../assets/edit.svg"
import styles from '../css_module/Dashboard.module.css'


const Dashboard = () => {

    const [profileData, setProfileData] = useState(null)
    const [error, setError] = useState(null);

    useEffect(() => {
        const getProfileData = async () => {
            try {
                const result = await axios.get('http://localhost:3000/api/eunoia/profile', {
                    withCredentials : true
                })

                setProfileData(result.data)
            } catch (error) {
                console.error(error);
                setError(error.response ? error.response.data.message : error.message);
            }
        }
        getProfileData()
    }, [])


    if (error) {
        return <p className={styles.errorMessage}>Erreur : {error}</p>;
    }

    return (
        <>
            <AuthNav />

            <div className={styles.dashboardContainer}>
                <h1>Profile</h1>

                {profileData && (
                    <div>
                        <div className={styles.profileInfo}>
                            <h2>{profileData.user.username}</h2>
                            <Link to={'/eunoia/profile/edit'}>
                                <img src={edit} alt="edit" />
                            </Link>
                        </div>
                        <div className={styles.profileDescription}>
                            <p>Description : {profileData.user.description}</p>
                            <p>Inscris le : {new Date(profileData.user.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className={styles.profilePreferences}>
                            <h3>Preferences :</h3>
                            <ul>
                                {profileData.pref.map((pref, index) => (
                                    <li key={index}>
                                        {pref.type} : {pref.name} - {pref.is_liked ? "Aime" : "N'aime pas"}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </>
    );

}


export default Dashboard