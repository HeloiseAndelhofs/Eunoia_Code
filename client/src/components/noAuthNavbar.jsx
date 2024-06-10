import React from "react";
import { Link } from "react-router-dom";

const noAuthNav = () => {
    return (

        <nav>
            <h2>Eunoia</h2>
            <ul id="ul_connection">
                <li>
                    <Link to="login">Login</Link>
                </li>
                <li>
                    <Link to="register">Register</Link>
                </li>
            </ul>
        </nav>

    )
}

export default noAuthNav