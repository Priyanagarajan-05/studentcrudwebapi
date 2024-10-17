import React, { useState } from 'react';
import { register } from '../api';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Register = () => {
    const [student, setStudent] = useState({
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
        department: '',
        dob: ''
    });

    const navigate = useNavigate(); // Initialize navigate

    const handleChange = (e) => {
        setStudent({ ...student, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await register(student);
        alert('Registration successful!'); // Temporary success message
        navigate('/login'); // Redirect to login page after registration
    };

    return (
        <div className="register-container">
            <style jsx>{`
                .register-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    background-color: #f4f4f4;
                    font-family: Arial, sans-serif;
                }

                form {
                    background-color: white;
                    padding: 20px;
                    border-radius: 5px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    width: 300px;
                    display: flex;
                    flex-direction: column;
                }

                input {
                    width: 100%;
                    padding: 10px;
                    margin: 10px 0;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                }

                button {
                    background-color: #007bff;
                    color: white;
                    border: none;
                    padding: 10px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                    width: 100%;
                }

                button:hover {
                    background-color: #0056b3;
                }

                h1 {
                    margin-bottom: 20px;
                    font-size: 24px;
                    color: #333;
                }
            `}</style>

            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <input name="name" placeholder="Name" onChange={handleChange} required />
                <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
                <input name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required />
                <input name="department" placeholder="Department" onChange={handleChange} required />
                <input name="dob" type="date" onChange={handleChange} required />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
