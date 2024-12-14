const bcrypt = require('bcryptjs');

const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./db'); // Import the db connection
const cors = require('cors'); // Import the CORS middleware

const app = express();

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
module.exports = app;

const port = 3000;

app.use(bodyParser.json()); // Parse JSON bodies

// Configure CORS
app.use(cors({ origin: 'http://localhost:3001' }));

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

app.post('/api/createAccount', async (req, res) => {
  const { email, password, first_name, middle_name, last_name } = req.body;

  // Validate the input
  if (!email || !password || !first_name || !last_name) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10); // Generate a salt
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

    // Automatically set the role to 'student'
    const role = 'student';

    // Insert into users table
    const userResult = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, middle_name, last_name, role)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING user_id`,
      [email, hashedPassword, first_name, middle_name || null, last_name, role]
    );

    const userId = userResult.rows[0].user_id;

    // Insert into students table
    await pool.query(
      `INSERT INTO students (user_id) VALUES ($1)`,
      [userId]
    );

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

  if (!email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const userResult = await pool.query(
      `SELECT u.*, s.student_id 
       FROM users u 
       JOIN students s ON u.user_id = s.user_id 
       WHERE u.email = $1 AND u.role = $2`,
      [email, 'student']
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = userResult.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({
      message: 'Student sign-in successful',
      user: {
        user_id: user.user_id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        student_id: user.student_id, // Include student_id
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

    // Verify the password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
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

// Fetch all universities
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


// Delete a task from the checklist
app.delete('/api/checklist/:task_id', async (req, res) => {
  const { task_id } = req.params;

  // Validate input
  if (!task_id) {
    return res.status(400).json({ error: 'Task ID is required.' });
  }

  const client = await pool.connect();
  try {
    const result = await client.query(
      `DELETE FROM application_checklist 
       WHERE task_id = $1 
       RETURNING *`,
      [task_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    res.status(200).json({
      message: 'Task deleted successfully',
      deletedTask: result.rows[0],
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

app.post('/api/student/add-university', async (req, res) => {
  const { student_id, university_id } = req.body;

  if (!student_id || !university_id) {
    return res.status(400).json({ message: 'Missing student_id or university_id' });
  }

  try {
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

    // Check for duplicates
    const duplicateCheck = await pool.query(
      'SELECT * FROM student_saved_universities WHERE student_id = $1 AND university_id = $2',
      [student_id, university_id]
    );
    if (duplicateCheck.rows.length > 0) {
      return res.status(409).json({ message: 'University already saved' });
    }

    // Insert into student_saved_universities
    const result = await pool.query(
      `INSERT INTO student_saved_universities (student_id, university_id)
       VALUES ($1, $2)
       RETURNING *`,
      [student_id, university_id]
    );

    // Return the full university details
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

app.delete('/api/student/:student_id/remove-university/:university_id', async (req, res) => {
  const { student_id, university_id } = req.params;

  try {
    const deleteRes = await pool.query(
      `DELETE FROM student_saved_universities WHERE student_id = $1 AND university_id = $2 RETURNING *`,
      [student_id, university_id]
    );

    if (deleteRes.rows.length === 0) {
      return res.status(404).json({ message: 'University not found in saved list' });
    }

    res.status(200).json({ message: 'University removed successfully' });
  } catch (error) {
    console.error('Error removing university from saved list:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});


app.get('/api/student/:student_id/applied-colleges', async (req, res) => {
  const { student_id } = req.params;
  try {
    const result = await pool.query(
      `SELECT u.university_id, u.name, u.country, u.major_offered, u.education_level, ua.applied_status FROM universities_applied_to ua JOIN universities u ON ua.university_id = u.university_id WHERE ua.student_id = $1`,
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

// Move from saved to applied:
app.post('/api/student/apply-college', async (req, res) => {
  const { student_id, university_id, applied_status } = req.body;
  try {
    // Remove from saved
    await pool.query(
      `DELETE FROM student_saved_universities 
       WHERE student_id = $1 AND university_id = $2 `,
      [student_id, university_id]
    );

    // Insert into applied
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

// Move from applied back to saved:
app.post('/api/student/unapply-college', async (req, res) => {
  const { student_id, university_id } = req.body;
  try {
    // Remove from applied
    await pool.query(
      `DELETE FROM universities_applied_to
       WHERE student_id = $1 AND university_id = $2`,
      [student_id, university_id]
    );

    // Insert into saved
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
