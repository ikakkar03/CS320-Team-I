const bcrypt = require('bcryptjs');

const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./db'); // Import the db connection

const app = express();
const port = 3000;

app.use(bodyParser.json()); // Parse JSON bodies

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.post('/api/createAccount', async (req, res) => {
  const { email, password, role, first_name, middle_name, last_name } = req.body;

  // Validate the input
  if (!email || !password || !role || !first_name || !last_name) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Insert into users table
    const userResult = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, middle_name, last_name, role)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING user_id`,
      [email, password, first_name, middle_name || null, last_name, role]
    );

    const userId = userResult.rows[0].user_id;

    // Insert into students or counselors table based on the role
    if (role === 'student') {
      await pool.query(
        `INSERT INTO students (user_id, first_name, middle_name, last_name)
         VALUES ($1, $2, $3, $4)`,
        [userId, first_name, middle_name || null, last_name]
      );
    } else if (role === 'counselor') {
      await pool.query(
        `INSERT INTO counselors (user_id, first_name, middle_name, last_name)
         VALUES ($1, $2, $3, $4)`,
        [userId, first_name, middle_name || null, last_name]
      );
    } else {
      return res.status(400).json({ message: 'Invalid role. Must be "student" or "counselor".' });
    }

    res.status(201).json({ message: 'User registered successfully', userId });
  } catch (error) {
    console.error('Error during registration:', error);

    // Handle duplicate email error
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Email already registered' });
    }

    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});


app.post('/api/student/signin', async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Fetch user from the database
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND role = $2',
      [email, 'student']
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = userResult.rows[0];

    // Verify the password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Successful login
    res.status(200).json({
      message: 'Student sign-in successful',
      user: {
        user_id: user.user_id,
        email: user.email,
        first_name: user.first_name,
        middle_name: user.middle_name,
        last_name: user.last_name,
      },
    });
  } catch (error) {
    console.error('Error during student sign-in:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

app.post('/api/counselor/signin', async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Fetch user from the database
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND role = $2',
      [email, 'counselor']
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = userResult.rows[0];

    // Verify password (use hashed comparison in production)
    if (user.password_hash !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Successful login
    res.status(200).json({
      message: 'Counselor sign-in successful',
      user: {
        user_id: user.user_id,
        email: user.email,
        first_name: user.first_name,
        middle_name: user.middle_name,
        last_name: user.last_name,
      },
    });
  } catch (error) {
    console.error('Error during counselor sign-in:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

app.get('/api/universities', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM universities');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching universities:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

  // ADD NEW TASK TO THE CHECKLIST
app.post('/api/checklist', async (req, res) => {
  const { student_id, task_name } = req.body;

  if (!student_id || !task_name) {
    return res.status(400).json({ error: 'Student ID and task name are required.' });
  }

  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO application_checklist (student_id, task_name) 
       VALUES ($1, $2) 
       RETURNING *`,
      [student_id, task_name]
    );

    res.status(201).json({
      message: 'Task added successfully',
      task: result.rows[0],
    });
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});
});

app.post('/api/student/add-university', async (req, res) => {
  const { student_id, university_id } = req.body;

  if (!student_id || !university_id) {
    return res.status(400).json({ message: 'Missing student_id or university_id' });
  }

  try {
    console.log('Received student_id:', student_id);

    // Check if student exists
    const studentCheck = await pool.query('SELECT * FROM students WHERE student_id = $1', [student_id]);
    if (studentCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if university exists
    const universityCheck = await pool.query('SELECT * FROM universities WHERE university_id = $1', [university_id]);
    if (universityCheck.rows.length === 0) {
      return res.status(404).json({ message: 'University not found' });
    }

    // Insert into student_saved_universities
    const result = await pool.query(
      `INSERT INTO student_saved_universities (student_id, university_id)
       VALUES ($1, $2)
       RETURNING *`,
      [student_id, university_id]
    );

    // Return the full university details for the inserted record
    const savedUniversity = await pool.query(
      `SELECT u.university_id, u.name, u.country, u.major_offered, u.education_level
       FROM student_saved_universities ssu
       JOIN universities u ON ssu.university_id = u.university_id
       WHERE ssu.id = $1`,
      [result.rows[0].id]
    );

    res.status(201).json({
      message: 'University added to saved list successfully',
      university: savedUniversity.rows[0],
    });
  } catch (error) {
    console.error('Error adding university to saved list:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

app.get('/api/student/:student_id/saved-colleges', async (req, res) => {
  const { student_id } = req.params;
  try {
    const result = await pool.query(
      `SELECT u.university_id, u.name, u.country, u.major_offered, u.education_level
       FROM student_saved_universities ssu
       JOIN universities u ON ssu.university_id = u.university_id
       WHERE ssu.student_id = $1`,
      [student_id]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching saved colleges:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

app.get('/api/student/:student_id/applied-colleges', async (req, res) => {
  const { student_id } = req.params;
  try {
    const result = await pool.query(
      `SELECT u.university_id, u.name, u.country, u.major_offered, u.education_level, ua.applied_status
       FROM universities_applied_to ua
       JOIN universities u ON ua.university_id = u.university_id
       WHERE ua.student_id = $1`,
      [student_id]
    );

    const applied = {
      Accepted: [],
      Waitlisted: [],
      Rejected: [],
    };
    for (const row of result.rows) {
      applied[row.applied_status].push(row);
    }

    res.status(200).json(applied);
  } catch (error) {
    console.error('Error fetching applied colleges:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

app.post('/api/student/apply-college', async (req, res) => {
  const { student_id, university_id, applied_status } = req.body;
  if (!student_id || !university_id || !applied_status) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Remove from saved if it exists there
    await pool.query(
      `DELETE FROM student_saved_universities
       WHERE student_id = $1 AND university_id = $2`,
      [student_id, university_id]
    );

    // Insert into applied table
    const insertResult = await pool.query(
      `INSERT INTO universities_applied_to (student_id, university_id, applied_status)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [student_id, university_id, applied_status]
    );

    res.status(201).json({ message: 'College moved to applied', record: insertResult.rows[0] });
  } catch (error) {
    console.error('Error applying to college:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

app.post('/api/student/unapply-college', async (req, res) => {
  const { student_id, university_id } = req.body;
  if (!student_id || !university_id) {
    return res.status(400).json({ message: 'Missing student_id or university_id' });
  }

  try {
    // Remove from applied
    await pool.query(
      `DELETE FROM universities_applied_to
       WHERE student_id = $1 AND university_id = $2`,
      [student_id, university_id]
    );

    // Add back to saved
    await pool.query(
      `INSERT INTO student_saved_universities (student_id, university_id)
       VALUES ($1, $2)`,
      [student_id, university_id]
    );

    res.status(200).json({ message: 'College moved back to saved' });
  } catch (error) {
    console.error('Error unapplying to college:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

app.get('/api/student-id/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await pool.query(
      'SELECT student_id FROM students WHERE user_id = $1',
      [user_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json({ student_id: result.rows[0].student_id });
  } catch (error) {
    console.error('Error fetching student_id:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

