import { useState } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import Eunoia from './pages/Eunoia'
import './App.css'

function App() {

  const router = createBrowserRouter([
    {
      path : "/",
      element : <Home />
    },
    {
      path : "login",
      element : <Login />
    },
    {
      path : "register",
      element : <Register />
    },
    {
      path : "/eunoia",
      element : <Eunoia />
    },
    {
      path : "/eunoia/settings",
      element : <Settings />
    },
    {
      path : '/eunoia/profile',
      element : <Dashboard />
    }
  ])

  return <RouterProvider router={router} />

}

export default App
