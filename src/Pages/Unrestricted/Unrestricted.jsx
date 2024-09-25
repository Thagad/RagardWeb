import React, { useState } from 'react';
import styles from  './Unrestricted.module.css';
import { useNavigate } from "react-router-dom";


export default function Unrestricted(){
    const navigate = useNavigate();
    return ( 
        <div>
            <div  className={`${styles.wrapper}`}>
                <h1 className={styles.h1}>Ragard Web</h1>
                <img style={{width: '650px', height: '650px'}} src="/skullbutterfly.png" />
                <button className={`${styles.button1}`} onClick={() => navigate('/login')}>Login</button>
                <button className={`${styles.buttonNext}`} onClick={() => navigate('/register')}>Register</button>
            </div>
        </div>
    );
};