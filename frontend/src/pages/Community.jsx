import React from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { FaComments, FaUserFriends, FaClipboardList, FaSignOutAlt } from "react-icons/fa";

function Community() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("loggedInUser");
        navigate("/login");
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-semibold">Community Discussions</h1>
                <button className="text-red-600 flex items-center gap-2 hover:bg-red-100 px-3 py-2 rounded-md" onClick={handleLogout}>
                    <FaSignOutAlt />
                    Logout
                </button>
            </header>

            <main className="flex-1 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: "Total Discussions", value: "124", icon: <FaComments />, color: "blue" },
                        { label: "Active Members", value: "58", icon: <FaUserFriends />, color: "green" },
                        { label: "Topics Created", value: "36", icon: <FaClipboardList />, color: "purple" },
                    ].map((card, index) => (
                        <div key={index} className={`bg-white rounded-xl shadow-sm p-6 border-l-4 border-${card.color}-500`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-500 text-sm">{card.label}</p>
                                    <h3 className="text-2xl font-bold mt-1">{card.value}</h3>
                                </div>
                                <div className={`bg-${card.color}-100 p-3 rounded-lg`}>
                                    {React.cloneElement(card.icon, { className: `text-${card.color}-500 text-xl` })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <ToastContainer />
        </div>
    );
}

export default Community;
