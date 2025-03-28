import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import EmployeeManagementApp from './Elements/EmployeeManagementApp';
import EmployeeDetails from './Elements/EmployeeDetails';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Statistics from './pages/Statistics';
import Feature from './pages/Feature';
import JobCreationForm from './pages/JobCreation';
import JobDetails from './pages/JobDetails';
import JobListings from './pages/JobListings';
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Dashboard routes with Sidebar */}
          <Route
            path="/*"
            element={
              <div className="flex">
                <Sidebar />
                <main className="flex-1 p-8 bg-slate-50 min-h-screen">
                  <Routes>
                    <Route path="/" element={<Navigate to="/jobs" />} />
                    <Route path="/jobs" element={<JobListings />} />
                    <Route path="/jobs/create" element={<JobCreationForm />} />
                    <Route path="/jobs/:jobId" element={<JobDetails />} />
                    <Route path="feature" element={<Feature />} />
                    <Route path="statistics" element={<Statistics />} />
                  </Routes>
                </main>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
      {/* Add Toaster for toast notifications */}
      <Toaster richColors />
    </>
  );
}

export default App;