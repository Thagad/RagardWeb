import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  Routes,
  Route,
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import "./App.css";
import LoginForm from "./Pages/Login/LoginForm.jsx";
import RegisterForm from "./Pages//Register/RegisterForm.jsx";
import Home from "./Pages/Home/Home.jsx";
import Unrestricted from "./Pages/Unrestricted/Unrestricted.jsx";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { UserContextProvider } from "../context/userContext.jsx";

axios.defaults.baseURL = "https://ragardweb-backend.onrender.com/";
axios.defaults.withCredentials = true;

function App(){
    return (
        <UserContextProvider>
        <Toaster class="toaster" position="top-center" toastOptions={{
    className: '',
          style: {
            background: '#363636',
            color: '#fff',
            padding: '18px',
            borderRadius: '8px',
            display: 'flex',
            maxWidth: '100%',
            width: 'auto',
          },
    success: {
        iconTheme: {
            primary: 'white',
            secondary: 'green',
        },  
        style: {
            background: 'green',
            color: 'white',
        },
    },
    error: {
        iconTheme: {
            primary: 'white',
            secondary: 'red',
        },  
        style: {
            background: 'red',
            color: 'white',
        },
    },
  duration: 2000}}/>
        <Routes>
            <Route path="/" element={<Unrestricted />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
        </Routes>
        </UserContextProvider>
    )
}

export default App
