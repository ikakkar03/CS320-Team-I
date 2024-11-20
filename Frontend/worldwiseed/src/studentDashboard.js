import React from 'react';
import styled from 'styled-components';

    function StudentDashboard() {
        return (
        <Container>
            <NavBar>
                <span>My Application</span>
                <span>Colleges</span>
                <span>Counseling</span>
            </NavBar>
            <MainContent>
                <Widget>
                    <h3>Application Checklist</h3>
                    <WidgetBody>

                    </WidgetBody>
                    <InputTask type='text' placeholder='Add new...'/>
                </Widget>
                <Widget>
                    <h3>Saved Colleges</h3>
                    <WidgetBody>

                    </WidgetBody>
                    <CollegeSearchButton>Search for Colleges</CollegeSearchButton>
                </Widget>
                <Widget>
                    <h3>Colleges Applied To</h3>
                </Widget>
            </MainContent>
        </Container>
        );
    };

    const Container = styled.div`
        background-color: #D9D9D9;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        height: 100vh;
        width: 100vw;
`;

    const NavBar = styled.div`
        background-color: #E4F2FF;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1vh 15vw ;
        height: 5vh;
    `;

    const MainContent = styled.div`
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin: 10vh 10vw;
    `;

    const Widget = styled.div`
        display: flex;
        flex-direction: column;
        background-color: #FFFFFF;
        height: 70vh;
        width: 20vw;
        border-radius: 1vh;
        padding: 2vw;
        align-items: center;
    `;

    const WidgetBody = styled.input`
        display: flex;
        flex-direction: column;
        background-color: #FFFFFF;
        height: 60vh;
        width: 100%;
        border: none;
    `;

    const InputTask = styled.input`
        height: 3vh;
        width: 10vw;
        border-radius: 0.3vw;
        border: .1vw solid #E9E9E9;
    `;

    const CollegeSearchButton = styled.button`
        background-color: #E9E9E9; 
        color: #333;
        border: none;
        padding: 1vh 2vw;
        font-size: 16px;
        text-align: center;
        cursor: pointer;
        transition: background-color 0.3s ease, border-color 0.3s ease;
    `;

export default StudentDashboard;