import React from "react";
import { useState } from "react";
import axios from 'axios'
import NoAuthNav from "../components/NoAuthNav";


const Register = () => {
    
            const [formData, setFormData] = useState({
                username : '',
                email : '',
                password : '',
                confirmPassword : '',
                birthday : '',
                description : '',
                avatar : '',
                tokenAccepted : false
            })

    //     const getAvatar = () => {
    //         const avatarFrame = document.getElementById("avatar")   

    //         console.log(avatarFrame.contentWindow);
    //         // const avatarData = this.avatarFrame.

    // };

    return (

        <>
        
            <NoAuthNav />

            <h1>Inscription</h1>

            <form action="" method="post">
                <div className="register_form">
                    <label htmlFor="username">Nom d'utilisateur : </label>
                    <input name="username" type="text" required />
                </div>
                <div className="register_form">
                    <label htmlFor="email">Email : </label>
                    <input name="email" type="text" />
                </div>
                <div className="register_form">
                    <label htmlFor="password">Mot de passe : </label>
                    <input name="password" type="text" required />
                </div>
                <div className="register_form">
                    <label htmlFor="confirm_password">Confirmez votre mot de passe : </label>
                    <input name="confirm_password" type="text" required />
                </div>
                <div>
                    <label for="birthday">Date de naissance : </label>
                    <input type="date" name="birthday"></input>
                </div>
                <button type="submit">Inscription</button>
            </form>

            {/* <div id="avatarIFrame">
                <iframe 
                    id="avatar"
                    width="1000"
                    height="500"
                    
                    src="https://sanderfrenken.github.io/Universal-LPC-Spritesheet-Character-Generator/#?body=Body_color_light&head=Human_male_light">
                </iframe>

                <button onClick={getAvatar}>Enregistrer votre avatar.</button>
            </div> */}

        </>
    )

}

export default Register