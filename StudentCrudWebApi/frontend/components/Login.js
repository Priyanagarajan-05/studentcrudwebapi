import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5194/api/Auth/login', {
                email,
                password,
            });

            // Save the token or perform actions after successful login
            console.log(response.data);
            localStorage.setItem('token', response.data.token); // Save the token to localStorage
            navigate('/dashboard'); // Redirect to dashboard after login
        } catch (error) {
            console.error('Error logging in:', error);
            alert('Login failed. Please check your credentials.');
        }
    };

    return (
        <div style={styles.loginContainer}>
            <h1>Login</h1>
            <form onSubmit={handleLogin} style={styles.form}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    style={styles.input}
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>Login</button>
            </form>
            <div style={styles.createAccount}>
                <p>Don't have an account? <a href="/register" style={styles.link}>Create one here</a></p>
            </div>
        </div>
    );
};

const styles = {
    loginContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f4f4f4',
        fontFamily: 'Arial, sans-serif',
    },
    form: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        width: '300px',
    },
    input: {
        width: '100%',
        padding: '10px',
        margin: '10px 0',
        border: '1px solid #ccc',
        borderRadius: '4px',
    },
    button: {
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        padding: '10px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        width: '100%',
    },
    createAccount: {
        marginTop: '10px',
        textAlign: 'center',
    },
    link: {
        color: '#007bff',
        textDecoration: 'none',
    },
};

export default Login;
