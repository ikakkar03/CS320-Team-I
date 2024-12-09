import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; 

const LoginPopup = ({ isPopupOpen, togglePopup, loginType }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 
  if (!isPopupOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = 'http://localhost:3000/api/student/signin';
  
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        // Save user ID in local storage or state
        localStorage.setItem('student_id', result.user.user_id);
        navigate('/student-login');
      } else {
        alert(result.message || 'Login failed');
      }
    } catch (error) {
      alert('Network error: ' + error.message);
    }
  };
  
  

  const heading = loginType === 'student' ? 'Student Login' : 'Consultant Login';

  return (
    <PopupOverlay>
      <Popup>
        <CloseButton onClick={togglePopup}>×</CloseButton>
        <h2>{heading}</h2>
        <form onSubmit={handleSubmit}>
          <Label>Email:</Label>
          <Input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Label>Password:</Label>
          <Input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <ForgotPassword>Forgot Password?</ForgotPassword>
          <SubmitButton type="submit">Sign in</SubmitButton>
        </form>
      </Popup>
    </PopupOverlay>
  );
};

// Styled Components
const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const Popup = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  width: 300px;
  position: relative;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  color: #1a2e6c;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  font-weight: bold;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

const Label = styled.label`
  display: block;
  margin: 10px 0 5px;
  color: #1a2e6c;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const ForgotPassword = styled.div`
  text-align: right;
  margin-top: 10px;
  font-size: 12px;
  color: #1a2e6c;
  cursor: pointer;
`;

const SubmitButton = styled.button`
  background-color: #1a2e6c;
  color: white;
  border: none;
  padding: 10px;
  width: 100%;
  border-radius: 5px;
  font-size: 14px;
  margin-top: 15px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #16325c;
  }
`;

export default LoginPopup;