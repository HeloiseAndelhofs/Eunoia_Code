import React, { useEffect } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Eunoia from './pages/Eunoia';
import Edit from './pages/Edit';
import './App.css';
import socket from './socket';
import { useAuth } from './AuthContext';

function App() {
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            socket.connect();

            socket.on('connect', () => {
                console.log('HELLOOOOOOOOO');
            });

            socket.on('disconnect', () => {
                console.log('Disconnected from Socket.IO server');
            });

            return () => {
                socket.off('connect');
                socket.off('disconnect');
                socket.disconnect();
            };
        }
    }, [isAuthenticated]);

    const router = createBrowserRouter([
        {
            path: "/",
            element: <Home />
        },
        {
            path: "/login",
            element: <Login />
        },
        {
            path: "/register",
            element: <Register />
        },
        {
            path: "/eunoia",
            element: <Eunoia />
        },
        {
            path: "/eunoia/settings",
            element: <Settings />
        },
        {
            path: '/eunoia/profile',
            element: <Dashboard />
        },
        {
            path: '/eunoia/profile/edit',
            element: <Edit />
        }
    ]);

    return <RouterProvider router={router} />;
}

export default App;
