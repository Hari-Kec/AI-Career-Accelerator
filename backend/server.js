import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import groqRouter from './routes/groq.js';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/groq', groqRouter);
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

// User Model
const User = mongoose.model('User', new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}));

// Register Route
app.post('/api/auth/register', async (req, res) => {
  const { name, phone, email, password } = req.body;

  const user = await User.findOne({ email });
  if (user) return res.status(400).send('User already exists');

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, phone, email, password: hashedPassword});

  await newUser.save();

  const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET);
  res.send({ user: {  name: newUser.name, email: newUser.email, phone: newUser.phone }, token });
});

// Login Route
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).send('User not found');

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).send('Invalid password');

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  res.send({ user: { email: user.email }, token });
});

// Middleware to protect routes
const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send('Access denied');
  }

  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(400).send('Invalid token');
  }
};

// Protected Route
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).send('User not found');
  res.send({ user: { name: user.name, email: user.email, phone: user.phone } });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
