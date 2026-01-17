import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import HANGITUsers from './models/HANGIT';

const app = express();
app.use(express.json());
app.use(cors());

let dbConnected = false;

mongoose.connect('mongodb://127.0.0.1:27017/HANGIT')
  .then(() => {
    console.log('Connected to MongoDB');
    dbConnected = true;
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Fetch form data
app.post('/register', async (req, res) => {
  if (!dbConnected) {
    return res.status(500).json({ error: 'Database not connected' });
  }
  try {
    const user = await HANGITUsers.create(req.body);
    res.json(user);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

app.listen(3002, () => {
  console.log('Server is running on port 3002');
});