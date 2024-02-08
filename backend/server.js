const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors())

// MySQL Connection
const connection = mysql.createConnection({
  host: 'sql6.freesqldatabase.com',
  user: 'sql6682823',
  password: 'AUNLEWttlx',
  database: 'sql6682823',
  port: 3306
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    process.exit(1); // Exit the process if unable to connect to the database
  }
  console.log('Connected to MySQL database');
});

// JWT Secret Key
const JWT_SECRET = 'mysecretpassword';

// Define Zod schemas for input validation
const signupSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().regex(/^\d{10}$/)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

// Signup API
app.post('/api/signup', (req, res) => {
  const { name, email, password, phone } = signupSchema.parse(req.body);

  // Hash password before saving to the database
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      connection.query('INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)', [name, email, hashedPassword, phone], (error, results) => {
        if (error) {
          console.error('Error saving user to database:', error);
          res.status(500).json({ error: 'Internal server error' });
        } else {
          res.status(201).json({ message: 'User registered successfully' });
        }
      });
    }
  });
});

// Login API
app.post('/api/login', (req, res) => {
  const { email, password } = loginSchema.parse(req.body);

  connection.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
    if (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else if (results.length === 0) {
      res.status(401).json({ error: 'Username not found' });
    } else {
      const user = results[0];
      const validPassword = await bcrypt.compare(password, user.password);

      if (validPassword) {
        // Sign JWT token with user's email and database ID
        const token = jwt.sign({ userEmail: email, userId: user.id }, JWT_SECRET);
        res.status(200).json({ token });
      } else {
        res.status(401).json({ error: 'Auth Error' });
      }
    }
  });
});


// Middleware to verify JWT token
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ error: 'Token not provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Failed to authenticate token' });
    }

    req.userId = decoded.userId; // Store user ID in request object
    next();
  });
}

// Get User Details API
app.get('/api/user', verifyToken, (req, res) => {
  const userId = req.userId; // Extract user ID from JWT token
  console.log('User ID:', userId);

  connection.query('SELECT * FROM users WHERE id = ?', [userId], (error, results) => {
    if (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else if (results.length === 0) {
      console.log('User not found for ID:', userId);
      res.status(404).json({ error: 'User not found' });
    } else {
      const user = results[0];
      delete user.password;
      console.log('User details:', user);
      res.status(200).json(user);
    }
  });
});


// Edit User Details API
app.put('/api/user/', verifyToken, (req, res) => {
  const userId = req.userId; // Extract user ID from JWT token
  console.log('User ID:', userId);
    const { name, phone } = req.body;
  
    connection.query('UPDATE users SET name = ?, phone = ? WHERE id = ?', [name, phone, userId], (error, results) => {
      if (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.status(200).json({ message: 'User details updated successfully' });
      }
    });
  });
  

// Catch-all route for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
