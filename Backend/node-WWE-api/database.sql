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