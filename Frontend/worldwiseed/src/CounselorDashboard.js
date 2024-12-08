import React, { useState } from "react";
import styled from "styled-components";
import StudentAssignment from "./StudentAssignment";
import AssignedStudentManagement from "./AssignedStudentManagement";
import CollegeListManagement from "./CollegeListManagement";

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: Arial, sans-serif;
`;

const Header = styled.header`
  background-color: #4a90e2;
  color: white;
  padding: 10px 20px; /* Reduced padding */
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const NavBar = styled.div`
  display: flex;
  gap: 10px;

  button {
    padding: 8px 12px; /* Adjusted size */
    background-color: #61dafb;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    color: white;
    transition: background-color 0.3s;

    &:hover {
      background-color: #50aee3;
    }
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  background-color: #f8f9fa;
  padding: 20px;
  overflow-y: auto;
`;

const CounselorDashboard = () => {
  const [activeTab, setActiveTab] = useState("viewStudents");

  return (
    <DashboardContainer>
      <Header>
        <h1>Counselor Dashboard</h1>
        <NavBar>
          <button onClick={() => setActiveTab("assignStudents")}>Assign Students</button>
          <button onClick={() => setActiveTab("viewStudents")}>View Assigned Students</button>
          <button onClick={() => setActiveTab("manageColleges")}>Manage Colleges</button>
        </NavBar>
      </Header>
      <ContentContainer>
        {activeTab === "assignStudents" && <StudentAssignment />}
        {activeTab === "viewStudents" && <AssignedStudentManagement />}
        {activeTab === "manageColleges" && <CollegeListManagement />}
      </ContentContainer>
    </DashboardContainer>
  );
};

export default CounselorDashboard;
