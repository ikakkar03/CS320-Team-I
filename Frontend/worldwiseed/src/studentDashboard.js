import React, {useState, useEffect, useRef} from 'react';
import styled from 'styled-components';
import { FaSignOutAlt } from 'react-icons/fa';

function StudentDashboard() {
    const [taskArr, setTaskArr] = useState([]);
    const [savedCollegesArr, setSavedCollegesArr] = useState([]);
    const [collegesApplied, setCollegesApplied] = useState({
        accepted: [],
        waitlisted: [],
        rejected: [],
    });
    const [allColleges, setAllColleges] = useState([]);
    const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false);
    const inputTaskRef = useRef(null);

    const userId = localStorage.getItem('user_id');
  console.log('Fetched student_id from backend:', localStorage.getItem('student_id'));


  
    useEffect(() => {
      const studentId = localStorage.getItem('student_id');
  
      // Fetch saved colleges from the server
      fetch(`http://localhost:3000/api/student/${studentId}/saved-colleges`)
          .then((res) => res.json())
          .then((data) => setSavedCollegesArr(data))
          .catch((err) => console.error('Error fetching saved colleges:', err));
  
      // Fetch applied colleges from the server
      fetch(`http://localhost:3000/api/student/${studentId}/applied-colleges`)
          .then((res) => res.json())
          .then((data) => {
              // data = {Accepted: [...], Waitlisted: [...], Rejected: [...]}
              setCollegesApplied(data);
          })
          .catch((err) => console.error('Error fetching applied colleges:', err));
  }, []);

    useEffect(() => {
        const inputTask = inputTaskRef.current;

        const handleKeyUp = (e) => {
            if (e.key === 'Enter') {
                const newTask = inputTask.value;
                if (newTask.trim()) {
                    setTaskArr((prevTasks) => [
                        ...prevTasks,
                        { text: newTask, checked: false },
                    ]);
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

    const toggleTaskChecked = (index) => {
        setTaskArr((prevTasks) =>
            prevTasks.map((task, i) =>
                i === index ? { ...task, checked: !task.checked } : task
            )
        );
    };

// Modify handleDragStart and handleDrop to work with object arrays:
const handleDragStart = (e, college) => {
  e.dataTransfer.setData('university_id', college.university_id);
};

const handleDragOver = (e) => {
  e.preventDefault();
};

const handleDrop = (e, decisionType) => {
  e.preventDefault();
  const university_id = parseInt(e.dataTransfer.getData('university_id'), 10);
  const studentId = localStorage.getItem('student_id');

  if (decisionType === 'saved') {
    // Move from applied to saved
    fetch('http://localhost:3000/api/student/unapply-college', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_id: studentId, university_id }),
    })
    .then(res => res.json())
    .then(() => {
      refreshData();
    })
    .catch(err => console.error('Error moving college back to saved:', err));
  } else {
    // Move from saved to applied
    const applied_status = decisionType.charAt(0).toUpperCase() + decisionType.slice(1);
    fetch('http://localhost:3000/api/student/apply-college', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_id: studentId, university_id, applied_status }),
    })
    .then(res => res.json())
    .then(() => {
      refreshData();
    })
    .catch(err => console.error('Error applying to college:', err));
  }

  e.dataTransfer.clearData();
};


const refreshData = () => {
  const studentId = localStorage.getItem('student_id');
  // Fetch saved
  fetch(`http://localhost:3000/api/student/${studentId}/saved-colleges`)
    .then(res => res.json())
    .then(data => setSavedCollegesArr(data))
    .catch(err => console.error('Error fetching saved colleges:', err));

  // Fetch applied
  fetch(`http://localhost:3000/api/student/${studentId}/applied-colleges`)
    .then(res => res.json())
    .then(data => setCollegesApplied(data))
    .catch(err => console.error('Error fetching applied colleges:', err));
};


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
      const studentId = localStorage.getItem('student_id');
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
          if (data.university) {
            // If we have a university object returned, add it once.
            alert(data.message);
            setSavedCollegesArr((prev) => [...prev, data.university]);
          } else {
            // If there's no university object, just alert the message.
            alert(data.message);
          }
        })
        .catch((err) => console.error('Error adding college to preferences:', err));
  };

  const removeSavedUniversity = (university_id) => {
    const studentId = localStorage.getItem('student_id');
    fetch(`http://localhost:3000/api/student/${studentId}/remove-university/${university_id}`, {
      method: 'DELETE',
    })
    .then(res => res.json())
    .then(data => {
      if (data.message) {
        alert(data.message); 
        // Refresh saved colleges list
        refreshData();
      }
    })
    .catch(err => console.error('Error removing saved college:', err));
  };
  
    return (
      <Container>
        <NavBar>
          <span>My Application</span>
          <span>Colleges</span>
          <span>Counseling</span>
          <SignoutButton>
                    <FaSignOutAlt size={30} />
          </SignoutButton>
        </NavBar>
        <MainContent>
          {/* Application Checklist */}
          <Widget>
                    <h3>Application Checklist</h3>
                    <WidgetBody id="checklist">
                        {taskArr.map((task, index) => (
                            <TaskContainer key={index}>
                                <Checkbox
                                    type="checkbox"
                                    checked={task.checked}
                                    onChange={() => toggleTaskChecked(index)}
                                />
                                <div>{task.text}</div>
                                <RemoveButton onClick={() => removeTask(index)}>X</RemoveButton>
                            </TaskContainer>
                        ))}
                    </WidgetBody>
                    <InputTask ref={inputTaskRef} id="inputTask" type="text" placeholder="Add new..." />
                </Widget>
  
{/* Saved Colleges */}
<Widget>
  <h3>Saved Colleges</h3>
  <WidgetBody onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, 'saved')}>
    {savedCollegesArr.map((college) => (
      <CollegeDiv key={college.university_id} draggable onDragStart={(e) => handleDragStart(e, college)}>
        {college.name}
      <CollegeRemoveButton onClick={() => removeSavedUniversity(college.university_id)}>Remove</CollegeRemoveButton>
      </CollegeDiv>
    ))}
  </WidgetBody>
  <CollegeSearchButton onClick={toggleSearchPopup}>Search for Colleges</CollegeSearchButton>
</Widget>

  
{/* Colleges Applied To */}
<Widget>
  <h3>Colleges Applied To</h3>
  <WidgetBody>
    {['Accepted', 'Waitlisted', 'Rejected'].map((status) => (
      <DecisionContainer key={status}>
        <b>{status}</b>
        <DecisionListContainer
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, status.toLowerCase())}
        >
          {collegesApplied[status]?.map((college) => (
            <CollegeDiv key={college.university_id} draggable onDragStart={(e) => handleDragStart(e, college)}>
              {college.name}
            </CollegeDiv>
          ))}
        </DecisionListContainer>
      </DecisionContainer>
    ))}
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

const SignoutButton = styled.button`
    background-color: #e4f2ff;
    border: none;
    height: 1vh;
    width: 1vw;
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

const CollegeDiv = styled.div`
    background-color: #e9e9e9;
    margin-bottom: 2vh;
    padding: 1vh;
    cursor: pointer;
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
    background-color: #e9e9e9;
    color: #333;
    border: none;
    padding: 1vh 2vw;
    font-size: 16px;
    text-align: center;
    cursor: pointer;
    transition: background-color 0.3s ease, border-color 0.3s ease;
`;

const DecisionContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    text-align: center;
`;

const DecisionListContainer = styled.div`
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    border-top: 1px solid #ccc;
    overflow-y: auto;
    padding: 1vh;
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

const CollegeRemoveButton = styled.button`
  background-color: #f8d7da;
  border: none;
  padding: 4px 8px;
  color: #721c24;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 8px;
  
  &:hover {
    background-color: #f5c6cb;
  }
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