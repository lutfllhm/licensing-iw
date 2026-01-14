const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

console.log('🚀 Starting server...');
console.log('📍 Environment:', process.env.NODE_ENV || 'development');
console.log('📍 Port:', process.env.PORT || 5000);

// Auto-initialize database on startup (Railway)
async function initDatabaseIfNeeded() {
  try {
    console.log('🔍 Checking database connection...');
    console.log(`📍 DB Host: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`📍 DB Name: ${process.env.DB_NAME || 'iware_perizinan'}`);
    console.log(`📍 MYSQL_URL: ${process.env.MYSQL_URL ? 'SET' : 'NOT SET'}`);
    
    const db = require('./config/database');
    
    // Test connection first
    await db.query('SELECT 1');
    console.log('✅ Database connection successful');
    
    // Cek apakah tabel users sudah ada
    const [tables] = await db.query("SHOW TABLES LIKE 'users'");
    
    if (tables.length === 0) {
      console.log('🔄 Database belum diinisialisasi, menjalankan init-db.sql...');
      
      const sqlFile = path.join(__dirname, 'config/init-db.sql');
      const sql = fs.readFileSync(sqlFile, 'utf8');
      
      // Split SQL statements dan execute satu per satu
      const statements = sql.split(';').filter(stmt => stmt.trim());
      for (const statement of statements) {
        if (statement.trim()) {
          await db.query(statement);
        }
      }
      
      console.log('✅ Database berhasil diinisialisasi!');
    } else {
      console.log('✅ Database sudah diinisialisasi');
    }
  } catch (error) {
    console.error('❌ Error saat cek/init database:', error.message);
    console.error('💡 Pastikan MySQL service sudah running dan environment variables sudah di-set');
    console.error('💡 Stack:', error.stack);
    // Don't exit, let the app start anyway for debugging
  }
}

// Middleware
// CORS Configuration - Update FRONTEND_URL setelah deploy
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  process.env.FRONTEND_URL // Set di Railway environment variables
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check - harus sebelum routes lain
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server berjalan dengan baik',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// Routes - Rute API
try {
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/pengajuan', require('./routes/pengajuan'));
  console.log('✅ Routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading routes:', error.message);
}

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ 
    status: 'ERROR', 
    message: err.message 
  });
});

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Railway requires binding to 0.0.0.0

// Start server first, then init database
const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 Server berjalan di port ${PORT}`);
  console.log(`📡 API tersedia di http://localhost:${PORT}/api`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Initialize database after server starts
  initDatabaseIfNeeded().catch(err => {
    console.error('❌ Database initialization failed:', err.message);
  });
});

server.on('error', (err) => {
  console.error('❌ Server failed to start:', err.message);
  process.exit(1);
});
