import React from "react";
import NoAuthNav from "../components/NoAuthNav";


const Register = () => {

    return (
        <>
        
            <NoAuthNav />

            <h1>Inscription</h1>

            <form action="" method="post">
                <div className="register_form">
                    <label htmlFor="username">Nom d'utilisateur</label>
                    <input name="username" type="text" required />
                </div>
                <div className="register_form">
                    <label htmlFor="email">Email</label>
                    <input name="email" type="text" />
                </div>
                <div className="register_form">
                    <label htmlFor="password">Mot de passe</label>
                    <input name="password" type="text" required />
                </div>
                <div className="register_form">
                    <label htmlFor="confirm_password">Confirmez votre mot de passe</label>
                    <input name="confirm_password" type="text" required />
                </div>
                <button type="submit">Inscription</button>
            </form>

        </>
    )

}

export default Register