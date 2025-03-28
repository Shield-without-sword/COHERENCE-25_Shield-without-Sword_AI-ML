import React from "react";

const Mentorship = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="max-w-4xl w-full bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">👨‍🏫 Mentorship Program</h1>
        <p className="text-gray-600 text-lg mb-6">
          Get one-on-one mentorship from industry experts. Improve your coding skills, work on real-world projects, and receive career guidance.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 border rounded-lg shadow-md hover:shadow-xl transition">
            <h2 className="text-xl font-semibold text-gray-700">👥 Peer Learning</h2>
            <p className="text-gray-500">Join study groups and learn with others.</p>
          </div>
          <div className="p-5 border rounded-lg shadow-md hover:shadow-xl transition">
            <h2 className="text-xl font-semibold text-gray-700">💼 Career Coaching</h2>
            <p className="text-gray-500">Get career advice and resume reviews.</p>
          </div>
          <div className="p-5 border rounded-lg shadow-md hover:shadow-xl transition">
            <h2 className="text-xl font-semibold text-gray-700">🛠 Project Assistance</h2>
            <p className="text-gray-500">Receive help on your personal and team projects.</p>
          </div>
          <div className="p-5 border rounded-lg shadow-md hover:shadow-xl transition">
            <h2 className="text-xl font-semibold text-gray-700">📝 Mock Interviews</h2>
            <p className="text-gray-500">Prepare for real job interviews with mock sessions.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mentorship;
