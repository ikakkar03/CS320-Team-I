import React, { useState } from 'react';
import './Dashboard.css';

const Dashboard = () => {
    const [checklist, setChecklist] = useState([]);
    const [college, setCollege] = useState('');
    const [savedColleges, setSavedColleges] = useState([]);

    // Function to add items to the checklist
    const addChecklistItem = (item) => {
        setChecklist([...checklist, item]);
    };

    // Function to remove items from the checklist
    const removeChecklistItem = (index) => {
        setChecklist(checklist.filter((_, i) => i !== index));
    };

    // Function to add a college to the saved college list
    const addCollege = () => {
        if (college.trim()) {
            setSavedColleges([...savedColleges, college]);
            setCollege('');  // Clear the input field after adding
        }
    };

    return (
        <div className="dashboard-container">
            <div className="panel checklist-panel">
                <h3>Checklist</h3>
                <input
                    type="text"
                    placeholder="Add an item..."
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            addChecklistItem(e.target.value);
                            e.target.value = ''; // Clear input after adding
                        }
                    }}
                />
                <ul>
                    {checklist.map((item, index) => (
                        <li key={index}>
                            {item} 
                            <button onClick={() => removeChecklistItem(index)}>Remove</button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="panel saved-colleges-panel">
                <h3>Saved Colleges</h3>
                <input
                    type="text"
                    placeholder="Enter college name"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                />
                <button onClick={addCollege}>Add College</button>
                <ul>
                    {savedColleges.map((name, index) => (
                        <li key={index}>{name}</li>
                    ))}
                </ul>
            </div>
            <div className="panel third-panel">
                <h3>Panel 3</h3>
                <p>Content for the third panel.</p>
            </div>
        </div>
    );
};

export default Dashboard;
