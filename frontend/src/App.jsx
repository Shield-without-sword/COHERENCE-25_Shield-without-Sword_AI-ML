import React, { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Statistics from './pages/Statistics';
import FuturePrediction from './pages/FuturePrediction';
import Feature from './pages/Feature';
import JobCreationForm from './pages/JobCreation';
import JobDetails from './pages/JobDetails';
import JobListings from './pages/JobListings';
import CandidateProfile from './pages/CandidateProfile';
import AvatarQA from './components/AvatarQA';
import { Toaster } from "sonner";

function App() {
  // Add CSS variable for navbar height
  useEffect(() => {
    // Set a default if the variable isn't set yet
    if (!document.documentElement.style.getPropertyValue('--navbar-height')) {
      document.documentElement.style.setProperty('--navbar-height', '64px');
    }
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* AvatarQA route without Sidebar */}
          <Route path="/interview" element={<AvatarQA />} />

          {/* Dashboard routes with Sidebar */}
          <Route
            path="/*"
            element={
              <div className="flex flex-col min-h-screen">
                <div className="flex flex-1" style={{ marginTop: 'var(--navbar-height, 64px)' }}>
                  <Sidebar />
                  <main className="flex-1 p-8 bg-slate-50 min-h-screen">
                    <Routes>
                      <Route path="/" element={<Navigate to="/jobs" />} />
                      <Route path="/jobs" element={<JobListings />} />
                      <Route path="/jobs/create" element={<JobCreationForm />} />
                      <Route path="/jobs/:jobId" element={<JobDetails />} />
                      <Route path="/candidates/:candidateId" element={<CandidateProfile />} />
                      <Route path="feature" element={<Feature />} />
                      <Route path="statistics" element={<Statistics />} />
                      <Route path="futurePrediction" element={<FuturePrediction />} />
                    </Routes>
                  </main>
                </div>
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