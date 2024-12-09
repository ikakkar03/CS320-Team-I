// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './landingPage';
import StudentDashboard from './studentDashboard';
import CounselorDashboard from './CounselorDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* Define routes for other components here */}
        <Route path="/create-account" element={<h2>Create Account Page</h2>} />
        <Route path="/student-login" element={<StudentDashboard/>} />
        <Route path="/counselor-login" element={<CounselorDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;