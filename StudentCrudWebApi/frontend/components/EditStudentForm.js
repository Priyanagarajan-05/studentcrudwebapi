
import React from 'react';

const EditStudentForm = ({ studentData, setStudentData, handleUpdate, setEditingStudent }) => {
    return (
        <div>
            <style jsx>{`
                form {
                    margin: 20px 0;
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 5px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }

                form input {
                    width: calc(100% - 20px);
                    padding: 10px;
                    margin: 10px 0;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 14px;
                }

                form button {
                    background-color: #007bff;
                    color: white;
                    border: none;
                    padding: 10px 15px;
                    margin: 10px 5px;
                    cursor: pointer;
                    border-radius: 5px;
                    font-size: 14px;
                }

                form button:hover {
                    background-color: #0056b3;
                }

                .edit-form h2 {
                    margin-bottom: 15px;
                    font-size: 18px;
                    color: #333;
                }

                .edit-form {
                    max-width: 600px;
                    margin: auto;
                }
            `}</style>

            <form className="edit-form" onSubmit={handleUpdate}>
                <h2>Edit Student</h2>
                <input
                    type="text"
                    placeholder="Name"
                    value={studentData.name}
                    onChange={(e) => setStudentData({ ...studentData, name: e.target.value })}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={studentData.email}
                    onChange={(e) => setStudentData({ ...studentData, email: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Phone Number"
                    value={studentData.phoneNumber}
                    onChange={(e) => setStudentData({ ...studentData, phoneNumber: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Department"
                    value={studentData.department}
                    onChange={(e) => setStudentData({ ...studentData, department: e.target.value })}
                    required
                />
                <input
                    type="date"
                    placeholder="DOB"
                    value={studentData.dob}
                    onChange={(e) => setStudentData({ ...studentData, dob: e.target.value })}
                    required
                />
                <button type="submit">Update Student</button>
                <button type="button" onClick={() => setEditingStudent(null)}>Cancel</button>
            </form>
        </div>
    );
};

export default EditStudentForm;
