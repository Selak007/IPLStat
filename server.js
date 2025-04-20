const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

// Enable CORS for your frontend
app.use(cors());

// Set up MySQL connection pool (improves efficiency)
const db = mysql.createPool({
  host: 'localhost',           // Change this to the correct host in production
  user: 'root',                // Your MySQL username
  password: 'Sharpeyecoder373!', // Your MySQL password
  database: 'ipl',             // Your MySQL database
  waitForConnections: true,    // Allows queuing of connection requests when all connections are in use
  connectionLimit: 10,         // Maximum number of connections
  queueLimit: 0                // Maximum number of queued connection requests
});

// Test MySQL connection (important for development)
db.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Error connecting to MySQL:', err);
    return;
  }
  console.log('✅ Connected to MySQL!');
  connection.release(); // Release connection back to the pool
});

// Search players
app.get('/search', (req, res) => {
  const query = req.query.query;
  const sql = 'SELECT name FROM players WHERE name LIKE ? LIMIT 5';
  db.query(sql, [`%${query}%`], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'DB error' });
    }
    res.json(result);
  });
});

// Get H2H stats
app.get('/stats/:batter/:bowler', (req, res) => {
  const { batter, bowler } = req.params;
  const sql = `
    SELECT 
      batter, bowler, SUM(balls_faced) AS balls_faced, 
      SUM(runs_scored) AS runs_scored, SUM(fours) AS fours, 
      SUM(sixes) AS sixes, SUM(times_out) AS times_out, 
      AVG(strike_rate) AS strike_rate, AVG(dismissal_rate) AS dismissal_rate
    FROM matchups
    WHERE batter = ? AND bowler = ?
    GROUP BY batter, bowler
  `;
  db.query(sql, [batter, bowler], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'DB error' });
    }
    res.json(result[0] || {});
  });
});

// Use dynamic port (important for Render!)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
