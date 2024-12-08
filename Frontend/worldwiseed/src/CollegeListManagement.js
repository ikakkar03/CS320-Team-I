import React, { useState } from "react";
import styled from "styled-components";

const CollegeContainer = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  background-color: #e4f2ff;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px; /* Adds space between buttons */
`;

const AddButton = styled.button`
  display: block;
  margin-bottom: 20px; /* Adds spacing below the button */
  padding: 12px 20px; /* Increased size */
  background-color: #61dafb;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px; /* Slightly larger font */
  color: white;

  &:hover {
    background-color: #50aee3;
  }
`;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const PopupContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const CollegeListManagement = () => {
  const [colleges, setColleges] = useState([
    { id: 1, name: "Harvard", country: "USA", major: "Engineering", level: "Undergraduate" },
    { id: 2, name: "MIT", country: "USA", major: "Computer Science", level: "Postgraduate" },
  ]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newCollege, setNewCollege] = useState({
    name: "",
    country: "",
    major: "",
    level: "",
  });

  const handleAddCollege = () => {
    // API call to add a new college
    setColleges((prev) => [...prev, { id: Date.now(), ...newCollege }]);
    setIsPopupOpen(false);
  };

  return (
    <div>
      <AddButton onClick={() => setIsPopupOpen(true)}>Add College</AddButton>
      {colleges.map((college) => (
        <CollegeContainer key={college.id}>
          <div>
            <h3>{college.name}</h3>
            <p>
              {college.level} - {college.major} in {college.country}
            </p>
          </div>
          <ButtonContainer>
            <button onClick={() => console.log(`Editing college ID ${college.id}`)}>Edit</button>
            <button onClick={() => setColleges((prev) => prev.filter((c) => c.id !== college.id))}>
              Remove
            </button>
          </ButtonContainer>
        </CollegeContainer>
      ))}
      {isPopupOpen && (
        <PopupOverlay>
          <PopupContainer>
            <h2>Add New College</h2>
            <input
              type="text"
              placeholder="Name"
              value={newCollege.name}
              onChange={(e) => setNewCollege({ ...newCollege, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Country"
              value={newCollege.country}
              onChange={(e) => setNewCollege({ ...newCollege, country: e.target.value })}
            />
            <input
              type="text"
              placeholder="Major"
              value={newCollege.major}
              onChange={(e) => setNewCollege({ ...newCollege, major: e.target.value })}
            />
            <input
              type="text"
              placeholder="Level"
              value={newCollege.level}
              onChange={(e) => setNewCollege({ ...newCollege, level: e.target.value })}
            />
            <button onClick={handleAddCollege}>Add</button>
            <button onClick={() => setIsPopupOpen(false)}>Cancel</button>
          </PopupContainer>
        </PopupOverlay>
      )}
    </div>
  );
};

export default CollegeListManagement;
