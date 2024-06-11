import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.svg"


const NoAuthNav = () => {
    return (

        <nav>
            <>
            <Link to="/">
                <img src={logo} alt="logo" />
            </Link>
            <h2>Eunoia</h2>
            </>
            <ul id="ul_connection">
                <li>
                    <Link to="/login">Login</Link>
                </li>
                <li>
                    <Link to="/register">Register</Link>
                </li>
            </ul>
        </nav>

    )
}

export default NoAuthNav