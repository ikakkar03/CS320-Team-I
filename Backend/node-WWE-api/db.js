const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'WorldWiseEd',
  password: '1234',
  port: 5433,
});

module.exports = pool;