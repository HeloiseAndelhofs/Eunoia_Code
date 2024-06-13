import React, { useState } from "react";
import AuthNav from "../components/AuthNav";
import axios from 'axios';
import { useEffect } from "react";
import Profile from "../components/Profile"


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

            <Profile profileData = {profileData} />
        </>
    );

}


export default Dashboard