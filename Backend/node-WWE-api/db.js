const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'worldwiseed',
  password: '1234',
  port: 5432,
});

module.exports = pool;

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Database connected successfully:', res.rows[0]);
  }
});