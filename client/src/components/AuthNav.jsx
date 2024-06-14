import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg"
import settings from "../assets/settings.svg"
import user from "../assets/user.svg"
import styles from "../css_module/Nav.module.css"
import socket from '../socket'
import { useAuth } from '../AuthContext'
import logoutImg from '../assets/logout.svg'
import messageImg from '../assets/message.svg'


const AuthNav = () => {

    const { logout } = useAuth()
    const [error, setError] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        socket.on('logout', () => {
            console.log('HELLO from socket event nav');
            logout()
            socket.disconnect()
            navigate('/')
        })
        return () => {
            socket.off('logout')
        }
    }, [logout, navigate])

    const logoutFnc = async () => {
        try {
            await socket.emit('logout')
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    }

    if (error) {
        return <p className={styles.errorMessage}>Erreur : {error}</p>;
    }

    return (

        <nav className={styles.nav}>
            <>
            <Link to="/eunoia" className={styles.link}>
                <img src={logo} alt="logo" className={styles.img} />
            </Link>
            <h2 className={styles.title} >Eunoia</h2>
            </>
            <ul className={styles.ul} >
                <li className={styles.li}>
                    <button type="button" onClick={logoutFnc}>
                        <img src={logoutImg} alt="logout" className={styles.img}/>
                    </button>
                </li>
                <li className={styles.li} >
                    <Link to="/eunoia/profile" className={styles.link}>
                        <img src={user} alt="user logo" className={styles.img} />
                    </Link>
                </li>
                <li className={styles.li}>
                    <Link to='/eunoia/message' className={styles.link}>
                        <img src={messageImg} alt="message" className={styles.img} />
                    </Link>
                </li>
                <li className={styles.li}>
                    <Link to="/eunoia/settings" className={styles.link}>
                        <img src={settings} alt="settings logo" className={styles.img} />
                    </Link>
                </li>
            </ul>
        </nav>

    )
}

export default AuthNav