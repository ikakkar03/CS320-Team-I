import React, {useState, useEffect, useRef} from 'react';
import styled from 'styled-components';

function StudentDashboard() {
    const [taskArr, setTaskArr] = useState([]);
    const [savedColleges, setSavedColleges] = useState([]);
    const [appliedColleges, setAppliedColleges] = useState([]); // State for colleges applied to
    const [allColleges, setAllColleges] = useState([]);
    const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false);
    const inputTaskRef = useRef(null);
  
    const studentId = localStorage.getItem('student_id'); // Fetch student_id from localStorage
  
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
      setTaskArr((prevTasks) => prevTasks.filter((_, i) => i !== index));
    };
  
    useEffect(() => {
      // Fetch saved colleges
      fetch(`http://localhost:3000/api/student/${studentId}/saved-colleges`)
        .then((res) => res.json())
        .then((data) => setSavedColleges(data))
        .catch((err) => console.error('Error fetching saved colleges:', err));
  
      // Fetch colleges applied to
      fetch(`http://localhost:3000/api/student/${studentId}/applied-colleges`)
        .then((res) => res.json())
        .then((data) => setAppliedColleges(data))
        .catch((err) => console.error('Error fetching applied colleges:', err));
    }, [studentId]);
  
    const toggleSearchPopup = () => {
      setIsSearchPopupOpen(!isSearchPopupOpen);
      if (!isSearchPopupOpen) {
        // Fetch all colleges when opening the popup
        fetch(`http://localhost:3000/api/universities`)
          .then((res) => res.json())
          .then((data) => setAllColleges(data))
          .catch((err) => console.error('Error fetching all colleges:', err));
      }
    };
  
    const addCollegeToPreferences = (universityId) => {
        const studentId = localStorage.getItem('student_id'); // Retrieve from localStorage or context
      
        fetch(`http://localhost:3000/api/student/add-university`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            student_id: studentId,
            university_id: universityId,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.message) {
              alert(data.message);
              setSavedColleges((prev) => [...prev, data.preference]);
            }
          })
          .catch((err) => console.error('Error adding college to preferences:', err));
      };
      
  
    return (
      <Container>
        <NavBar>
          <span>My Application</span>
          <span>Colleges</span>
          <span>Counseling</span>
        </NavBar>
        <MainContent>
          {/* Application Checklist */}
          <Widget>
            <h3>Application Checklist</h3>
            <WidgetBody id="checklist">
              {taskArr.map((task, index) => (
                <TaskContainer key={index}>
                  <Checkbox type="checkbox"></Checkbox>
                  <div>{task}</div>
                  <RemoveButton onClick={() => removeTask(index)}>X</RemoveButton>
                </TaskContainer>
              ))}
            </WidgetBody>
            <InputTask ref={inputTaskRef} id="inputTask" type="text" placeholder="Add new..." />
          </Widget>
  
          {/* Saved Colleges */}
          <Widget>
            <h3>Saved Colleges</h3>
            <WidgetBody>
              {savedColleges.length > 0 ? (
                savedColleges.map((college) => (
                  <CollegeRow key={college.university_id}>
                    <div>{college.name || 'N/A'}</div>
                    <div>{college.country || 'N/A'}</div>
                    <div>{college.major_offered || 'N/A'}</div>
                    <div>{college.education_level || 'N/A'}</div>
                  </CollegeRow>
                ))
              ) : (
                <div>No saved colleges found</div>
              )}
            </WidgetBody>
            <CollegeSearchButton onClick={toggleSearchPopup}>Search for Colleges</CollegeSearchButton>
          </Widget>
  
          {/* Colleges Applied To */}
          <Widget>
            <h3>Colleges Applied To</h3>
            <WidgetBody>
              {appliedColleges.length > 0 ? (
                appliedColleges.map((college) => (
                  <CollegeRow key={college.university_id}>
                    <div>{college.name || 'N/A'}</div>
                    <div>{college.status || 'N/A'}</div>
                  </CollegeRow>
                ))
              ) : (
                <div>No colleges applied to yet</div>
              )}
            </WidgetBody>
          </Widget>
        </MainContent>
  
        {/* Search Popup */}
        {isSearchPopupOpen && (
          <SearchPopup>
            <CloseButton onClick={toggleSearchPopup}>×</CloseButton>
            <h3>Search for Colleges</h3>
            <SearchResults>
              {allColleges.map((college) => (
                <SearchResult key={college.university_id}>
                  <div>{college.name}</div>
                  <div>{college.country}</div>
                  <button onClick={() => addCollegeToPreferences(college.university_id)}>Add</button>
                </SearchResult>
              ))}
            </SearchResults>
          </SearchPopup>
        )}
      </Container>
    );
  }
  
// Styled Components
const Container = styled.div`
  background-color: #d9d9d9;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  height: 100vh;
  width: 100vw;
`;

const NavBar = styled.div`
  background-color: #e4f2ff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1vh 15vw;
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
  background-color: #ffffff;
  height: 70vh;
  width: 20vw;
  border-radius: 1vh;
  padding: 2vw;
  align-items: center;
`;

const WidgetBody = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  height: 60vh;
  width: 100%;
  border: none;
  overflow-y: auto;
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
  background-color: #ff0000;
  color: #ffffff;
`;

const InputTask = styled.input`
  height: 3vh;
  width: 10vw;
  border-radius: 0.3vw;
  border: 0.1vw solid #e9e9e9;
`;

const CollegeRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const CollegeSearchButton = styled.button`
  background-color: #61dafb;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
`;

const SearchPopup = styled.div`
  position: fixed;
  top: 10%;
  left: 20%;
  width: 60%;
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  z-index: 1000;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

const SearchResults = styled.div`
  max-height: 50vh;
  overflow-y: auto;
`;

const SearchResult = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;

  button {
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 5px;
  }
`;
  
  export default StudentDashboard;