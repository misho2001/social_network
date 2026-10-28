const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// TiDB კავშირის კონფიგურაცია
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'gateway01.us-west-2.prod.aws.tidbcloud.com',
  user: process.env.DB_USER || 'your_username',
  password: process.env.DB_PASSWORD || 'your_password',
  database: process.env.DB_NAME || 'test',
  port: process.env.DB_PORT || 4000,
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  }
});

// მარშრუტი, რომელსაც თქვენი script.js მიმართავს (/api/login)
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please fill in both fields.' 
    });
  }

  const query = 'INSERT INTO users (email, password) VALUES (?, ?)';

  pool.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('შეცდომა TiDB ბაზაში ჩაწერისას:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Database error. Please try again later.' 
      });
    }

    // პასუხი, რომელსაც თქვენი script.js ამოწმებს (if (data.success))
    res.status(200).json({ 
      success: true, 
      message: 'Login successful!' 
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`სერვერი წარმატებით გაშვებულია პორტზე: ${PORT}`);
});