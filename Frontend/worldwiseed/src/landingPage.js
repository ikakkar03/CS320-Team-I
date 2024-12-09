import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import illustrationImage from './landingImage.png';
import LoginPopup from './LoginPopup';
import CreateAccountPopup from './CreateAccountPopup';

const LandingPage = () => {
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [loginType, setLoginType] = useState('');
  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false);
  const navigate = useNavigate();

  const toggleLoginPopup = (type = '') => {
    setIsLoginPopupOpen(!isLoginPopupOpen);
    setLoginType(type);
  };

  const toggleCreateAccountPopup = () => {
    setIsCreateAccountOpen(!isCreateAccountOpen);
  };

  const handleLogin = (type) => {
    setIsLoginPopupOpen(true);
    setLoginType(type); // Pass type to LoginPopup
  };
  

  const handleCreateAccount = async (formData) => {
    const dataToSend = {
      first_name: formData.first_name,
      middle_name: formData.middle_name || null,
      last_name: formData.last_name,
      email: formData.email,
      password: formData.password,
    };
  
    try {
      const response = await fetch('http://localhost:3000/api/createAccount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert('Account created successfully');
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      alert(`Network Error: ${error.message}`);
    }
  };
  
  
  

  return (
    <Container>
      <NavBar>
        <Logo>WorldWiseEd</Logo>
        <NavLinks>
          <NavLink href="#">Home</NavLink>
          <NavLink href="#">About</NavLink>
          <NavLink href="#">Contact</NavLink>
          <CreateAccountButton onClick={toggleCreateAccountPopup}>
            Create an account
          </CreateAccountButton>
        </NavLinks>
      </NavBar>
      <MainContent>
        <TextSection>
          <Heading>Apply to Universities Across the World</Heading>
          <SubText>
            Apply to university abroad and perfect your application with the
            help of our consultants. Navigate your application journey with
            WorldWiseEd.
          </SubText>
          <ButtonContainer>
            <StudentLoginButton onClick={() => toggleLoginPopup('student')}>
              Student Login
            </StudentLoginButton>
            <ConsultantLoginButton onClick={() => toggleLoginPopup('consultant')}>
              Consultant Login
            </ConsultantLoginButton>
          </ButtonContainer>
        </TextSection>
        <Illustration>
          <IllustrationImage src={illustrationImage} alt="Illustration" />
        </Illustration>
      </MainContent>
      <LoginPopup
        isPopupOpen={isLoginPopupOpen}
        togglePopup={() => toggleLoginPopup('')}
        loginType={loginType}
        handleLogin={handleLogin}
      />
      <CreateAccountPopup
        isPopupOpen={isCreateAccountOpen}
        togglePopup={toggleCreateAccountPopup}
        handleCreateAccount={handleCreateAccount}
      />
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f4f9ff;
  min-height: 100vh;
  padding: 20px 40px;
`;

const NavBar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
`;

const Logo = styled.h1`
  color: #1a2e6c;
  font-size: 24px;
  font-weight: bold;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
`;

const NavLink = styled.a`
  text-decoration: none;
  color: #1a2e6c;
  font-size: 16px;
  font-weight: 500;
`;

const CreateAccountButton = styled.button`
  background-color: #1a2e6c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #16325c;
  }
`;

const MainContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
`;

const TextSection = styled.div`
  max-width: 600px;
`;

const Heading = styled.h2`
  font-size: 40px;
  color: #1a2e6c;
  margin-bottom: 20px;
  font-weight: bold;
`;

const SubText = styled.p`
  font-size: 18px;
  color: #1a2e6c;
  margin-bottom: 30px;
  line-height: 1.6;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
`;

const StudentLoginButton = styled.button`
  background-color: #1a2e6c;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #16325c;
  }
`;

const ConsultantLoginButton = styled(StudentLoginButton)`
  background-color: #1a2e6c;

  &:hover {
    background-color: #16325c;
  }
`;

const Illustration = styled.div`
  max-width: 400px;
`;

const IllustrationImage = styled.img`
  width: 100%;
  border-radius: 10px;
`;

export default LandingPage;
