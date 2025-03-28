import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { APIUrl, handleError, handleSuccess } from "../utils";
import { ToastContainer } from "react-toastify";
import { 
  FaBook, FaCode, FaProjectDiagram, FaComments, FaChalkboardTeacher, FaSignOutAlt, 
  FaUserCircle, FaLaptopCode, FaBriefcase, FaTrophy
} from "react-icons/fa";

function Home() {
    const [loggedInUser, setLoggedInUser] = useState("");
    const [expenses, setExpenses] = useState([]);
    const [incomeAmt, setIncomeAmt] = useState(0);
    const [expenseAmt, setExpenseAmt] = useState(0);
    const [activeMenu, setActiveMenu] = useState("projects");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setLoggedInUser(localStorage.getItem("loggedInUser"));
        
        // Set active menu based on current path
        const path = location.pathname.substring(1);
        if (path) {
            setActiveMenu(path);
        } else {
            setActiveMenu("projects");
        }
    }, [location]);

    useEffect(() => {
        const amounts = expenses.map(item => item.amount);
        const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0);
        const exp = amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1;
        setIncomeAmt(income);
        setExpenseAmt(exp);
    }, [expenses]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("loggedInUser");
        handleSuccess("User Logged Out");
        setTimeout(() => {
            navigate("/login");
        }, 1000);
    };

    const fetchExpenses = async () => {
        try {
            const url = `${APIUrl}/expenses`;
            const headers = {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            };
            const response = await fetch(url, headers);
            if (response.status === 403) {
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }
            const result = await response.json();
            setExpenses(result.data);
        } catch (err) {
            handleError(err);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    // Only the specified menu items
    const menuItems = [
        { name: "courses", icon: <FaBook />, label: "Courses" },
        { name: "mentorship", icon: <FaChalkboardTeacher />, label: "Mentorship" },
        { name: "interview", icon: <FaBriefcase />, label: "Interview" },
        { name: "projects", icon: <FaProjectDiagram />, label: "Projects" },
        { name: "community", icon: <FaComments />, label: "Community" },
        { name: "hackathon", icon: <FaTrophy />, label: "Hackathon" }
    ];

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Simplified Header with Only Required Navigation Elements */}
            <header className="bg-white shadow-md">
                <div className="flex flex-wrap items-center justify-between px-4 py-3">
                    {/* User Profile */}
                    <div className="flex items-center gap-2 mr-4">
                        <FaUserCircle className="text-lg text-indigo-600" />
                        <span className="font-medium text-sm">{loggedInUser}</span>
                    </div>
                    
                    {/* Simplified Navigation Menu with just 6 items */}
                    <nav className="flex flex-1 flex-wrap items-center justify-center gap-2">
                        {menuItems.map((item) => (
                            <button 
                                key={item.name}
                                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 text-sm whitespace-nowrap ${
                                    activeMenu === item.name 
                                        ? "bg-indigo-600 text-white" 
                                        : "text-gray-700 hover:bg-indigo-100 hover:text-indigo-800"
                                }`} 
                                onClick={() => {
                                    setActiveMenu(item.name);
                                    navigate(`/${item.name}`);
                                }}
                            >
                                <span>{item.icon}</span>
                                <span className="font-medium">{item.label}</span>
                            </button>
                        ))}
                    </nav>
                    
                    {/* Logout Button */}
                    <button 
                        className="flex items-center gap-1 px-2 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg ml-2"
                        onClick={handleLogout}
                    >
                        <FaSignOutAlt />
                        <span>Logout</span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-6">
                {/* Page Title */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 capitalize">
                        Dashboard
                    </h1>
                    <p className="text-gray-500">
                        Welcome back, {loggedInUser}! Here's an overview of your progress.
                    </p>
                </div>
                
                {/* Dashboard Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Stats Cards */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm">Course Progress</p>
                                <h3 className="text-2xl font-bold mt-1">67%</h3>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <FaBook className="text-blue-500 text-xl" />
                            </div>
                        </div>
                        <div className="mt-4 bg-gray-200 h-2 rounded-full">
                            <div className="bg-blue-500 h-2 rounded-full w-2/3"></div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm">Exercises Completed</p>
                                <h3 className="text-2xl font-bold mt-1">24/36</h3>
                            </div>
                            <div className="bg-green-100 p-3 rounded-lg">
                                <FaCode className="text-green-500 text-xl" />
                            </div>
                        </div>
                        <div className="mt-4 bg-gray-200 h-2 rounded-full">
                            <div className="bg-green-500 h-2 rounded-full w-2/3"></div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm">Projects Submitted</p>
                                <h3 className="text-2xl font-bold mt-1">5/8</h3>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-lg">
                                <FaProjectDiagram className="text-purple-500 text-xl" />
                            </div>
                        </div>
                        <div className="mt-4 bg-gray-200 h-2 rounded-full">
                            <div className="bg-purple-500 h-2 rounded-full w-5/8"></div>
                        </div>
                    </div>
                    
                    {/* Recent Activities */}
                    <div className="md:col-span-2 lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <FaLaptopCode className="text-indigo-600" />
                            Recent Activities
                        </h3>
                        <div className="space-y-4">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="flex items-start gap-3 pb-3 border-b border-gray-100">
                                    <div className="bg-indigo-100 p-2 rounded">
                                        <FaCode className="text-indigo-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium">Completed Exercise #{item}</h4>
                                        <p className="text-sm text-gray-500">Array Manipulation - Level {item}</p>
                                    </div>
                                    <span className="text-xs text-gray-400 ml-auto">{item} hour{item !== 1 ? 's' : ''} ago</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Upcoming Mentorship */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <FaChalkboardTeacher className="text-indigo-600" />
                            Upcoming Mentorship
                        </h3>
                        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="font-medium">Code Review Session</h4>
                                <span className="text-xs bg-indigo-200 text-indigo-800 py-1 px-2 rounded">Tomorrow</span>
                            </div>
                            <p className="text-sm text-gray-600">10:00 AM - 11:00 AM</p>
                            <div className="flex items-center gap-2 mt-3 text-sm text-indigo-600">
                                <FaUserCircle />
                                <span>with David Chen</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ToastContainer />
        </div>
    );
}

export default Home;