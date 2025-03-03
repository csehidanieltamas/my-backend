const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json()); // Allow JSON requests

// ✅ Connect to MySQL Database
const db = mysql.createConnection({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER, 
    password: process.env.DB_PASS, 
    database: process.env.DB_NAME,
    port: 3306,
    ssl: { rejectUnauthorized: false }
});

db.connect((err) => {
    if (err) {
        console.error('❌ Database connection error:', err.message);
    } else {
        console.log('✅ Connected to MySQL database!');
    }
});

// ✅ POST: Add a Review
app.post('/add-review', (req, res) => {
    const { username, review, rating } = req.body;
    if (!username || !review || !rating) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    const query = 'INSERT INTO reviews (username, review, rating) VALUES (?, ?, ?)';
    db.query(query, [username, review, rating], (err, result) => {
        if (err) {
            console.error('❌ Error inserting review:', err.message);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Review added!', id: result.insertId });
    });
});

// ✅ GET: Fetch All Reviews
app.get('/get-reviews', (req, res) => {
    db.query('SELECT * FROM reviews ORDER BY created_at DESC', (err, results) => {
        if (err) {
            console.error('❌ Error fetching reviews:', err.message);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// ✅ Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
