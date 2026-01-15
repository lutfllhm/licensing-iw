# 🔧 Troubleshooting Guide - Railway Deployment

## 📋 Daftar Masalah Umum

1. [Database Connection Failed](#1-database-connection-failed)
2. [CORS Error](#2-cors-error)
3. [Build Failed](#3-build-failed)
4. [Service Crash / Restart Loop](#4-service-crash--restart-loop)
5. [404 Not Found](#5-404-not-found)
6. [500 Internal Server Error](#6-500-internal-server-error)
7. [Frontend Tidak Bisa Hit Backend](#7-frontend-tidak-bisa-hit-backend)
8. [Database Tidak Terinisialisasi](#8-database-tidak-terinisialisasi)
9. [Environment Variables Tidak Ter-apply](#9-environment-variables-tidak-ter-apply)
10. [Upload File Tidak Berfungsi](#10-upload-file-tidak-berfungsi)

---

## 1. Database Connection Failed

### Gejala
```
❌ Error saat cek/init database: connect ECONNREFUSED
❌ Error: Access denied for user 'root'@'...'
❌ ER_ACCESS_DENIED_ERROR
```

### Penyebab
- MYSQL_URL tidak di-set
- Credentials salah
- MySQL service belum Active
- Network issue

### Solusi

**A. Cek MySQL Service Status**
```bash
# Via Railway Dashboard
1. Buka MySQL service
2. Pastikan status Active (hijau)
3. Jika merah, restart service
```

**B. Cek Environment Variables**
```bash
# Via Railway Dashboard
1. Buka Backend service → Variables
2. Pastikan MYSQL_URL ada (dari Reference)
3. Jika tidak ada, add reference dari MySQL service
```

**C. Restart Backend Service**
```bash
# Via Railway Dashboard
Backend service → Deployments → Redeploy

# Via Railway CLI
railway restart --service backend
```

**D. Test Connection Manual**
```bash
# Via Railway CLI
railway link
railway run node backend/scripts/test-railway-connection.js
```

**E. Cek Logs**
```bash
# Via Railway Dashboard
Backend service → Deployments → View Logs

# Cari baris:
# ✅ Database connection successful
# atau
# ❌ Error saat cek/init database
```

---

## 2. CORS Error

### Gejala
```
Access to XMLHttpRequest at 'https://backend-xxx.railway.app/api/...' 
from origin 'https://frontend-yyy.railway.app' has been blocked by CORS policy
```

### Penyebab
- FRONTEND_URL tidak di-set di backend
- FRONTEND_URL salah (typo, trailing slash)
- Backend belum restart setelah set FRONTEND_URL

### Solusi

**A. Set FRONTEND_URL di Backend**
```bash
# Via Railway Dashboard
1. Buka Backend service → Variables
2. Add variable:
   Key: FRONTEND_URL
   Value: https://frontend-yyy.railway.app
   (TANPA trailing slash!)
```

**B. Restart Backend**
```bash
# Backend akan auto-restart setelah add variable
# Atau manual restart:
Backend service → Deployments → Redeploy
```

**C. Verify CORS Configuration**
```javascript
// Cek di backend/server.js
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  process.env.FRONTEND_URL // Harus ter-set
].filter(Boolean);
```

**D. Test CORS**
```bash
# Via browser console
fetch('https://backend-xxx.railway.app/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

---

## 3. Build Failed

### Gejala
```
❌ Build failed
❌ npm ERR! code ELIFECYCLE
❌ Error: Command failed with exit code 1
```

### Penyebab
- Dependencies tidak lengkap
- Node version incompatible
- Build script error
- Out of memory

### Solusi

**A. Cek Build Logs**
```bash
# Via Railway Dashboard
Service → Deployments → Failed deployment → View Logs

# Cari error message spesifik
```

**B. Cek package.json**
```json
// Pastikan dependencies lengkap
{
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.5",
    // ... dll
  }
}
```

**C. Cek Node Version**
```toml
# backend/nixpacks.toml
[phases.setup]
nixPkgs = ["nodejs-18_x"]  # Pastikan version sesuai
```

**D. Clear Cache & Rebuild**
```bash
# Via Railway Dashboard
Service → Settings → Clear Build Cache
Kemudian Redeploy
```

**E. Test Build di Local**
```bash
cd backend
npm install
npm start

cd frontend
npm install
npm run build
```

---

## 4. Service Crash / Restart Loop

### Gejala
```
Service status: Crashed (merah)
Service restart terus-menerus
Logs: "Application failed to respond"
```

### Penyebab
- Port tidak di-bind ke 0.0.0.0
- Missing environment variables
- Uncaught exception
- Database connection failed

### Solusi

**A. Cek Logs untuk Error**
```bash
# Via Railway Dashboard
Service → Deployments → View Logs

# Cari error terakhir sebelum crash
```

**B. Pastikan Bind ke 0.0.0.0**
```javascript
// backend/server.js
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // PENTING untuk Railway

app.listen(PORT, HOST, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**C. Cek Environment Variables**
```bash
# Pastikan semua required variables ada:
- MYSQL_URL
- JWT_SECRET
- NODE_ENV
```

**D. Add Error Handlers**
```javascript
// backend/server.js
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});
```

**E. Increase Restart Policy**
```toml
# railway.toml
[deploy]
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

---

## 5. 404 Not Found

### Gejala
```
404 Not Found
Cannot GET /api/...
```

### Penyebab
- Route tidak terdaftar
- Root directory salah
- Build output salah
- URL typo

### Solusi

**A. Cek Routes**
```javascript
// backend/server.js
app.use('/api/auth', require('./routes/auth'));
app.use('/api/pengajuan', require('./routes/pengajuan'));

// Test health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});
```

**B. Cek Root Directory**
```bash
# Via Railway Dashboard
Service → Settings → Root Directory
Backend: backend
Frontend: frontend
```

**C. Test Endpoint**
```bash
# Test health check
curl https://backend-xxx.railway.app/api/health

# Test dengan full URL
curl https://backend-xxx.railway.app/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**D. Cek Frontend API URL**
```env
# frontend/.env atau Railway Variables
REACT_APP_API_URL=https://backend-xxx.railway.app/api
# Pastikan /api di akhir
```

---

## 6. 500 Internal Server Error

### Gejala
```
500 Internal Server Error
{"status":"ERROR","message":"..."}
```

### Penyebab
- Database query error
- Uncaught exception
- Missing data
- Logic error

### Solusi

**A. Cek Backend Logs**
```bash
# Via Railway Dashboard
Backend service → Deployments → View Logs

# Cari stack trace error
```

**B. Add Error Logging**
```javascript
// backend/server.js
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  console.error('Stack:', err.stack);
  res.status(500).json({ 
    status: 'ERROR', 
    message: err.message 
  });
});
```

**C. Test Query di Database**
```bash
# Connect ke database
railway connect mysql

# Test query manual
SELECT * FROM users;
SELECT * FROM pengajuan;
```

**D. Add Try-Catch**
```javascript
// routes/pengajuan.js
router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM pengajuan');
    res.json({ status: 'OK', data: rows });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      status: 'ERROR', 
      message: error.message 
    });
  }
});
```

---

## 7. Frontend Tidak Bisa Hit Backend

### Gejala
```
Network Error
ERR_CONNECTION_REFUSED
Failed to fetch
```

### Penyebab
- REACT_APP_API_URL salah
- Backend service down
- CORS error
- Network issue

### Solusi

**A. Cek REACT_APP_API_URL**
```bash
# Via Railway Dashboard
Frontend service → Variables
REACT_APP_API_URL=https://backend-xxx.railway.app/api

# Pastikan:
# 1. HTTPS (bukan HTTP)
# 2. URL backend yang benar
# 3. /api di akhir
# 4. Tidak ada trailing slash setelah /api
```

**B. Rebuild Frontend**
```bash
# Via Railway Dashboard
Frontend service → Deployments → Redeploy

# Environment variables hanya ter-apply saat build
```

**C. Test Backend Health**
```bash
# Via browser atau curl
curl https://backend-xxx.railway.app/api/health

# Harus return: {"status":"OK"}
```

**D. Cek Browser Console**
```javascript
// Buka Developer Tools → Console
// Cek error message
// Cek Network tab untuk request details
```

**E. Test dari Frontend Console**
```javascript
// Buka Developer Tools → Console
console.log(process.env.REACT_APP_API_URL);
// Harus print URL backend yang benar
```

---

## 8. Database Tidak Terinisialisasi

### Gejala
```
Table 'railway.users' doesn't exist
ER_NO_SUCH_TABLE
```

### Penyebab
- init-db.sql tidak dijalankan
- SQL syntax error
- Database connection failed saat init

### Solusi

**A. Manual Run Init Script**
```bash
# Via Railway CLI
railway link
railway run npm run init-db --prefix backend
```

**B. Connect & Run SQL Manual**
```bash
# Via Railway CLI
railway connect mysql

# Paste isi file backend/config/init-db.sql
# Atau:
SOURCE /path/to/backend/config/init-db.sql;
```

**C. Cek Auto-Init di server.js**
```javascript
// backend/server.js
async function initDatabaseIfNeeded() {
  // Pastikan function ini dipanggil
  // Cek logs untuk:
  // ✅ Database berhasil diinisialisasi!
}
```

**D. Verify Tables**
```bash
# Via Railway CLI
railway connect mysql

# Run:
SHOW TABLES;
DESCRIBE users;
DESCRIBE pengajuan;
```

---

## 9. Environment Variables Tidak Ter-apply

### Gejala
```
process.env.VARIABLE_NAME is undefined
Variables tidak muncul di logs
```

### Penyebab
- Variables tidak di-save
- Service belum restart
- Typo di variable name
- Frontend: belum rebuild

### Solusi

**A. Verify Variables**
```bash
# Via Railway Dashboard
Service → Variables
# Pastikan semua variables ada dan ter-save
```

**B. Restart Service**
```bash
# Via Railway Dashboard
Service → Deployments → Redeploy

# Via Railway CLI
railway restart --service backend
```

**C. Rebuild Frontend (Penting!)**
```bash
# Frontend environment variables hanya ter-apply saat build
# Setelah add/update REACT_APP_*, HARUS rebuild:

Frontend service → Deployments → Redeploy
```

**D. Test Variables**
```bash
# Via Railway CLI
railway variables --service backend
railway variables --service frontend
```

**E. Add Logging**
```javascript
// backend/server.js
console.log('Environment Variables:');
console.log('PORT:', process.env.PORT);
console.log('MYSQL_URL:', process.env.MYSQL_URL ? 'SET' : 'NOT SET');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
```

---

## 10. Upload File Tidak Berfungsi

### Gejala
```
File upload failed
ENOENT: no such file or directory
```

### Penyebab
- Railway tidak support persistent file storage (free tier)
- uploads/ folder tidak ada
- Permission denied

### Solusi

**A. Gunakan Cloud Storage (Recommended)**
```javascript
// Gunakan salah satu:
// 1. AWS S3
// 2. Cloudinary
// 3. Google Cloud Storage
// 4. Railway Volumes (paid)

// Example: Cloudinary
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});
```

**B. Temporary Fix (Not Recommended)**
```javascript
// backend/server.js
const fs = require('fs');
const uploadDir = path.join(__dirname, 'uploads');

// Create uploads directory if not exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
```

**C. Railway Volumes (Paid Feature)**
```bash
# Via Railway Dashboard
Service → Settings → Volumes
# Add volume dan mount ke /app/uploads
```

---

## 🔍 Debugging Tools

### 1. Railway CLI
```bash
# Install
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# View logs
railway logs --service backend
railway logs --service frontend

# Run commands
railway run npm run deploy-check --prefix backend

# Connect to database
railway connect mysql

# View variables
railway variables
```

### 2. Browser DevTools
```javascript
// Console
console.log(process.env.REACT_APP_API_URL);

// Network tab
// - Cek request URL
// - Cek response status
// - Cek headers (CORS)
// - Cek payload

// Application tab
// - Cek localStorage (token)
// - Cek cookies
```

### 3. curl Commands
```bash
# Health check
curl https://backend-xxx.railway.app/api/health

# Login test
curl https://backend-xxx.railway.app/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# With auth token
curl https://backend-xxx.railway.app/api/pengajuan \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Database Client
```bash
# MySQL Workbench
# DBeaver
# TablePlus
# phpMyAdmin

# Connection info dari Railway Variables:
Host: MYSQLHOST
Port: MYSQLPORT
User: MYSQLUSER
Password: MYSQLPASSWORD
Database: MYSQLDATABASE
```

---

## 📞 Getting Help

### Railway Support
- Documentation: https://docs.railway.app
- Discord: https://discord.gg/railway
- Status: https://status.railway.app
- Twitter: @Railway

### Project Documentation
- [DEPLOY_RAILWAY.md](./DEPLOY_RAILWAY.md) - Tutorial lengkap
- [QUICK_START_RAILWAY.md](./QUICK_START_RAILWAY.md) - Quick start
- [RAILWAY_VARIABLES.md](./RAILWAY_VARIABLES.md) - Environment variables
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Checklist
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture diagram

### Community
- Stack Overflow: Tag `railway`
- GitHub Issues: Project repository
- Reddit: r/railway

---

## 💡 Tips Debugging

1. **Selalu cek logs terlebih dahulu**
   - Backend logs untuk server errors
   - Frontend logs untuk build errors
   - Browser console untuk client errors

2. **Test step by step**
   - Test backend health check
   - Test database connection
   - Test API endpoints
   - Test frontend

3. **Isolate the problem**
   - Backend issue? Test dengan curl
   - Frontend issue? Test dengan browser console
   - Database issue? Connect dengan MySQL client

4. **Compare with working setup**
   - Cek environment variables
   - Cek configuration files
   - Cek logs untuk differences

5. **Use deployment check script**
   ```bash
   cd backend
   npm run deploy-check
   ```

---

**Last Updated:** ${new Date().toISOString()}
