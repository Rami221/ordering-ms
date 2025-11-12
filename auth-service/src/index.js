const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB setup
mongoose.connect('mongodb://auth-mongo:27017/authdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// User schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});
const User = mongoose.model('User', userSchema);

// Serve frontend pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'login.html')));
app.get('/orders.html', (req, res) => res.sendFile(path.join(__dirname, 'orders.html')));

// Signup endpoint
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const existingUser = await User.findOne({ username });
  if (existingUser) return res.status(400).json({ error: 'User already exists' });
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();
  res.json({ message: 'User created successfully' });
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: 'Invalid username or password' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: 'Invalid username or password' });
  const token = jwt.sign({ id: user._id, username: user.username }, 'secretkey', { expiresIn: '1h' });
  res.json({ token });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Auth service running on port ${PORT}`));
