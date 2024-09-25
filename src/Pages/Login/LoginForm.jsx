import React, { useState, useEffect, useContext } from 'react';
import './LoginForm.css';
import { FaLock } from "react-icons/fa";
import { HiMail } from "react-icons/hi";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../context/userContext';

const LoginForm = () => {
    const navigate = useNavigate();
    const { user, setUser, loading } = useContext(UserContext);  // Access user, setUser, and loading from context

    const [data, setData] = useState({
        email: '',
        password: ''
    });

    const [formLoading, setFormLoading] = useState(false);  // Separate loading for form submission

    // Redirect to home if user is already logged in
    useEffect(() => {
        if (!loading && user) {
            navigate('/home');  // Redirect to home if user is logged in
        }
    }, [loading, user, navigate]);

    // Function to handle login form submission
    const loginUser = async (e) => {
        e.preventDefault();
        const { email, password } = data;

        try {
            setFormLoading(true);  // Start form loading while submitting

            // Send login request
            const { data: responseData } = await axios.post('/login', { email, password });

            if (responseData.error) {
                toast.error(responseData.error);  // Show error toast if login fails
            } else {
                // Clear the form and set the user in context
                setData({ email: '', password: '' });
                setUser(responseData);  // Store the user data in context
                toast.success("Welcome!");  // Success message
                navigate('/home');  // Redirect to home page after successful login
            }
        } catch (err) {
            console.error("Login failed:", err);
            toast.error("An error occurred during login.");
        } finally {
            setFormLoading(false);  // Stop form loading
        }
    };

    if (loading) {
        // Show loading spinner or message if the authentication state is still being checked
        return <div>Loading...</div>;
    }

    return (
        <div className='wrapper'>
            <form onSubmit={loginUser}>
                <h1>Login</h1>

                <div className="input_box">
                    <input
                        type="text"
                        placeholder="E-mail"
                        name="email"
                        value={data.email}
                        onChange={(e) => setData({ ...data, email: e.target.value })}
                        className="input"
                        required
                    />
                    <HiMail size={19} className="icon" />
                </div>

                <div className="input_box">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={data.password}
                        onChange={(e) => setData({ ...data, password: e.target.value })}
                        className="input"
                        required
                    />
                    <FaLock className="icon" />
                </div>

                <button className="btn" type="submit" disabled={formLoading}>
                    {formLoading ? 'Logging in...' : 'Login'}
                </button>

                <div className="register-link">
                    <p>
                        Don't have an account? <a href="/register">Register</a>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
