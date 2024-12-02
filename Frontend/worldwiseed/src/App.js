import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './landingPage';
import Dashboard from './Dashboard';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/create-account" element={<h2>Create Account Page</h2>} />
                <Route path="/student-login" element={<h2>Student Login Page</h2>} />
                <Route path="/consultant-login" element={<h2>Consultant Login Page</h2>} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </Router>
    );
}

export default App;
