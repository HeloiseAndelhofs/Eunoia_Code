import React, { useEffect } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Eunoia from './pages/Eunoia';
import Edit from './pages/Edit';
import PrivateMessage from './pages/messages/PrivateMessage'
import AllUserGroup from './pages/messages/AllUserGroup'
import CreateGroup from './pages/messages/CreateGroup';
import AllRooms from './pages/rooms/AllRooms';
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
            element : <AllUserGroup />
        },
        {
            path : '/eunoia/message/:groupId',
            element : <PrivateMessage />
        },
        {
            path : '/eunoia/message/createGroup',
            element : <CreateGroup />
        },
        {
            path : '/eunoia/rooms',
            element : <AllRooms />
        }
    ]);

    return <RouterProvider router={router} />;
}

export default App;
