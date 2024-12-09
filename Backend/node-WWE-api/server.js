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


const bcrypt = require('bcryptjs');

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

// Add a new application to the universities_applied_to table
app.post('/api/universitiesAppliedTo', async (req, res) => {
  const { studentId, universityId, appliedStatus } = req.body;

  // Validate input
  if (!studentId || !universityId || !appliedStatus) {
    return res.status(400).json({ message: 'Missing required field' });
  }

  if (!['Accepted', 'Waitlisted', 'Rejected'].includes(appliedStatus)) {
    return res.status(400).json({ message: 'Invalid application status' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO universities_applied_to (student_id, university_id, applied_status) 
       VALUES ($1, $2, S3)
       RETURNING id, appliedStatus`,
      [studentId, universityId, appliedStatus]
    );

    res.status(201).json({
      message: 'Application status recorded successfully',
      application: result.rows[0],
    });
  } catch (error) {
    console.error('Error adding university applied record:', error);
    res.status(500).json({ message: 'Error adding university applied record', error: error.message });
  }
});

// Fetch all applications or a specific one by ID
app.get('/api/universitiesAppliedTo/:id?', async (req, res) => {
  const { id } = req.params;

  try {
    if (id) {
      // Fetch a specific application by ID
      const result = await pool.query(
        `SELECT * FROM universities_applied_to WHERE id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Application not found' });
      }

      res.status(200).json(result.rows[0]);
    } else {
      // Fetch all applications
      const result = await pool.query(
        `SELECT * FROM universities_applied_to`
      );

      res.status(200).json(result.rows);
    }
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});


// Update an application in the universities_applied_to table
app.put('/api/universitiesAppliedTo/:id', async (req, res) => {
  const { id } = req.params;
  const { applied_status } = req.body;

  // Validate input
  if (!applied_status) {
    return res.status(400).json({ message: 'Missing required field: applied' });
  }

  if (!['Accepted', 'Waitlisted', 'Rejected'].includes(applied)) {
    return res.status(400).json({ message: 'Invalid application status' });
  }

  try {
    const result = await pool.query(
      `UPDATE universities_applied_to 
       SET applied_status = $1 
       WHERE id = $2 
       RETURNING id, applied_status`,
      [applied, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json({
      message: 'Application status updated successfully',
      application: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Delete an application from the universities_applied_to table
app.delete('/api/universitiesAppliedTo/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM universities_applied_to 
       WHERE id = $1 
       RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json({
      message: 'Application deleted successfully',
      deletedApplicationId: result.rows[0].id,
    });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});
