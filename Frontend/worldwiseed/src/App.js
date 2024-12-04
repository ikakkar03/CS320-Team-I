import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './LandingPage';
import StudentDashboard from './StudentDashboard';
//import ConsultantDashboard from './ConsultantDashboard';


function App() {
  return (
    <Router>
      <Routes>

        <Route path="/student-login" element={<StudentDashboard/>} />
        <Route path="/consultant-login" element={<h2>Consultant Login Page</h2>} />

      </Routes>
    </Router>
  );
}

export default App;
