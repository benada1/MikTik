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
app.use('/uploads', require('express').static(require('path').join(process.cwd(), 'uploads')));

// Auth routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Ticket routes
const ticketRoutes = require('./routes/tickets');
app.use('/api/tickets', ticketRoutes);

// Purchase routes
const purchaseRoutes = require('./routes/purchases');
app.use('/api/purchases', purchaseRoutes);

// Seller application routes
const sellerApplicationRoutes = require('./routes/sellerApplications');
app.use('/api/seller-applications', sellerApplicationRoutes);

// Report / dispute routes
const reportRoutes = require('./routes/reports');
app.use('/api/reports', reportRoutes);

// Ensure Seller collection is created on startup
require('./models/Seller');

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
  .then(async () => {
    console.log('Connected to MongoDB');

    const User = require('./models/User');

    // Remove legacy string role field from all users and ensure permissionLevel exists
    await User.updateMany(
      { role: { $exists: true } },
      { $unset: { role: '' } }
    );
    await User.updateMany(
      { permissionLevel: { $exists: false } },
      { $set: { permissionLevel: 1 } }
    );

    // Ensure the designated admin is always level 3
    await User.updateOne(
      { email: 'benadziashvili@gmail.com' },
      { $set: { permissionLevel: 3 } }
    );

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err: Error) => {
    console.error('\n❌ MongoDB connection failed:', err.message);
    console.error('👉 Make sure MongoDB is running: https://www.mongodb.com/try/download/community\n');
    process.exit(1);
  });
