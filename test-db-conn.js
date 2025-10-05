require('dotenv').config();
const mysql = require('mysql2/promise');

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    console.log('DB connection OK');
    await conn.end();
  } catch (err) {
    console.error('DB connection failed:', err.message);
    process.exit(1);
  }
})();