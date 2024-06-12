import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.svg"
import styles from "../css_module/Nav.module.css"



const NoAuthNav = () => {
    return (
        <>
            <nav className={styles.nav}>
                <Link to="/" className={styles.link}>
                    <img src={logo} alt="logo" className={styles.img} />
                </Link>
                <h2 className={styles.title}>Eunoia</h2>
                <ul className={styles.ul}>
                    <li className={styles.li}>
                        <Link to="/login" className={styles.link} >Connexion</Link>
                    </li>
                    <li className={styles.li}>
                        <Link to="/register" className={styles.link}>Inscription</Link>
                    </li>
                </ul>
            </nav>
        </>
    );
}

export default NoAuthNav