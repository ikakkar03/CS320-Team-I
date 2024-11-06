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
                        <h2>Login</h2>
                        <form onSubmit={handleLogin}>
                            <label htmlFor="username">Username:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button type="submit" className="submit-btn">Login</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginPopup;
