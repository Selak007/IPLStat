const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 5000;

// Enable CORS for your frontend
app.use(cors());

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',                   // Replace if using external DB on Render
  user: 'root',                        // Your MySQL username
  password: 'Sharpeyecoder373!',      // Your MySQL password
  database: 'ipl',                     // Your MySQL database
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Promisify the pool for async/await
const db = pool.promise();

// Endpoint to search players
app.get('/search', async (req, res) => {
  try {
    const query = req.query.query;
    const [results] = await db.query(
      'SELECT name FROM players WHERE name LIKE ? LIMIT 5',
      [`%${query}%`]
    );
    res.json(results);
  } catch (err) {
    console.error('Error in /search:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint to fetch player stats
app.get('/stats/:batter/:bowler', async (req, res) => {
  try {
    const batter = req.params.batter;
    const bowler = req.params.bowler;
    const [results] = await db.query(
      `SELECT 
        batter, bowler, SUM(balls_faced) AS balls_faced, 
        SUM(runs_scored) AS runs_scored, SUM(fours) AS fours, 
        SUM(sixes) AS sixes, SUM(times_out) AS times_out, 
        AVG(strike_rate) AS strike_rate, AVG(dismissal_rate) AS dismissal_rate
      FROM matchups
      WHERE batter = ? AND bowler = ?
      GROUP BY batter, bowler`,
      [batter, bowler]
    );
    res.json(results[0] || {});
  } catch (err) {
    console.error('Error in /stats:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
