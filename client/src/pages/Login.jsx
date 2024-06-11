import React from "react";
import NoAuthNav from "../components/NoAuthNav";


const Login = () => {

    return (
        <>
        
            <NoAuthNav />

            <h1>Connexion</h1>

            <form action="" method="post">
                <div className="login_form">
                    <label htmlFor="username">Nom d'utilisateur</label>
                    <input name="username" type="text" required />
                </div>
                <div className="login_form">
                    <label htmlFor="password">Mot de passe</label>
                    <input name="password" type="text" required />
                </div>
                <button type="submit">Connexion</button>
            </form>

        </>
    )

}

export default Login