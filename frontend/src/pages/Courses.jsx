import React from "react";

const Course = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="max-w-4xl w-full bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">📚 Course Page</h1>
        <p className="text-gray-600 text-lg mb-6">
          Explore our structured full-stack development courses designed to help you learn step by step. Enhance your skills with real-world projects, coding exercises, and mentor support.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 border rounded-lg shadow-md hover:shadow-xl transition">
            <h2 className="text-xl font-semibold text-gray-700">Frontend Development</h2>
            <p className="text-gray-500">Learn React, Tailwind CSS, and modern frontend technologies.</p>
          </div>
          <div className="p-5 border rounded-lg shadow-md hover:shadow-xl transition">
            <h2 className="text-xl font-semibold text-gray-700">Backend Development</h2>
            <p className="text-gray-500">Master Node.js, Express, and MongoDB with real projects.</p>
          </div>
          <div className="p-5 border rounded-lg shadow-md hover:shadow-xl transition">
            <h2 className="text-xl font-semibold text-gray-700">Full-Stack Projects</h2>
            <p className="text-gray-500">Work on hands-on projects to build real-world applications.</p>
          </div>
          <div className="p-5 border rounded-lg shadow-md hover:shadow-xl transition">
            <h2 className="text-xl font-semibold text-gray-700">Interview Preparation</h2>
            <p className="text-gray-500">Get ready for technical interviews with coding challenges.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Course;
