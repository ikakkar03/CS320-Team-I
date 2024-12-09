import React, { useState } from 'react';
import styled from 'styled-components';

const CreateAccountPopup = ({ isPopupOpen, togglePopup, handleCreateAccount }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // Debugging step
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
  
    const { confirmPassword, ...dataToSend } = formData; // Exclude confirmPassword
    handleCreateAccount(dataToSend);
  };
  

  if (!isPopupOpen) return null;

  return (
    <Overlay>
      <PopupContainer>
        <CloseButton onClick={togglePopup}>&times;</CloseButton>
        <Heading>Create Account</Heading>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            name="middle_name"
            placeholder="Middle Name (Optional)"
            value={formData.middle_name}
            onChange={handleChange}
          />
          <Input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
          <Input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <SubmitButton type="submit">Create Account</SubmitButton>
        </Form>
      </PopupContainer>
    </Overlay>
  );
};

// Styled Components
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const PopupContainer = styled.div`
  background: white;
  width: 400px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  position: relative;
  text-align: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;

  &:hover {
    color: #333;
  }
`;

const Heading = styled.h2`
  font-size: 24px;
  color: #1a2e6c;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  background-color: #1a2e6c;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #16325c;
  }
`;

export default CreateAccountPopup;
