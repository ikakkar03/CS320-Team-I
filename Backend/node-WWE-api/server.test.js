const request = require('supertest');
const express = require('express');
const app = require('./server'); // Adjust this path if needed
const pool = require('./db'); // Mock the database connection
const bcrypt = require('bcryptjs');

jest.mock('./db'); // Mock the database pool to simulate database queries

describe('Server Endpoints', () => {

  it('should handle missing email gracefully', async () => {
    const response = await request(app)
      .post('/api/createAccount')
      .send({
        password: '',
        first_name: '',
        last_name: '',
      });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message', 'Missing required fields');
  });
  
  it('should handle missing password gracefully', async () => {
    const response = await request(app)
      .post('/api/createAccount')
      .send({
        email: '',
        first_name: '',
        last_name: '',
      });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message', 'Missing required fields');
  });

  it('should handle missing first_name gracefully', async () => {
    const response = await request(app)
      .post('/api/createAccount')
      .send({
        email: '',
        password: '',
        last_name: '',
      });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message', 'Missing required fields');
  });

  it('should handle missing last_name gracefully', async () => {
    const response = await request(app)
      .post('/api/createAccount')
      .send({
        email: '',
        password: '',
        first_name: '',
      });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message', 'Missing required fields');
  });
});

describe('POST /api/student/signin', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('should return 400 if email is missing', async () => {
    const response = await request(app).post('/api/student/signin').send({
      email: 'test@student.com', // Sending only email, no password
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message', 'Missing required fields');
  });

  it('should return 400 if password is missing', async () => {
    const response = await request(app).post('/api/student/signin').send({
      password: '123', // Sending only email, no password
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message', 'Missing required fields');
  });

  it('should return 401 if user is not found', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] }); // Simulate no matching user in DB

    const response = await request(app).post('/api/student/signin').send({
      email: 'nonexistent@student.com',
      password: 'password123',
    });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('message', 'Invalid email or password');
  });

  it('should return 401 if password is incorrect', async () => {
    const mockUser = {
      user_id: 1,
      email: 'test@student.com',
      password_hash: 'hashedpassword123',
      first_name: 'Test',
      last_name: 'Student',
      student_id: 101,
    };

    pool.query.mockResolvedValueOnce({ rows: [mockUser] }); // Simulate user exists
    bcrypt.compare = jest.fn().mockResolvedValue(false); // Simulate password mismatch

    const response = await request(app).post('/api/student/signin').send({
      email: 'test@student.com',
      password: 'wrongpassword',
    });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('message', 'Invalid email or password');
  });

  it('should return 200 and student data if sign-in is successful', async () => {
    const mockUser = {
      user_id: 1,
      email: 'test@student.com',
      password_hash: 'hashedpassword123',
      first_name: 'Test',
      last_name: 'Student',
      student_id: 101,
    };

    pool.query.mockResolvedValueOnce({ rows: [mockUser] }); // Simulate user exists
    bcrypt.compare = jest.fn().mockResolvedValue(true); // Simulate password match

    const response = await request(app).post('/api/student/signin').send({
      email: 'test@student.com',
      password: 'password123',
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Student sign-in successful');
    expect(response.body.user).toEqual({
      user_id: mockUser.user_id,
      email: mockUser.email,
      first_name: mockUser.first_name,
      last_name: mockUser.last_name,
      student_id: mockUser.student_id,
    });
  });

  it('should return 500 if there is a server error', async () => {
    pool.query.mockRejectedValueOnce(new Error('Database error')); // Simulate DB error

    const response = await request(app).post('/api/student/signin').send({
      email: 'test@student.com',
      password: 'password123',
    });

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('message', 'Internal Server Error');
    expect(response.body).toHaveProperty('error', 'Database error');
  });
});

describe('POST /api/counselor/signin', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('should return 400 if email is missing', async () => {
    const response = await request(app).post('/api/counselor/signin').send({
      password: '', // Only password, no email
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message', 'Missing required fields');
  });

  it('should return 400 if password is missing', async () => {
    const response = await request(app).post('/api/counselor/signin').send({
      email: 'test@counselor.com', // Only email, no password
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message', 'Missing required fields');
  });

  it('should return 401 if counselor is not found', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] }); // Simulate no matching user in DB

    const response = await request(app).post('/api/counselor/signin').send({
      email: 'nonexistent@counselor.com',
      password: 'password123',
    });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('message', 'Invalid email or password');
  });

  it('should return 401 if password is incorrect', async () => {
    const mockUser = {
      user_id: 1,
      email: 'test@counselor.com',
      password_hash: 'hashedpassword123',
      first_name: 'Test',
      middle_name: 'A',
      last_name: 'Counselor',
    };

    pool.query.mockResolvedValueOnce({ rows: [mockUser] }); // Simulate user exists
    bcrypt.compare = jest.fn().mockResolvedValue(false); // Simulate password mismatch

    const response = await request(app).post('/api/counselor/signin').send({
      email: 'test@counselor.com',
      password: 'wrongpassword',
    });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('message', 'Invalid email or password');
  });

  it('should return 200 and counselor data if sign-in is successful', async () => {
    const mockUser = {
      user_id: 1,
      email: 'test@counselor.com',
      password_hash: 'hashedpassword123',
      first_name: 'Test',
      middle_name: 'A',
      last_name: 'Counselor',
    };

    pool.query.mockResolvedValueOnce({ rows: [mockUser] }); // Simulate user exists
    bcrypt.compare = jest.fn().mockResolvedValue(true); // Simulate password match

    const response = await request(app).post('/api/counselor/signin').send({
      email: 'test@counselor.com',
      password: 'password123',
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Counselor sign-in successful');
    expect(response.body.user).toEqual({
      user_id: mockUser.user_id,
      email: mockUser.email,
      first_name: mockUser.first_name,
      middle_name: mockUser.middle_name,
      last_name: mockUser.last_name,
    });
  });

  it('should return 500 if there is a server error', async () => {
    pool.query.mockRejectedValueOnce(new Error('Database error')); // Simulate DB error

    const response = await request(app).post('/api/counselor/signin').send({
      email: 'test@counselor.com',
      password: 'password123',
    });

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('message', 'Internal Server Error');
    expect(response.body).toHaveProperty('error', 'Database error');
  });
});

describe('GET /api/universities', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('should return 200 and an array of universities when data is fetched successfully', async () => {
    const mockUniversities = [
      { university_id: 1, name: 'University A', location: 'City A' },
      { university_id: 2, name: 'University B', location: 'City B' },
    ];

    pool.query.mockResolvedValueOnce({ rows: mockUniversities }); // Mock successful query

    const response = await request(app).get('/api/universities');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockUniversities);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should return 200 and an empty array when no universities are found', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] }); // Mock no results

    const response = await request(app).get('/api/universities');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should return 500 if there is a server error', async () => {
    pool.query.mockRejectedValueOnce(new Error('Database error')); // Mock query failure

    const response = await request(app).get('/api/universities');

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('message', 'Internal Server Error');
    expect(response.body).toHaveProperty('error', 'Database error');
  });
});

describe('POST /api/checklist', () => {
  let mockClient;

  beforeEach(() => {
    mockClient = {
      query: jest.fn(),
      release: jest.fn(),
    };
    pool.connect = jest.fn().mockResolvedValue(mockClient); // Mock database connection
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('should return 201 and the created task when data is valid', async () => {
    const mockTask = {
      student_id: 1,
      task_name: 'Submit transcript',
    };

    mockClient.query.mockResolvedValueOnce({
      rows: [mockTask],
    }); // Simulate successful database query

    const response = await request(app)
      .post('/api/checklist')
      .send({ student_id: 1, task_name: 'Submit transcript' });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('message', 'Task added successfully');
    expect(response.body).toHaveProperty('task');
    expect(response.body.task).toEqual(mockTask);
    expect(mockClient.query).toHaveBeenCalledWith(
      `INSERT INTO application_checklist (student_id, task_name) 
       VALUES ($1, $2) 
       RETURNING *`,
      [1, 'Submit transcript']
    );
    expect(mockClient.release).toHaveBeenCalled();
  });

  it('should return 400 if student_id or task_name is missing', async () => {
    const response = await request(app)
      .post('/api/checklist')
      .send({ task_name: 'Submit transcript' }); // Missing student_id

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error', 'Student ID and task name are required.');
    expect(mockClient.query).not.toHaveBeenCalled();
  });

  it('should return 500 if there is a database error', async () => {
    mockClient.query.mockRejectedValueOnce(new Error('Database error')); // Simulate database error

    const response = await request(app)
      .post('/api/checklist')
      .send({ student_id: 1, task_name: 'Submit transcript' });

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('error', 'Internal server error');
    expect(mockClient.release).toHaveBeenCalled();
  });

  it('should release the client even when an error occurs', async () => {
    mockClient.query.mockRejectedValueOnce(new Error('Database error')); // Simulate database error

    await request(app)
      .post('/api/checklist')
      .send({ student_id: 1, task_name: 'Submit transcript' });

    expect(mockClient.release).toHaveBeenCalled(); // Ensure client is released
  });
});

describe('DELETE /api/checklist/:task_id', () => {
    let mockClient;
  
    beforeEach(() => {
      mockClient = {
        query: jest.fn(),
        release: jest.fn(),
      };
      pool.connect = jest.fn().mockResolvedValue(mockClient); // Simulate database connection
    });
  
    afterEach(() => {
      jest.clearAllMocks(); // Clear mocks after each test
    });
  
    it('should return 400 if task_id is not provided', async () => {
      const response = await request(app).delete('/api/checklist/'); // Invalid route due to missing param
  
      expect(response.statusCode).toBe(404); // Supertest interprets this as a route not found
      expect(mockClient.query).not.toHaveBeenCalled();
    });
  
    it('should release the database client even when an error occurs', async () => {
      mockClient.query.mockRejectedValueOnce(new Error('Database error')); // Simulate database error
  
      await request(app).delete('/api/checklist/1');
  
      expect(mockClient.release).toHaveBeenCalled(); // Ensure release is always called
    });
  });

describe('GET /api/student/:student_id/saved-colleges', () => {
  afterEach(() => {
    jest.resetAllMocks(); // Reset all mocks after each test
  });

  it('should return 200 with saved colleges if student has saved colleges', async () => {
    const student_id = 123;
    
    // Mock the database query to return a list of saved universities
    const savedColleges = [
      { university_id: 1, name: 'University A', country: 'USA', major_offered: 'CS', education_level: 'Undergraduate' },
      { university_id: 2, name: 'University B', country: 'Canada', major_offered: 'Engineering', education_level: 'Graduate' },
    ];
    pool.query.mockResolvedValueOnce({ rows: savedColleges });

    const response = await request(app).get(`/api/student/${student_id}/saved-colleges`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(savedColleges);
  });

  it('should return 200 with an empty array if the student has no saved colleges', async () => {
    const student_id = 123;

    // Mock the database query to return an empty array (no saved universities)
    pool.query.mockResolvedValueOnce({ rows: [] });

    const response = await request(app).get(`/api/student/${student_id}/saved-colleges`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should return 500 if there is a database error', async () => {
    const student_id = 123;

    // Mock a database error
    pool.query.mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app).get(`/api/student/${student_id}/saved-colleges`);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Internal Server Error');
  });
});

describe('DELETE /api/student/:student_id/remove-university/:university_id', () => {
  afterEach(() => {
    jest.resetAllMocks(); // Reset mock after each test
  });

  it('should successfully remove a university from the student\'s saved list', async () => {
    const student_id = "1";
    const university_id = "101";
    const mockDeleteResponse = { rows: [{ student_id, university_id }] }; // Simulate a successful query response

    pool.query.mockResolvedValue(mockDeleteResponse);

    const response = await request(app)
      .delete(`/api/student/${student_id}/remove-university/${university_id}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('University removed successfully');
    expect(pool.query).toHaveBeenCalledWith(
      'DELETE FROM student_saved_universities WHERE student_id = $1 AND university_id = $2 RETURNING *',
      [student_id, university_id]
    );
  });

  it('should return 404 if the university is not found in the saved list', async () => {
    const student_id = 1;
    const university_id = 101;
    const mockDeleteResponse = { rows: [] }; // Simulate a response with no rows deleted

    pool.query.mockResolvedValue(mockDeleteResponse);

    const response = await request(app)
      .delete(`/api/student/${student_id}/remove-university/${university_id}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('University not found in saved list');
  });

  it('should return 500 if there is a database error', async () => {
    const student_id = 1;
    const university_id = 101;
    const mockError = new Error('Database error'); // Simulate a database error

    pool.query.mockRejectedValue(mockError);

    const response = await request(app)
      .delete(`/api/student/${student_id}/remove-university/${university_id}`);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Internal Server Error');
    expect(response.body.error).toBe(mockError.message);
  });
});

describe('GET /api/student/:student_id/applied-colleges', () => {
  afterEach(() => {
    jest.resetAllMocks(); // Reset mock after each test
  });

  it('should return the applied colleges grouped by applied status', async () => {
    const student_id = "1";
    const mockResult = {
      rows: [
        { university_id: 101, name: 'University A', country: 'Country A', major_offered: 'CS', education_level: 'Undergraduate', applied_status: 'Accepted' },
        { university_id: 102, name: 'University B', country: 'Country B', major_offered: 'Math', education_level: 'Graduate', applied_status: 'Waitlisted' },
        { university_id: 103, name: 'University C', country: 'Country C', major_offered: 'Biology', education_level: 'Undergraduate', applied_status: 'Rejected' },
      ]
    };

    pool.query.mockResolvedValue(mockResult);

    const response = await request(app)
      .get(`/api/student/${student_id}/applied-colleges`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      Accepted: [
        { university_id: 101, name: 'University A', country: 'Country A', major_offered: 'CS', education_level: 'Undergraduate', applied_status: 'Accepted' }
      ],
      Waitlisted: [
        { university_id: 102, name: 'University B', country: 'Country B', major_offered: 'Math', education_level: 'Graduate', applied_status: 'Waitlisted' }
      ],
      Rejected: [
        { university_id: 103, name: 'University C', country: 'Country C', major_offered: 'Biology', education_level: 'Undergraduate', applied_status: 'Rejected' }
      ]
    });
    expect(pool.query).toHaveBeenCalledWith(
      'SELECT u.university_id, u.name, u.country, u.major_offered, u.education_level, ua.applied_status ' +
      'FROM universities_applied_to ua ' +
      'JOIN universities u ON ua.university_id = u.university_id ' +
      'WHERE ua.student_id = $1',
      [student_id]
    );
  });

  it('should return an empty object when no colleges are found for the student', async () => {
    const student_id = 1;
    const mockResult = { rows: [] }; // No rows found

    pool.query.mockResolvedValue(mockResult);

    const response = await request(app)
      .get(`/api/student/${student_id}/applied-colleges`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      Accepted: [],
      Waitlisted: [],
      Rejected: []
    });
  });

  it('should return 500 if there is a database error', async () => {
    const student_id = 1;
    const mockError = new Error('Database error'); // Simulate a database error

    pool.query.mockRejectedValue(mockError);

    const response = await request(app)
      .get(`/api/student/${student_id}/applied-colleges`);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Internal Server Error');
    expect(response.body.error).toBe(mockError.message);
  });
});

describe('POST /api/student/apply-college', () => {
  afterEach(() => {
    jest.resetAllMocks(); // Reset all mocks after each test
  });

  it('should successfully move college to applied status', async () => {
    const student_id = 1;
    const university_id = 101;
    const applied_status = 'Accepted';

    // Mock the DELETE query to remove the college from saved list
    pool.query.mockResolvedValueOnce({ rows: [] }); // Simulate successful removal

    // Mock the INSERT query to add the college to applied list
    const mockInsertResult = {
      rows: [{
        student_id,
        university_id,
        applied_status
      }]
    };
    pool.query.mockResolvedValueOnce(mockInsertResult); // Simulate successful insertion

    const response = await request(app)
      .post('/api/student/apply-college')
      .send({ student_id, university_id, applied_status });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('College moved to applied');
    expect(response.body.record).toEqual(mockInsertResult.rows[0]);
  });

  it('should return 500 if there is a database error during the DELETE operation', async () => {
    const student_id = 1;
    const university_id = 101;
    const applied_status = 'Accepted';

    // Mock a database error for the DELETE query
    pool.query.mockRejectedValueOnce(new Error('Database error during DELETE'));

    const response = await request(app)
      .post('/api/student/apply-college')
      .send({ student_id, university_id, applied_status });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Internal Server Error');
    expect(response.body.error).toBe('Database error during DELETE');
  });

  it('should return 500 if there is a database error during the INSERT operation', async () => {
    const student_id = 1;
    const university_id = 101;
    const applied_status = 'Accepted';

    // Mock the DELETE query to succeed
    pool.query.mockResolvedValueOnce({ rows: [] });

    // Mock a database error for the INSERT query
    pool.query.mockRejectedValueOnce(new Error('Database error during INSERT'));

    const response = await request(app)
      .post('/api/student/apply-college')
      .send({ student_id, university_id, applied_status });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Internal Server Error');
    expect(response.body.error).toBe('Database error during INSERT');
  });
});

describe('POST /api/student/unapply-college', () => {
  afterEach(() => {
    jest.resetAllMocks(); // Reset all mocks after each test
  });

  it('should successfully move college back to saved list', async () => {
    const student_id = 1;
    const university_id = 101;

    // Mock the DELETE query to remove the college from the applied list
    pool.query.mockResolvedValueOnce({ rows: [] }); // Simulate successful removal from applied list

    // Mock the INSERT query to add the college back to the saved list
    pool.query.mockResolvedValueOnce({ rows: [] }); // Simulate successful insertion into saved list

    const response = await request(app)
      .post('/api/student/unapply-college')
      .send({ student_id, university_id });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('College moved back to saved');
  });

  it('should return 500 if there is a database error during the DELETE operation', async () => {
    const student_id = 1;
    const university_id = 101;

    // Mock a database error for the DELETE query
    pool.query.mockRejectedValueOnce(new Error('Database error during DELETE'));

    const response = await request(app)
      .post('/api/student/unapply-college')
      .send({ student_id, university_id });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Internal Server Error');
    expect(response.body.error).toBe('Database error during DELETE');
  });

  it('should return 500 if there is a database error during the INSERT operation', async () => {
    const student_id = 1;
    const university_id = 101;

    // Mock the DELETE query to succeed
    pool.query.mockResolvedValueOnce({ rows: [] });

    // Mock a database error for the INSERT query
    pool.query.mockRejectedValueOnce(new Error('Database error during INSERT'));

    const response = await request(app)
      .post('/api/student/unapply-college')
      .send({ student_id, university_id });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Internal Server Error');
    expect(response.body.error).toBe('Database error during INSERT');
  });
});

describe('GET /api/student-id/:user_id', () => {
  afterEach(() => {
    jest.resetAllMocks(); // Reset all mocks after each test
  });

  it('should return student_id for the given user_id', async () => {
    const user_id = "123"; // Example user_id

    // Mock a successful query response with a student_id
    pool.query.mockResolvedValueOnce({
      rows: [{ student_id: 456 }] // Simulate a result with student_id
    });

    const response = await request(app).get(`/api/student-id/${user_id}`);

    expect(response.status).toBe(200);
    expect(response.body.student_id).toBe(456); // Expect the student_id to match
    expect(pool.query).toHaveBeenCalledWith(
      'SELECT student_id FROM students WHERE user_id = $1',
      [user_id]
    );
  });

  it('should return 404 if the user_id is not found', async () => {
    const user_id = "123"; // Example user_id

    // Mock a response with no matching student_id
    pool.query.mockResolvedValueOnce({ rows: [] }); // Simulate no result

    const response = await request(app).get(`/api/student-id/${user_id}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Student not found');
    expect(pool.query).toHaveBeenCalledWith(
      'SELECT student_id FROM students WHERE user_id = $1',
      [user_id]
    );
  });

  it('should return 500 if there is a database error', async () => {
    const user_id = 123; // Example user_id

    // Mock a database error
    pool.query.mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app).get(`/api/student-id/${user_id}`);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Internal Server Error');
  });
});
