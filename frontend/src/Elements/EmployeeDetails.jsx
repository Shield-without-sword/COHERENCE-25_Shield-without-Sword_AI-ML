import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GetEmployeeDetailsById } from '../api';

const EmployeeDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [employee, setEmployee] = useState({});

    const fetchEmployeeDetails = async () => {
        try {
            const data = await GetEmployeeDetailsById(id);
            setEmployee(data);
        } catch (err) {
            alert('Error', err);
        }
    };

    useEffect(() => {
        fetchEmployeeDetails();
    }, [id]);

    if (!employee) {
        return <div>Employee not found</div>;
    }

    return (
        <div className="container mx-auto mt-10">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="bg-gray-800 text-white px-6 py-4">
                    <h2 className="text-2xl font-bold">Employee Details</h2>
                </div>
                <div className="p-6">
                    <div className="flex flex-col md:flex-row items-center md:items-start mb-6">
                        <div className="w-full md:w-1/3 mb-4 md:mb-0">
                            <img
                                src={employee.profileImage}
                                alt={employee.name}
                                className="w-full rounded-lg object-cover"
                            />
                        </div>
                        <div className="w-full md:w-2/3 md:pl-6">
                            <h4 className="text-xl font-semibold mb-2">{employee.name}</h4>
                            <p className="mb-2"><strong>Email:</strong> {employee.email}</p>
                            <p className="mb-2"><strong>Phone:</strong> {employee.phone}</p>
                            <p className="mb-2"><strong>Department:</strong> {employee.department}</p>
                            <p className="mb-2"><strong>Salary:</strong> {employee.salary}</p>
                        </div>
                    </div>
                    <button
                        className="bg-green-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                        onClick={() => navigate('/dashboard/employee')}
                    >
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDetails;