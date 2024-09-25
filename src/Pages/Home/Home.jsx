import React, { useState, useEffect, useContext, useRef } from 'react';
import { io } from 'socket.io-client';
import styles from './Home.module.css';
import { UserContext } from '../../../context/userContext';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const socket = io('http://localhost:8000');

const Home = () => {
    const navigate = useNavigate();
    const { user, loading, setUser } = useContext(UserContext);
    const [message, setMessage] = useState('');
    const [image, setImage] = useState(null); // New state for image uploads
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);
    const [activeUsers, setActiveUsers] = useState([]);


    useEffect(() => {
        if (loading && !user) {
            navigate('/login');
        }

        const fetchChatHistory = async () => {
            try {
                const response = await axios.get('/chatHistory');
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching chat history:', error);
            }
        };

        fetchChatHistory();

        socket.on('chatMessage', (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        return () => {
            socket.off('chatMessage');
        };
    }, [loading, user, navigate]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleLogout = async () => {
        try {
            socket.emit('removeUser', user.username);  // Notify the server about the logout
            await axios.post('/logout');  // Handle client-side logout
            setUser(null);
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (image || message.trim()) { // Allow sending if there is an image or trimmed text
            let imageUrl = null;
            if (image) {
                const formData = new FormData();
                formData.append('image', image);
    
                const response = await axios.post('/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                imageUrl = response.data.imageUrl;
            }
    
            // Emit the message with imageUrl or text
            socket.emit('chatMessage', { 
                timestamp: Date.now(),
                user: user.username, 
                text: message.trim() || '', // Use trimmed message or an empty string
                image: imageUrl 
            });
    
            setMessage('');
            setImage(null);
        }
    };
    
    useEffect(() => {
        if (user) {
            socket.emit('registerUser', user.username); // Register user on page load
        }
    
        socket.on('connect', () => {
            if (user) {
                socket.emit('registerUser', user.username); // Re-register on reconnect
            }
        });
    
        socket.on('activeUsers', (users) => {
            setActiveUsers(users); // Update the active users list
        });
    
        // Listen for the page unload event (when the user closes the tab or navigates away)
        const handleBeforeUnload = () => {
            socket.emit('removeUser', user.username); // Notify the server that the user is leaving
        };
    
        window.addEventListener('beforeunload', handleBeforeUnload);
    
        return () => {
            socket.off('activeUsers'); // Clean up socket listeners
            window.removeEventListener('beforeunload', handleBeforeUnload); // Clean up the event listener
        };
    }, [user]);
    
    if (loading) {
        return <div className={styles.loading}>
            <h1 className={styles.h1}>Loading...</h1>
        </div>;
    }

    function padZero(n) {
        if (n < 10) return '0' + n;
        return n;
      }

    return (
        <div className={styles.grid_container}>
            <div className={`${styles.wrapper_right} ${styles.dashboard}`}>
                <h1 className={styles.h1}>Global Chat</h1>

                <div className={styles.chatbox}>
                    <div className={styles.chat_messages}>
                        {messages.map((msg, index) => (
                            <div key={index} className={styles.chat_message}>

                                <strong style={{marginRight: '5px', fontSize: '14px'}}>{padZero(new Date(msg.timestamp).getHours()) + ':' + padZero(new Date(msg.timestamp).getMinutes())}</strong>
                                <strong className={styles.chat_user}>{msg.user} </strong>
                                {msg.text && <span className={styles.chat_text}>{msg.text}</span>}
                                {msg.image && <img src={msg.image} alt="chat" className={styles.chat_image} />}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className={styles.chat_form} onSubmit={sendMessage}>
                        <input
                            type="text"
                            placeholder="@Global"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className={styles.chat_input}
                        />
                        <label className={styles.file_input_label}>
                            <input
                                type="file"
                                accept="image/png, image/gif, image/jpeg, image/webp, image/jpg, image/svg, image/avif, image/ico"
                                onChange={(e) => setImage(e.target.files[0])}
                                className={styles.chat_input_pic}
                            />
                            📸
                        </label>
                        <button type="submit" className={styles.chat_button}>Send</button>
                    </form>
                </div>
            </div>

            <div className={`${styles.wrapper_left} ${styles.profile}`}>
                <div className={styles.profile_container}>
                    <h1 className={styles.h2}>{user.username}</h1>
                    <button className={styles.logout_button} onClick={handleLogout}>Logout</button>
                    <div className={styles.active_users}>
                        <h2 className={styles.h2}>Active Users</h2>
                        <ul>
                            {activeUsers.map((activeUser, index) => (
                                <li key={index}>{activeUser}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className={`${styles.wrapper_left} ${styles.menu}`}>
                <div className={styles.profile_container}>
                    <h1 className={styles.h2}>Menu</h1>
                    <button className={styles.logout_button} onClick={() => navigate('/')}>Front Page</button>
                </div>
            </div>
        </div>
    );
};

export default Home;
