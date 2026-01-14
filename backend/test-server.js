// Minimal test server untuk debugging Railway deployment
const express = require('express');
const app = express();

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

// Basic middleware
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Test server running',
    timestamp: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      HAS_MYSQL_URL: !!process.env.MYSQL_URL,
      HAS_DB_HOST: !!process.env.DB_HOST,
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Backend API is running' });
});

// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const db = require('./config/database');
    await db.query('SELECT 1');
    res.json({ status: 'OK', message: 'Database connection successful' });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Database connection failed',
      error: error.message 
    });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    status: 'ERROR', 
    message: err.message 
  });
});

// Start server
app.listen(PORT, HOST, () => {
  console.log(`✅ Test server running on ${HOST}:${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔍 MYSQL_URL: ${process.env.MYSQL_URL ? 'SET' : 'NOT SET'}`);
  console.log(`🔍 DB_HOST: ${process.env.DB_HOST || 'NOT SET'}`);
}).on('error', (err) => {
  console.error('❌ Server failed to start:', err.message);
  process.exit(1);
});
