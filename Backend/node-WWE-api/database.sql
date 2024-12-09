CREATE DATABASE WorldWiseEd;

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

CREATE TABLE student_university_preferences (
    preference_id SERIAL PRIMARY KEY, 
    student_id INT REFERENCES students(student_id) ON DELETE CASCADE, 
    university_id INT REFERENCES universities(university_id) ON DELETE CASCADE, 
    preference_rank INT
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
    applied VARCHAR(10) NOT NULL CHECK (applied IN ('Accepted', 'Waitlisted', 'Rejected'))
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

-- Insert default consultants
INSERT INTO users (email, password_hash, role, first_name, last_name)
VALUES 
('counselor1@example.com', '$2y$10$o5ufnS.oW8rhjeKjEoLxs.iaGPFpqwwzqmligr1tOhFDxPJr7D/QK', 'counselor', 'Counselor', 'One'),
('counselor2@example.com', '$2y$10$pn6hZhxxHsvRCxWspXk6xOKDrE62dsKowMGwnErhBf99Ub/F3/Rga', 'counselor', 'Counselor', 'Two'),
('counselor3@example.com', '$2y$10$FY3LeRX8JAuitXrIhmdMHulLyllGpBmfy.w/hIm3suZoURmt4JMf.', 'counselor', 'Counselor', 'Three'); -- password1 , password2, password3

-- Link counselors to the counselors table
INSERT INTO counselors (user_id)
SELECT user_id FROM users WHERE role = 'counselor';
