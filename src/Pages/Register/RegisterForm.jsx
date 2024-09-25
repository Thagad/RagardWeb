import React, { useState } from 'react';
import './RegisterForm.css';
import { FaUser, FaLock } from "react-icons/fa";
import { HiMail } from "react-icons/hi";
// import { Link } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const navigate = useNavigate()
  const [data, setData] = useState({
      email: '',
      username: '',
      password: ''
  })

  const registerUser = async (e) => {
      e.preventDefault();
      const {username, email, password} = data;
      try {
        const {data} = await axios.post('/register', {username, email, password})
        if(data.error){
          toast.error(data.error)
        } else {
          setData({})
          toast.success("Registration Successful. Please Log in")
          navigate('/login')
        }
      } catch (error) {
        console.log(error)
      }
  }

  return (
    <div className="wrapper">
      <form action="" onSubmit={registerUser}>
        <h1>Register</h1>
        <div className="input_box">
          <input type="text" placeholder="E-mail" name="email" onChange={(e)=>setData({...data, email: e.target.value})} className="input" required />
          <HiMail size={19} className="icon" />
        </div>
        <div className="input_box">
          <input type="text" placeholder="Username" name="username" onChange={(e)=>setData({...data, username: e.target.value})} className="input" required />
          <FaUser className="icon" />
        </div>
        <div className="input_box">
          <input type="password" placeholder="Password" name="password" onChange={(e)=>setData({...data, password: e.target.value})} className="input" required />
          <FaLock className="icon" />
        </div>
        <div className="forgot">
          <a href="#">Forgot Password?</a>
        </div>
        <button className="btn" type="submit">Register</button>
        <div className="register-link">
          {/* Use Link for navigation */}
          <p>Already have an account? <a href="/login">Login</a></p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
