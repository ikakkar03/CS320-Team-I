import React from 'react';
import { Link } from 'react-router-dom';
import './landingPage.css'; 
import LoginPopup from './LoginPopup';


const LandingPage = () => {
    return (
        <div className='landing-container'>
            <div className='header'>
                <Link to='/create-account'>
                    <button className='create-account'>Create an account</button>
                </Link>
            </div>
            <div className='content'>
                <h1>Apply to Universities Across the World</h1>
                <p>Apply to university abroad and perfect your application with the help of our consultants. Navigate your application journey with WorldWiseEd.</p>
                <img src='landingImage.png' alt='World Wide Education' />
                <div className='buttons'>
                    <LoginPopup />
                </div>
            </div>
        </div>
    );
};

export default LandingPage;