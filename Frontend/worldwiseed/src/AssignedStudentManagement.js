import React, { useState } from "react";
import styled from "styled-components";

const StudentContainer = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  background-color: #e4f2ff;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const CollegeList = styled.ul`
  list-style: none;
  padding: 0;

  li {
    margin: 10px 0;
    padding: 10px;
    background-color: #f0f4ff;
    border: 1px solid #4a90e2;
    border-radius: 5px;
  }
`;

const AssignedStudentManagement = () => {
  const [assignedStudents, setAssignedStudents] = useState([
    {
      id: 1,
      name: "John Doe",
      preferences: [
        { name: "Harvard", country: "USA", major: "Engineering", level: "Undergraduate" },
        { name: "MIT", country: "USA", major: "Computer Science", level: "Postgraduate" },
      ],
      checklist: ["Essay", "Resume"],
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");

  const addChecklistItem = (studentId, item) => {
    console.log(`Adding "${item}" to student ID ${studentId}`);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search students..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
          borderRadius: "5px",
          border: "1px solid #ddd",
        }}
      />
      {assignedStudents
        .filter((student) => student.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .map((student) => (
          <StudentContainer key={student.id}>
            <h3>{student.name}</h3>
            <h4>College Preferences:</h4>
            <CollegeList>
              {student.preferences.map((college, index) => (
                <li key={index}>
                  <strong>{college.name}</strong> ({college.level})
                  <p>{college.major} in {college.country}</p>
                </li>
              ))}
            </CollegeList>
            <h4>Application Checklist:</h4>
            <ul>
              {student.checklist.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <button onClick={() => addChecklistItem(student.id, "New Item")}>Add Checklist Item</button>
          </StudentContainer>
        ))}
    </div>
  );
};

export default AssignedStudentManagement;
