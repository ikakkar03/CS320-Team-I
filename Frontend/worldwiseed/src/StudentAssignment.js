import React, { useState } from "react";
import styled from "styled-components";

const StudentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const StudentItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: #e4f2ff;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const SearchBar = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const StudentAssignment = () => {
  const [students, setStudents] = useState([
    { id: 1, name: "John Doe", assigned: false },
    { id: 2, name: "Jane Smith", assigned: false },
    // Replace with API call to fetch all registered students
  ]);
  const [searchTerm, setSearchTerm] = useState("");

  const assignStudent = (id) => {
    // API call to assign student to the counselor
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, assigned: true } : student
      )
    );
  };

  return (
    <div>
      <SearchBar
        type="text"
        placeholder="Search students..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <StudentList>
        {students
          .filter((student) =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((student) => (
            <StudentItem key={student.id}>
              <span>{student.name}</span>
              {!student.assigned && (
                <button onClick={() => assignStudent(student.id)}>Assign</button>
              )}
              {student.assigned && <span>Assigned</span>}
            </StudentItem>
          ))}
      </StudentList>
    </div>
  );
};

export default StudentAssignment;
