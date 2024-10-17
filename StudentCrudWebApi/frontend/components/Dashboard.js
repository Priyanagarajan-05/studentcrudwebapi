

import React, { useEffect, useState } from 'react';
import { getStudents, deleteStudent } from '../api';
import { useNavigate } from 'react-router-dom';
import EditStudentForm from './EditStudentForm'; // Import the Edit component
import axios from 'axios';

const Dashboard = () => {
    const [students, setStudents] = useState([]);
    const [editingStudent, setEditingStudent] = useState(null);
    const [studentData, setStudentData] = useState({ name: '', email: '', phoneNumber: '', department: '', dob: '' });
    const [currentPage, setCurrentPage] = useState(1); // State to track the current page
    const [studentsPerPage] = useState(10); // Number of students per page
    const navigate = useNavigate();

    // Fetch students from API
    const fetchStudents = async () => {
        const response = await getStudents();
        setStudents(response.data);
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    // Handle deleting a student
    const handleDelete = async (id) => {
        await deleteStudent(id);
        fetchStudents();
    };

    // Handle editing a student
    const handleEdit = (student) => {
        setEditingStudent(student.id);
        setStudentData({
            name: student.name,
            email: student.email,
            phoneNumber: student.phoneNumber,
            department: student.department,
            dob: new Date(student.dob).toISOString().split('T')[0], // Format date for input
        });
    };

    // Handle updating student data
    const handleUpdate = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put(`/api/auth/students/${studentData.id}`, studentData);
            console.log(response.data);
            alert('Student updated successfully!');
            setEditingStudent(null);
            fetchStudents();
        } catch (error) {
            console.error('Error updating student:', error);
            alert('Failed to update student. Please try again.');
        }
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // Pagination logic
    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="dashboard">
            <style jsx>{`
                .dashboard {
                    padding: 20px;
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    max-width: 1200px;
                    margin: auto;
                    border-radius: 8px;
                    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                }

                h1 {
                    color: #333;
                    text-align: center;
                    margin-bottom: 20px;
                }

                button {
                    background-color: #28a745;
                    color: white;
                    border: none;
                    padding: 10px 15px;
                    margin: 5px;
                    cursor: pointer;
                    border-radius: 5px;
                    font-size: 14px;
                }

                button:hover {
                    background-color: #218838;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }

                th, td {
                    border: 1px solid #ddd;
                    padding: 10px;
                    text-align: left;
                }

                th {
                    background-color: #007bff;
                    color: white;
                }

                tr:hover {
                    background-color: #f1f1f1;
                }

                tr:nth-child(even) {
                    background-color: #f9f9f9;
                }

                .pagination {
                    display: flex;
                    justify-content: center;
                    margin-top: 20px;
                }

                .page-item {
                    margin: 0 5px;
                }

                .page-link {
                    background-color: #007bff;
                    color: white;
                    border: none;
                    padding: 10px 15px;
                    cursor: pointer;
                    border-radius: 5px;
                }

                .page-link:hover {
                    background-color: #0056b3;
                }
            `}</style>

            <h1>Dashboard</h1>
            <button onClick={handleLogout}>Logout</button>

            {editingStudent && (
                <EditStudentForm
                    studentData={studentData}
                    setStudentData={setStudentData}
                    handleUpdate={handleUpdate}
                    setEditingStudent={setEditingStudent}
                />
            )}

            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Department</th>
                        <th>DOB</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentStudents.map((student) => (
                        <tr key={student.id}>
                            <td>{student.name}</td>
                            <td>{student.email}</td>
                            <td>{student.phoneNumber}</td>
                            <td>{student.department}</td>
                            <td>{new Date(student.dob).toLocaleDateString()}</td>
                            <td>
                                <button onClick={() => handleEdit(student)}>Edit</button>
                                <button onClick={() => handleDelete(student.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="pagination">
                {Array.from({ length: Math.ceil(students.length / studentsPerPage) }, (_, index) => (
                    <div key={index} className="page-item">
                        <button
                            className="page-link"
                            onClick={() => paginate(index + 1)}
                        >
                            {index + 1}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
