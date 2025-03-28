import React from 'react';
import { Link } from 'react-router-dom';
import { DeleteEmployeeById } from '../api';
import { notify } from '../utils';

function EmployeeTable({
    employees = [],
    pagination = { currentPage: 1, totalPages: 1 },
    fetchEmployees,
    handleUpdateEmployee,
}) {
    const headers = ['Name', 'Email', 'Phone', 'Department', 'Actions'];
    const { currentPage, totalPages } = pagination;

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            handlePagination(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            handlePagination(currentPage - 1);
        }
    };

    const handlePagination = (page) => {
        if (fetchEmployees) {
            fetchEmployees('', page, 5);
        }
    };

    const handleDeleteEmployee = async (id) => {
        try {
            const { success, message } = await DeleteEmployeeById(id);
            if (success) {
                notify(message, 'success');
            } else {
                notify(message, 'error');
            }
            if (fetchEmployees) {
                fetchEmployees();
            }
        } catch (err) {
            console.error(err);
            notify('Failed to delete Employee', 'error');
        }
    };

    const TableRow = ({ employee }) => (
        <tr className="border-b">
            <td className="py-2 px-4">
                <Link
                    to={`/dashboard/employee/${employee._id}`}
                    className="text-blue-500 hover:underline"
                >
                    {employee.name}
                </Link>
            </td>
            <td className="py-2 px-4">{employee.email}</td>
            <td className="py-2 px-4">{employee.phone}</td>
            <td className="py-2 px-4">{employee.department}</td>
            <td className="py-2 px-4 flex space-x-4">
                {handleUpdateEmployee && (
                    <button
                        className="text-yellow-500 hover:text-yellow-600"
                        onClick={() => handleUpdateEmployee(employee)}
                    >
                        ✏️
                    </button>
                )}
                <button
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleDeleteEmployee(employee._id)}
                >
                    🗑️
                </button>
            </td>
        </tr>
    );

    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

    return (
        <>
            <table className="table-auto w-full border-collapse border border-gray-300">
                <thead className="bg-gray-200">
                    <tr>
                        {headers.map((header, i) => (
                            <th
                                key={i}
                                className="py-2 px-4 text-left text-gray-600 font-medium"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {employees.length === 0 ? (
                        <tr>
                            <td
                                colSpan={headers.length}
                                className="py-4 text-center text-gray-500"
                            >
                                Data Not Found
                            </td>
                        </tr>
                    ) : (
                        employees.map((emp) => <TableRow employee={emp} key={emp._id} />)
                    )}
                </tbody>
            </table>

            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                    </span>
                    <div className="flex items-center space-x-2">
                        <button
                            className="px-3 py-1 border rounded text-gray-500 hover:bg-gray-200 disabled:opacity-50"
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        {pageNumbers.map((page) => (
                            <button
                                key={page}
                                className={`px-3 py-1 border rounded ${
                                    currentPage === page
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-500 hover:bg-gray-200'
                                }`}
                                onClick={() => handlePagination(page)}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            className="px-3 py-1 border rounded text-gray-500 hover:bg-gray-200 disabled:opacity-50"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default EmployeeTable;