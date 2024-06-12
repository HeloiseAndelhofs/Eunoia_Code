import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import NoAuthNav from "../components/NoAuthNav";
import axios from 'axios';


const Dashboard = () => {

return (
    <>
        <NoAuthNav /> 

        <h1>Votre Profile</h1>
    </>
)

}

export default Dashboard