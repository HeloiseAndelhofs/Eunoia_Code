import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import AuthNav from "../components/AuthNav";
import axios from 'axios';


const Dashboard = () => {

return (
    <>
        <AuthNav /> 

        <h1>Votre Profile</h1>
    </>
)

}

export default Dashboard