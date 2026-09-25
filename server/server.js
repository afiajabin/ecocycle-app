const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { co2 } = require('@tgwf/co2');

// Load environment variables reliably from server/.env
dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = require('./config/db');

// Connect to MongoDB Atlas Database
connectDB();

const app = express();

// Initialize CO2.js for backend carbon measurement
const co2Emission = new co2();

// Store cumulative backend data transfer for the current server run
let totalBackendBytes = 0;
let totalBackendCO2 = 0;

// Middlewares
app.use(cors());

// Allow the browser to measure response transfer sizes
// for the frontend carbon-footprint calculation.
app.use((req, res, next) => {
  res.setHeader('Timing-Allow-Origin', '*');
  next();
});

// Backend carbon-footprint measurement middleware
app.use((req, res, next) => {
  let responseBytes = 0;

  // Count response data when Content-Length is not available.
  const originalWrite = res.write;
  const originalEnd = res.end;

  res.write = function (chunk, ...args) {
    if (chunk) {
      responseBytes += Buffer.byteLength(chunk);
    }

    return originalWrite.call(this, chunk, ...args);
  };

  res.end = function (chunk, ...args) {
    if (chunk) {
      responseBytes += Buffer.byteLength(chunk);
    }

    return originalEnd.call(this, chunk, ...args);
  };

  res.on('finish', () => {
    // Express normally provides Content-Length for JSON responses.
    const contentLength = res.getHeader('Content-Length');

    if (contentLength !== undefined) {
      responseBytes = Number(contentLength);
    }

    if (!Number.isFinite(responseBytes) || responseBytes < 0) {
      responseBytes = 0;
    }

    const estimatedCO2 = co2Emission.perByte(responseBytes, false);

    totalBackendBytes += responseBytes;
    totalBackendCO2 += estimatedCO2;

    console.log(
      `[Backend Carbon] ${req.method} ${req.originalUrl} | ` +
      `${responseBytes} bytes | ` +
      `${estimatedCO2.toFixed(4)} g CO2`
    );

    console.log(
      `[Backend Carbon Total] ${totalBackendBytes} bytes | ` +
      `${totalBackendCO2.toFixed(4)} g CO2`
    );
  });

  next();
});

app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/collector', require('./routes/collectorRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/facilities', require('./routes/facilityRoutes'));

// Root Health Check Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '≡ƒî▒ EcoCycle Unified Backend API is running successfully!',
    endpoints: {
      auth: '/api/auth (Login/Register/Logout for Citizen, Collector, Admin)',
      citizenRequests: '/api/requests (Submit and track pickup requests)',
      collectorOperations: '/api/collector (District pickup queue, scale weighing, facility deliveries, stats)',
      adminOperations: '/api/admin (System stats, users, collectors, requests, facilities)',
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
  console.log(
    `≡ƒÜÇ EcoCycle Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`
  );

  console.log(
    '[Backend Carbon] Measurement started. ' +
    'Cumulative values will be tracked from this server run.'
  );
});
