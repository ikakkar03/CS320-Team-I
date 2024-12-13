CREATE DATABASE worldwiseed;

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) CHECK (role IN ('student', 'counselor')) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50),
    last_name VARCHAR(50) NOT NULL
);

CREATE TABLE students (
    student_id SERIAL PRIMARY KEY, 
    user_id INT UNIQUE REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE counselors (
    counselor_id SERIAL PRIMARY KEY, 
    user_id INT UNIQUE REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE universities (
    university_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(100),
    major_offered VARCHAR(255),
    education_level VARCHAR(100)
);

CREATE TABLE activity_calendar (
    activity_id SERIAL PRIMARY KEY, 
    student_id INT REFERENCES students(student_id) ON DELETE CASCADE, 
    activity_name VARCHAR(255) NOT NULL, 
    deadline DATE, 
    reminder BOOLEAN DEFAULT FALSE
);

CREATE TABLE files (
    file_id SERIAL PRIMARY KEY, 
    student_id INT REFERENCES students(student_id) ON DELETE CASCADE, 
    file_name VARCHAR(255) NOT NULL, 
    file_path TEXT NOT NULL
);

CREATE TABLE application_checklist (
    checklist_id SERIAL PRIMARY KEY, 
    student_id INT REFERENCES students(student_id) ON DELETE CASCADE, 
    task_name VARCHAR(255) NOT NULL, 
    completed BOOLEAN DEFAULT FALSE
);

CREATE TABLE universities_applied_to (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(student_id) ON DELETE CASCADE,
    university_id INT REFERENCES universities(university_id) ON DELETE CASCADE, 
    applied_status VARCHAR(10) NOT NULL CHECK (applied_status IN ('Accepted', 'Waitlisted', 'Rejected'))
);

CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY, 
    student_id INT REFERENCES students(student_id) ON DELETE CASCADE, 
    message TEXT NOT NULL, 
    sent BOOLEAN DEFAULT FALSE, 
    sent_at TIMESTAMP
);

CREATE TABLE counselor_student_assignments (
    assignment_id SERIAL PRIMARY KEY, 
    counselor_id INT REFERENCES counselors(counselor_id) ON DELETE CASCADE, 
    student_id INT REFERENCES students(student_id) ON DELETE CASCADE
);

CREATE TABLE student_saved_universities (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(student_id) ON DELETE CASCADE,
    university_id INT REFERENCES universities(university_id) ON DELETE CASCADE
);

-- Insert defaults
INSERT INTO users (email, password_hash, role, first_name, last_name)
VALUES
('student1@example.com', '$2y$10$9dbszrHXSv5F9eLgjd05XOXeiq3klW5WHmv5cMzmSa2WCDSKolYz.', 'student', 'Student', 'One'),
('student2@example.com', '$2y$10$9dbszrHXSv5F9eLgjd05XOXeiq3klW5WHmv5cMzmSa2WCDSKolYz.', 'student', 'Student', 'Two'),
('student3@example.com', '$2y$10$9dbszrHXSv5F9eLgjd05XOXeiq3klW5WHmv5cMzmSa2WCDSKolYz.', 'student', 'Student', 'Three');

-- Link them to the students table
INSERT INTO students (user_id)
SELECT user_id FROM users WHERE email IN ('student1@example.com', 'student2@example.com', 'student3@example.com');

INSERT INTO users (email, password_hash, role, first_name, last_name)
VALUES 
('counselor1@example.com', '$2y$10$o5ufnS.oW8rhjeKjEoLxs.iaGPFpqwwzqmligr1tOhFDxPJr7D/QK', 'counselor', 'Counselor', 'One'),
('counselor2@example.com', '$2y$10$pn6hZhxxHsvRCxWspXk6xOKDrE62dsKowMGwnErhBf99Ub/F3/Rga', 'counselor', 'Counselor', 'Two'),
('counselor3@example.com', '$2y$10$FY3LeRX8JAuitXrIhmdMHulLyllGpBmfy.w/hIm3suZoURmt4JMf.', 'counselor', 'Counselor', 'Three'); -- password1 , password2, password3

-- Link counselors to the counselors table
INSERT INTO counselors (user_id)
SELECT user_id FROM users WHERE role = 'counselor';

INSERT INTO universities (name, country, major_offered, education_level)
VALUES 
('Harvard University', 'USA', 'Various', 'Undergraduate'),
('Stanford University', 'USA', 'Various', 'Undergraduate'),
('University of Oxford', 'UK', 'Various', 'Undergraduate'),
('University of Cambridge', 'UK', 'Various', 'Undergraduate'),
('Massachusetts Institute of Technology', 'USA', 'Engineering, Science, Technology', 'Undergraduate'),
('University of Toronto', 'Canada', 'Various', 'Undergraduate'),
('Tsinghua University', 'China', 'Engineering, Science, Technology', 'Undergraduate'),
('University of Melbourne', 'Australia', 'Various', 'Undergraduate'),
('ETH Zurich', 'Switzerland', 'Engineering, Science, Technology', 'Undergraduate'),
('University of Tokyo', 'Japan', 'Various', 'Undergraduate');
