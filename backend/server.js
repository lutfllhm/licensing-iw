const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const db = require('./config/database');
require('dotenv').config();

const app = express();

// Auto-initialize database on startup (Railway)
async function initDatabaseIfNeeded() {
  try {
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
    console.error('⚠️ Error saat cek/init database:', error.message);
  }
}

// Jalankan init database
initDatabaseIfNeeded();

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

// Routes - Rute API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/pengajuan', require('./routes/pengajuan'));

// Pemeriksaan kesehatan server
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server berjalan dengan baik' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di port ${PORT}`);
  console.log(`📡 API tersedia di http://localhost:${PORT}/api`);
});
