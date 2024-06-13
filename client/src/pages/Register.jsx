import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import NoAuthNav from "../components/NoAuthNav";
import axios from 'axios';
import Step1Form from '../components/Step1Form';
import Step2Form from '../components/Step2Form';

const Register = () => {
    const [step, setStep] = useState(1);

    const [formDataStep1, setFormDataStep1] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        birthday: "",
    });

    const [formDataStep2, setFormDataStep2] = useState({
        description: "",
        avatar_url: "",
        tokenAccepted: false,
        preferences: []
    });

    const navigate = useNavigate();

    const handleChangeStep1 = (e) => {
        const { name, value, type, checked } = e.target;
        setFormDataStep1({
            ...formDataStep1,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleChangeStep2 = (e) => {
        const { name, value, type, checked } = e.target;
        setFormDataStep2({
            ...formDataStep2,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handlePreferencesChange = (index, field, value) => {
        const newPreferences = [...formDataStep2.preferences];
        newPreferences[index] = {
            ...newPreferences[index],
            [field]: field === 'is_liked' ? value.target.checked : value
        };
        setFormDataStep2({
            ...formDataStep2,
            preferences: newPreferences
        });
    };

    const handleAddPreference = () => {
        setFormDataStep2({
            ...formDataStep2,
            preferences: [...formDataStep2.preferences, { type: "", name: "", is_liked: false }]
        });
    };

    const handleSubmitStep1 = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/register', {
                step: 1,
                ...formDataStep1
            }, {
                withCredentials: true
            });
            setStep(2);
        } catch (error) {
            console.error("There was an error!", error);
        }
    };

    const handleSubmitStep2 = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/register', {
                step: 2,
                ...formDataStep2
            }, {
                withCredentials: true
            });
            navigate('/login');
        } catch (error) {
            console.error("There was an error!", error);
        }
    };

    return (
        <>
            <NoAuthNav />
            <h1>Inscription</h1>
            {step === 1 && (
                <Step1Form
                    formData={formDataStep1}
                    handleChange={handleChangeStep1}
                    handleSubmit={handleSubmitStep1}
                />
            )}
            {step === 2 && (
                <Step2Form
                    formData={formDataStep2}
                    handleChange={handleChangeStep2}
                    handlePreferencesChange={handlePreferencesChange}
                    handleAddPreference={handleAddPreference}
                    handleSubmit={handleSubmitStep2}
                />
            )}
        </>
    );
};

export default Register;
