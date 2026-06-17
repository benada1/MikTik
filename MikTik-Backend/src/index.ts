const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Auth routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

app.get('/api/health', (req: any, res: any) => {
  res.json({ status: 'Backend is running!' });
});

app.post('/api/test', (req: any, res: any) => {
  const { message } = req.body;
  res.json({
    success: true,
    receivedMessage: message,
    timestamp: new Date().toISOString()
  });
});

mongoose
  .connect(process.env.MONGODB_URI as string, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err: Error) => {
    console.error('\n❌ MongoDB connection failed:', err.message);
    console.error('👉 Make sure MongoDB is running: https://www.mongodb.com/try/download/community\n');
    process.exit(1);
  });
