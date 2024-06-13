import React from "react";
import edit from "../assets/edit.svg"
import styles from '../css_module/Dashboard.module.css'
import { Link } from 'react-router-dom';

const Profile = ({profileData}) => {

    return(
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
                            <p>Né(e) le : {new Date(profileData.user.birthday).toLocaleDateString()}</p>
                        </div>
                        <div className={styles.profilePreferences}>
                            <h3>Preferences :</h3>
                            <ul>
                                {profileData.preferences.map((pref, index) => (
                                    <li key={index}>
                                        {pref.type} : {pref.name} - {pref.is_liked ? "Aime" : "N'aime pas"}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
    )

}


export default Profile