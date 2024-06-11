import React from "react";
import NoAuthNav from "../components/NoAuthNav";

const Home = () => {

    return (
        <>
        <NoAuthNav />

        <main className="home">
            <h1>Bienvenue chez Eunoia !</h1>
            <h2>La taverne où vos passions sont au centre des discussions.</h2>

            <p>
                Rejoignez notre communauté et échangez avec d'autres passionnés de musique et de jeux vidéo.
                Participez aux discussions dans les salons dédiés à vos genres et artistes préférés, et découvrez
                de nouvelles passions grâce à la communauté Eunoia. 
            </p>

            <div>
                <button>Connexion</button>
                <button>Inscription</button>
            </div>
        </main>
        </>
    )

}

export default Home