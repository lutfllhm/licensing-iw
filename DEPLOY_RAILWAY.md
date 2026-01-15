# 🚀 Tutorial Deploy ke Railway - Lengkap dari Awal hingga Akhir

## 📋 Daftar Isi
1. [Persiapan Akun Railway](#1-persiapan-akun-railway)
2. [Setup Database MySQL](#2-setup-database-mysql)
3. [Deploy Backend](#3-deploy-backend)
4. [Deploy Frontend](#4-deploy-frontend)
5. [Koneksi Database, Backend, dan Frontend](#5-koneksi-database-backend-dan-frontend)
6. [Testing dan Verifikasi](#6-testing-dan-verifikasi)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Persiapan Akun Railway

### 1.1 Buat Akun Railway
1. Buka https://railway.app
2. Klik **"Start a New Project"** atau **"Login"**
3. Login menggunakan **GitHub** (recommended) atau email
4. Verifikasi email jika diperlukan
5. Anda akan mendapat **$5 credit gratis** untuk trial

### 1.2 Install Railway CLI (Opsional)
```bash
# Windows (PowerShell)
iwr https://railway.app/install.ps1 | iex

# Atau menggunakan npm
npm install -g @railway/cli

# Login ke Railway CLI
railway login
```

---

## 2. Setup Database MySQL

### 2.1 Buat MySQL Database di Railway
1. Login ke Railway Dashboard (https://railway.app/dashboard)
2. Klik **"New Project"**
3. Pilih **"Provision MySQL"**
4. Railway akan otomatis membuat MySQL database
5. Tunggu hingga status menjadi **"Active"** (hijau)

### 2.2 Dapatkan Kredensial Database
1. Klik pada **MySQL service** yang baru dibuat
2. Buka tab **"Variables"**
3. Anda akan melihat kredensial berikut:
   - `MYSQLHOST` - Host database
   - `MYSQLPORT` - Port (biasanya 3306)
   - `MYSQLUSER` - Username
   - `MYSQLPASSWORD` - Password
   - `MYSQLDATABASE` - Nama database
   - `MYSQL_URL` - Connection string lengkap

### 2.3 Akses Database via phpMyAdmin (Opsional)

**Opsi A: Menggunakan Railway MySQL Proxy**
1. Di Railway Dashboard, klik MySQL service
2. Klik tab **"Connect"**
3. Aktifkan **"TCP Proxy"**
4. Catat **Public Host** dan **Port**
5. Gunakan kredensial ini di phpMyAdmin lokal Anda

**Opsi B: Menggunakan MySQL Workbench atau DBeaver**
1. Download MySQL Workbench: https://dev.mysql.com/downloads/workbench/
2. Atau DBeaver: https://dbeaver.io/download/
3. Buat koneksi baru dengan kredensial dari Railway
4. Test connection dan simpan

**Opsi C: Deploy phpMyAdmin di Railway**
1. Buat service baru di project yang sama
2. Pilih **"Deploy from GitHub repo"**
3. Gunakan repo: https://github.com/phpmyadmin/docker
4. Atau gunakan Docker image: `phpmyadmin/phpmyadmin`
5. Set environment variables:
   ```
   PMA_HOST=<MYSQLHOST dari Railway>
   PMA_PORT=<MYSQLPORT dari Railway>
   PMA_USER=<MYSQLUSER dari Railway>
   PMA_PASSWORD=<MYSQLPASSWORD dari Railway>
   ```

### 2.4 Inisialisasi Database
Database akan otomatis diinisialisasi saat backend pertama kali dijalankan. File `init-db.sql` akan dieksekusi otomatis.

Atau Anda bisa manual menggunakan Railway CLI:
```bash
# Connect ke project
railway link

# Run init script
railway run npm run init-db --prefix backend
```

---

## 3. Deploy Backend

### 3.1 Persiapan Repository
1. Pastikan kode sudah di-push ke GitHub:
```bash
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### 3.2 Deploy Backend ke Railway

**Cara 1: Via Railway Dashboard (Recommended)**
1. Di Railway Dashboard, klik **"New"** → **"GitHub Repo"**
2. Pilih repository Anda
3. Railway akan detect monorepo, pilih **"backend"** folder
4. Atau klik **"Configure"** dan set:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

**Cara 2: Via Railway CLI**
```bash
cd backend
railway init
railway up
```

### 3.3 Set Environment Variables untuk Backend
1. Klik service **Backend** di Railway Dashboard
2. Buka tab **"Variables"**
3. Klik **"New Variable"** dan tambahkan:

```env
# Port (Railway akan set otomatis, tapi bisa di-override)
PORT=5000

# JWT Secret (gunakan yang sudah ada atau generate baru)
JWT_SECRET=cf9376f298de46b707fbc7affa22f22d9dc6a6ca9f556a9874727a85007b2b68

# Frontend URL (akan diisi setelah frontend di-deploy)
FRONTEND_URL=https://your-frontend-url.railway.app

# Node Environment
NODE_ENV=production
```

### 3.4 Link Database ke Backend
1. Masih di Backend service, tab **"Variables"**
2. Klik **"New Variable"** → **"Add Reference"**
3. Pilih **MySQL service**
4. Pilih variable berikut untuk di-reference:
   - `MYSQL_URL` (ini yang paling penting)
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLDATABASE`

Railway akan otomatis inject variable ini ke backend service.

### 3.5 Dapatkan Backend URL
1. Setelah deploy selesai, buka tab **"Settings"**
2. Scroll ke **"Domains"**
3. Klik **"Generate Domain"**
4. Catat URL backend Anda, contoh: `https://backend-production-xxxx.up.railway.app`

---

## 4. Deploy Frontend

### 4.1 Update Frontend Environment
1. Edit file `frontend/.env`:
```env
REACT_APP_API_URL=https://backend-production-xxxx.up.railway.app/api
```

2. Commit perubahan:
```bash
git add frontend/.env
git commit -m "Update API URL for production"
git push origin main
```

### 4.2 Deploy Frontend ke Railway

**Cara 1: Via Railway Dashboard**
1. Di Railway Dashboard (project yang sama), klik **"New"** → **"GitHub Repo"**
2. Pilih repository yang sama
3. Klik **"Configure"** dan set:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run serve`

**Cara 2: Via Railway CLI**
```bash
cd frontend
railway init
railway up
```

### 4.3 Set Environment Variables untuk Frontend
1. Klik service **Frontend** di Railway Dashboard
2. Buka tab **"Variables"**
3. Tambahkan:

```env
# API URL Backend
REACT_APP_API_URL=https://backend-production-xxxx.up.railway.app/api

# Port
PORT=3000

# Node Environment
NODE_ENV=production
```

### 4.4 Dapatkan Frontend URL
1. Setelah deploy selesai, buka tab **"Settings"**
2. Scroll ke **"Domains"**
3. Klik **"Generate Domain"**
4. Catat URL frontend Anda, contoh: `https://frontend-production-yyyy.up.railway.app`

---

## 5. Koneksi Database, Backend, dan Frontend

### 5.1 Update Backend CORS
1. Kembali ke Backend service di Railway
2. Buka tab **"Variables"**
3. Update atau tambahkan:
```env
FRONTEND_URL=https://frontend-production-yyyy.up.railway.app
```

4. Backend akan otomatis restart dan menerima request dari frontend

### 5.2 Verifikasi Koneksi

**Diagram Koneksi:**
```
Frontend (Railway) 
    ↓ REACT_APP_API_URL
Backend (Railway)
    ↓ MYSQL_URL
MySQL Database (Railway)
```

**Flow Data:**
1. User akses Frontend URL
2. Frontend kirim request ke Backend URL (via REACT_APP_API_URL)
3. Backend terima request (CORS check FRONTEND_URL)
4. Backend query ke MySQL (via MYSQL_URL)
5. MySQL return data ke Backend
6. Backend return response ke Frontend
7. Frontend tampilkan data ke User

### 5.3 Test Koneksi

**Test Backend Health:**
```bash
curl https://backend-production-xxxx.up.railway.app/api/health
```

Response yang diharapkan:
```json
{
  "status": "OK",
  "message": "Server berjalan dengan baik",
  "timestamp": "2026-01-15T...",
  "env": "production"
}
```

**Test Database Connection:**
Buka backend logs di Railway Dashboard, cari:
```
✅ Database connection successful
✅ Database sudah diinisialisasi
```

**Test Frontend:**
Buka frontend URL di browser, coba login dengan:
- Username: `admin`
- Password: `admin123`

---

## 6. Testing dan Verifikasi

### 6.1 Cek Logs
**Backend Logs:**
1. Buka Backend service di Railway
2. Klik tab **"Deployments"**
3. Klik deployment terbaru
4. Klik **"View Logs"**
5. Pastikan tidak ada error

**Frontend Logs:**
1. Sama seperti backend
2. Cek build logs dan runtime logs

### 6.2 Test Fitur Aplikasi
1. **Login**: Test login dengan user admin
2. **Dashboard**: Pastikan dashboard load dengan benar
3. **CRUD Operations**: Test create, read, update, delete
4. **Upload File**: Test upload dokumen
5. **API Endpoints**: Test semua endpoint penting

### 6.3 Monitor Performance
1. Di Railway Dashboard, buka tab **"Metrics"**
2. Monitor:
   - CPU Usage
   - Memory Usage
   - Network Traffic
   - Response Time

---

## 7. Troubleshooting

### 7.1 Backend Tidak Bisa Connect ke Database

**Problem:** Error "ECONNREFUSED" atau "Access denied"

**Solution:**
1. Cek environment variables di Backend service
2. Pastikan `MYSQL_URL` sudah di-set (via Reference)
3. Restart backend service
4. Cek MySQL service status (harus Active/hijau)

```bash
# Via Railway CLI
railway logs --service backend
```

### 7.2 Frontend Tidak Bisa Hit Backend API

**Problem:** CORS error atau Network error

**Solution:**
1. Cek `FRONTEND_URL` di Backend environment variables
2. Cek `REACT_APP_API_URL` di Frontend environment variables
3. Pastikan URL tidak ada trailing slash
4. Rebuild frontend:
```bash
railway redeploy --service frontend
```

### 7.3 Database Tidak Terinisialisasi

**Problem:** Table tidak ada atau empty

**Solution:**
1. Manual run init script via Railway CLI:
```bash
railway link
railway run npm run init-db --prefix backend
```

2. Atau connect ke database dan run SQL manual:
```bash
railway connect mysql
# Kemudian paste isi file backend/config/init-db.sql
```

### 7.4 Build Failed

**Problem:** "Build failed" atau "Out of memory"

**Solution:**
1. Cek build logs untuk error spesifik
2. Pastikan `package.json` sudah benar
3. Cek Node version compatibility
4. Increase memory limit di Railway settings (jika perlu upgrade plan)

### 7.5 Service Crash atau Restart Terus

**Problem:** Service status merah atau restart loop

**Solution:**
1. Cek logs untuk error message
2. Pastikan `PORT` environment variable sudah di-set
3. Pastikan start command sudah benar
4. Cek apakah ada missing dependencies

---

## 📊 Checklist Deployment

### Pre-Deployment
- [ ] Kode sudah di-push ke GitHub
- [ ] File `.env` sudah di-update (jangan commit yang production!)
- [ ] Dependencies sudah lengkap di `package.json`
- [ ] Database schema sudah siap (`init-db.sql`)

### Railway Setup
- [ ] Akun Railway sudah dibuat
- [ ] MySQL service sudah dibuat dan Active
- [ ] Backend service sudah di-deploy
- [ ] Frontend service sudah di-deploy

### Environment Variables
- [ ] Backend: `MYSQL_URL` (reference dari MySQL)
- [ ] Backend: `JWT_SECRET`
- [ ] Backend: `FRONTEND_URL`
- [ ] Backend: `NODE_ENV=production`
- [ ] Frontend: `REACT_APP_API_URL`
- [ ] Frontend: `NODE_ENV=production`

### Testing
- [ ] Backend health check OK
- [ ] Database connection OK
- [ ] Frontend bisa diakses
- [ ] Login berhasil
- [ ] CRUD operations berfungsi
- [ ] Upload file berfungsi

### Post-Deployment
- [ ] Custom domain (opsional)
- [ ] SSL certificate (otomatis dari Railway)
- [ ] Monitoring setup
- [ ] Backup strategy

---

## 🎯 Tips dan Best Practices

### 1. Environment Variables
- Jangan commit file `.env` ke Git
- Gunakan Railway Variables untuk production
- Gunakan Reference untuk database credentials

### 2. Security
- Ganti `JWT_SECRET` dengan yang baru dan kuat
- Gunakan HTTPS (Railway provide otomatis)
- Set CORS dengan benar
- Jangan expose database credentials

### 3. Performance
- Enable caching jika perlu
- Optimize database queries
- Compress response (gzip)
- Use CDN untuk static assets

### 4. Monitoring
- Setup error tracking (Sentry, LogRocket)
- Monitor Railway metrics
- Setup uptime monitoring (UptimeRobot)
- Enable Railway notifications

### 5. Cost Optimization
- Monitor usage di Railway Dashboard
- Optimize resource usage
- Consider sleep mode untuk dev environment
- Upgrade plan jika perlu

---

## 🔗 Resource Links

- Railway Documentation: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- MySQL Documentation: https://dev.mysql.com/doc/
- React Deployment: https://create-react-app.dev/docs/deployment/

---

## 📞 Support

Jika ada masalah:
1. Cek Railway logs terlebih dahulu
2. Baca dokumentasi Railway
3. Tanya di Railway Discord community
4. Check GitHub Issues

---

**Selamat! Aplikasi Anda sekarang sudah live di Railway! 🎉**

URL Aplikasi:
- Frontend: `https://frontend-production-yyyy.up.railway.app`
- Backend: `https://backend-production-xxxx.up.railway.app`
- Database: Managed by Railway MySQL

**Next Steps:**
- Setup custom domain (opsional)
- Enable monitoring dan alerts
- Setup CI/CD untuk auto-deploy
- Backup database secara berkala
