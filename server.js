const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 5000;  // You can change this if necessary

// Enable CORS for your frontend
app.use(cors());

// Set up MySQL connection (No .env, hardcoded credentials)
const db = mysql.createConnection({
  host: 'localhost',  // Change to your database host (e.g., 'localhost' or your production DB)
  user: 'root',       // Your MySQL username
  password: 'Sharpeyecoder373!',  // Your MySQL password
  database: 'ipl',    // Your MySQL database name
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL!');
});

// Endpoint to search players
app.get('/search', (req, res) => {
  const query = req.query.query;
  const sql = 'SELECT name FROM players WHERE name LIKE ? LIMIT 5';  // Search for players by name
  db.query(sql, [`%${query}%`], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// Endpoint to fetch player stats
app.get('/stats/:batter/:bowler', (req, res) => {
  const batter = req.params.batter;
  const bowler = req.params.bowler;
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
    if (err) throw err;
    res.json(result[0]);  // Assuming only one row is returned
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
