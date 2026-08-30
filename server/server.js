const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB Atlas Database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/collector', require('./routes/collectorRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/facilities', require('./routes/facilityRoutes'));

// Root Health Check Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🌱 EcoCycle Unified Backend API is running successfully!',
    endpoints: {
      auth: '/api/auth (Login/Register for Citizen, Collector, Admin)',
      citizenRequests: '/api/requests (Submit and track pickup requests)',
      collectorOperations: '/api/collector (District pickup queue, scale weighing, facility deliveries, stats)',
      recyclingFacilities: '/api/facilities (Recycling centers)',
    },
  });
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route '${req.originalUrl}' Not Found`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 EcoCycle Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
});
