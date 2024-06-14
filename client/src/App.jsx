import React, { useEffect } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Eunoia from './pages/Eunoia';
import Edit from './pages/Edit';
import PrivateMessage from './pages/PrivateMessage'
import AllPrivateMessage from './pages/AllPrivateMessage'
import './App.css';

function App() {

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
        },
        {
            path : '/eunoia/message',
            element : <AllPrivateMessage />
        },
        {
            path : '/eunoia/message/:groupName',
            element : <PrivateMessage />
        }
    ]);

    return <RouterProvider router={router} />;
}

export default App;
