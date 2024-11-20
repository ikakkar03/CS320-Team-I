const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./db'); // Import the db connection

const app = express();
const port = 3000;

app.use(bodyParser.json()); // Parse JSON bodies

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.post('/api/users', async (req, res) => {
  const { email, password, role, name } = req.body;

  // Validate required fields
  if (!email || !password || !role || !name) {
    return res
      .status(400)
      .json({ error: 'Missing required fields: email, password, role, and name are mandatory' });
  }

  const client = await pool.connect();
  try {
    // Begin a transaction
    await client.query('BEGIN');

    // Insert into the `users` table
    const userResult = await client.query(
      `INSERT INTO users (email, password_hash, role, name) 
       VALUES ($1, $2, $3, $4) 
       RETURNING user_id`,
      [email, password, role, name]
    );
    const userId = userResult.rows[0].user_id;

    // Commit the transaction
    await client.query('COMMIT');

    res.status(201).json({
      message: 'User created successfully',
      user: { user_id: userId, email, role, name },
    });
  } catch (error) {
    // Rollback in case of an error
    await client.query('ROLLBACK');
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

