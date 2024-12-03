import React from 'react';
import styled from 'styled-components';
import illustrationImage from './landingImage.png';
import { Link } from 'react-router-dom';
import './landingPage.css'; 
import LoginPopup from './LoginPopup';


const LandingPage = () => {
  return (
    <Container>
      <NavBar>
        <Logo>WorldWiseEd</Logo>
        <NavLinks>
          <NavLink href="#">Home</NavLink>
          <NavLink href="#">About</NavLink>
          <NavLink href="#">Contact</NavLink>
          <CreateAccountButton>Create an account</CreateAccountButton>
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
            <Link to="/student-login">
              <StudentLoginButton>Student Log in</StudentLoginButton>
            </Link>
            <ConsultantLoginButton>Consultant Log in</ConsultantLoginButton>
          </ButtonContainer>
        </TextSection>
        <Illustration>
          <IllustrationImage src={illustrationImage} alt="Illustration" />
        </Illustration>
      </MainContent>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f4f9ff; /* Light blue background */
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
  color: #1a2e6c; /* Dark blue color */
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
  color: #1a2e6c; /* Dark blue */
  font-size: 16px;
  font-weight: 500;
`;

const CreateAccountButton = styled.button`
  background-color: #1a2e6c; /* Dark blue */
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
  color: #1a2e6c; /* Dark blue */
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
  background-color: transparent; /* Dark blue */
  color: #1a2e6c;
  border: 2px solid #1a2e6c;
  padding: 12px 24px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #1a2e6c; /* Dark blue background on hover */
    color: white; /* White text on hover */
  }
`;

const ConsultantLoginButton = styled.button`
  background-color: transparent;
  color: #1a2e6c; /* Dark blue */
  border: 2px solid #1a2e6c; 
  padding: 10px 24px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #1a2e6c; /* Dark blue background on hover */
    color: white; /* White text on hover */
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
