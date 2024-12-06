import React, { useState } from 'react';
import './LoginPopup.css';

const LoginPopup = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        console.log('Login:', { email, password });
        // Add login logic 
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
                            <label htmlFor="Username">Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <label htmlFor="Password">Password:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                             <div id="forgot-pass" className="float-right">
                             <label>Forgot Password</label>
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
