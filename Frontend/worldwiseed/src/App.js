import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './LandingPage';
import StudentDashboard from './StudentDashboard';
//import ConsultantDashboard from './ConsultantDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/create-account" element={<h2>Create Account Page</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
