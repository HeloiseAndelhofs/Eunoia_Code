import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.svg"
import settings from "../assets/settings.svg"
import user from "../assets/user.svg"
import styles from "../css_module/Nav.module.css"


const AuthNav = () => {
    return (

        <nav className={styles.nav}>
            <>
            <Link to="/eunoia" className={styles.link}>
                <img src={logo} alt="logo" className={styles.img} />
            </Link>
            <h2 className={styles.title} >Eunoia</h2>
            </>
            <ul className={styles.ul} >
                <li className={styles.li} >
                    <Link to="/eunoia/profile" className={styles.link}>
                        <img src={user} alt="user logo" className={styles.img} />
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