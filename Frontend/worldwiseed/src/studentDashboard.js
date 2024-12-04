import React, {useState, useEffect, useRef} from 'react';
import styled from 'styled-components';

    function StudentDashboard() {

        const [taskArr, setTaskArr] = useState([]);
        const inputTaskRef = useRef(null);
        useEffect(() => {
            const inputTask = inputTaskRef.current;

            const handleKeyUp = (e) => {
              if (e.key === 'Enter') {
                const newTask = inputTask.value;
                if (newTask.trim()) {
                    setTaskArr((prevTasks) => [...prevTasks, newTask]);
                    inputTask.value = '';  
                  }
              }
            };
        
            inputTask.addEventListener('keyup', handleKeyUp);

            return () => {
              inputTask.removeEventListener('keyup', handleKeyUp);
            };
          }, []);

        const removeTask = (index) => {
            setTaskArr((prevTasks) => prevTasks.filter((task, i) => i !== index));
        };

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
                    <WidgetBody id='checklist'>
                        {taskArr.map((task, index) => (
                            //<div key={index}>{task}</div> 
                            <TaskContainer>
                                <Checkbox type='checkbox'></Checkbox>
                                <div key={index}>{task}</div> 
                                <RemoveButton onClick={() => removeTask(index)}>X</RemoveButton>
                            </TaskContainer>
                        ))}
                    </WidgetBody>
                    <InputTask ref={inputTaskRef} id='inputTask' type='text' placeholder='Add new...'/>
                </Widget>
                <Widget>
                    <h3>Saved Colleges</h3>
                    <WidgetBody>

                    </WidgetBody>
                    <CollegeSearchButton>Search for Colleges</CollegeSearchButton>
                </Widget>
                <Widget>
                    <h3>Colleges Applied To</h3>
                    <WidgetBody>

                    </WidgetBody>
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

    const WidgetBody = styled.div`
        display: flex;
        flex-direction: column;
        background-color: #FFFFFF;
        height: 60vh;
        width: 100%;
        border: none;
        overflow-y: auto;
    `;

    const InputTask = styled.input`
        height: 3vh;
        width: 10vw;
        border-radius: 0.3vw;
        border: .1vw solid #E9E9E9;
    `;

    const TaskContainer = styled.div`
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 0.5vh;
    `;

    const Checkbox = styled.input`
    margin-right: 10px;
    transform: scale(1.2);
    `;

    const RemoveButton = styled.button`
        border: none;
        background-color: #FF0000;
        color: #FFFFFF;
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