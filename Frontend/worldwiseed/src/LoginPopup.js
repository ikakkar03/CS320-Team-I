import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPopup.css';

const LoginPopup = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        console.log('Login button clicked.');
        navigate('/dashboard'); // Redirect to dashboard without authentication
    };

    return (
        <div>
            <button className="open-btn" onClick={() => setIsOpen(true)}>Login</button>
            {isOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
                        <h2>Student Login</h2>
                        <form onSubmit={handleLogin}>
                            <label>Email:</label>
                            <input type="email" placeholder="Enter email" required />
                            <label>Password:</label>
                            <input type="password" placeholder="Enter password" required />
                            <div id="forgot-pass">
                                <label>Forgot Password?</label>
                            </div>
                            <button type="submit" className="submit-btn">Sign in</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginPopup;
