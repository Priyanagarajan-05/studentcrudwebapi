import axios from 'axios';

const API_URL = 'http://localhost:5194/api/auth'; // Update with your backend URL

export const register = async (student) => {
    return await axios.post(`${API_URL}/register`, student);
};

export const login = async (loginData) => {
    return await axios.post(`${API_URL}/login`, loginData);
};

export const getStudents = async () => {
    return await axios.get(`${API_URL}/students`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
};

export const deleteStudent = async (id) => {
    return await axios.delete(`${API_URL}/students/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
};

export const updateStudent = async (id, student) => {
    return await axios.put(`${API_URL}/students/${id}`, student, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
};
