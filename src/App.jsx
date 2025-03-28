import { Navigate, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import PropTypes from 'prop-types';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import LandingPage from './pages/LandingPage'; 
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
