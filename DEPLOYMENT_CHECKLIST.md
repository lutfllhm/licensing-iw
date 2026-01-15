# ✅ Railway Deployment Checklist

## 🎯 Pre-Deployment (Sebelum Deploy)

### 1. Repository Setup
- [ ] Kode sudah di-push ke GitHub
- [ ] Branch main/master sudah up-to-date
- [ ] File `.env` sudah di-gitignore (jangan commit!)
- [ ] File `.env.example` sudah dibuat
- [ ] Dependencies di `package.json` sudah lengkap

### 2. Database Schema
- [ ] File `backend/config/init-db.sql` sudah siap
- [ ] Schema sudah di-test di local
- [ ] Default admin user sudah ada di SQL

### 3. Configuration Files
- [ ] `backend/railway.toml` ✅ (sudah dibuat)
- [ ] `backend/nixpacks.toml` ✅ (sudah dibuat)
- [ ] `frontend/railway.toml` ✅ (sudah dibuat)
- [ ] `frontend/nixpacks.toml` ✅ (sudah dibuat)
- [ ] `.railwayignore` ✅ (sudah dibuat)

---

## 🚀 Deployment Steps

### Step 1: Setup Railway Account (5 menit)
- [ ] Buka https://railway.app
- [ ] Login dengan GitHub
- [ ] Verifikasi email
- [ ] Cek $5 free credit tersedia

### Step 2: Create MySQL Database (2 menit)
- [ ] Klik "New Project"
- [ ] Pilih "Provision MySQL"
- [ ] Tunggu status menjadi Active (hijau)
- [ ] Catat credentials di tab Variables
- [ ] (Opsional) Enable TCP Proxy untuk akses eksternal

### Step 3: Deploy Backend (5 menit)
- [ ] Klik "New" → "GitHub Repo"
- [ ] Pilih repository
- [ ] Set Root Directory: `backend`
- [ ] Tunggu build selesai
- [ ] Generate Domain di Settings → Domains
- [ ] Catat Backend URL: `https://backend-xxx.railway.app`

### Step 4: Configure Backend Variables (3 menit)
- [ ] Buka Backend service → Tab Variables
- [ ] Add Reference dari MySQL service:
  - [ ] MYSQL_URL
  - [ ] MYSQLHOST
  - [ ] MYSQLPORT
  - [ ] MYSQLUSER
  - [ ] MYSQLPASSWORD
  - [ ] MYSQLDATABASE
- [ ] Add manual variables:
  - [ ] JWT_SECRET (generate baru!)
  - [ ] NODE_ENV=production
  - [ ] PORT=5000 (opsional)
- [ ] Tunggu service restart

### Step 5: Verify Backend (2 menit)
- [ ] Buka `https://backend-xxx.railway.app/api/health`
- [ ] Response harus: `{"status":"OK",...}`
- [ ] Cek logs: Backend → Deployments → View Logs
- [ ] Pastikan ada: "✅ Database connection successful"
- [ ] Pastikan ada: "✅ Database sudah diinisialisasi"

### Step 6: Deploy Frontend (5 menit)
- [ ] Klik "New" → "GitHub Repo"
- [ ] Pilih repository yang sama
- [ ] Set Root Directory: `frontend`
- [ ] Tunggu build selesai
- [ ] Generate Domain di Settings → Domains
- [ ] Catat Frontend URL: `https://frontend-yyy.railway.app`

### Step 7: Configure Frontend Variables (2 menit)
- [ ] Buka Frontend service → Tab Variables
- [ ] Add variables:
  - [ ] REACT_APP_API_URL=`https://backend-xxx.railway.app/api`
  - [ ] NODE_ENV=production
  - [ ] PORT=3000 (opsional)
- [ ] Tunggu service restart & rebuild

### Step 8: Update Backend CORS (1 menit)
- [ ] Kembali ke Backend service → Tab Variables
- [ ] Add variable:
  - [ ] FRONTEND_URL=`https://frontend-yyy.railway.app`
- [ ] Tunggu service restart

---

## 🧪 Testing & Verification

### Backend Tests
- [ ] Health check: `curl https://backend-xxx.railway.app/api/health`
- [ ] Response status: 200 OK
- [ ] Response body: `{"status":"OK"}`
- [ ] Logs tidak ada error
- [ ] Database connection OK

### Frontend Tests
- [ ] Buka `https://frontend-yyy.railway.app`
- [ ] Halaman load tanpa error
- [ ] Console browser tidak ada error
- [ ] Network tab: API calls ke backend berhasil

### Integration Tests
- [ ] Login dengan admin/admin123
- [ ] Dashboard load dengan benar
- [ ] Data dari database tampil
- [ ] Create data baru berhasil
- [ ] Update data berhasil
- [ ] Delete data berhasil
- [ ] Upload file berhasil (jika ada)

### Database Tests
- [ ] Connect ke database via MySQL client
- [ ] Cek tabel sudah dibuat
- [ ] Cek data admin sudah ada
- [ ] Test query manual

---

## 📊 Post-Deployment

### Monitoring Setup
- [ ] Cek Railway Metrics (CPU, Memory, Network)
- [ ] Setup uptime monitoring (UptimeRobot, Pingdom)
- [ ] Setup error tracking (Sentry, LogRocket)
- [ ] Enable Railway notifications

### Security
- [ ] Ganti JWT_SECRET dengan yang baru
- [ ] Pastikan HTTPS enabled (otomatis dari Railway)
- [ ] Cek CORS configuration
- [ ] Review exposed endpoints
- [ ] Disable debug mode di production

### Performance
- [ ] Test response time
- [ ] Check database query performance
- [ ] Monitor memory usage
- [ ] Check for memory leaks

### Documentation
- [ ] Update README dengan production URLs
- [ ] Document environment variables
- [ ] Create user guide
- [ ] Document API endpoints

---

## 🔧 Optional Enhancements

### Custom Domain (Opsional)
- [ ] Beli domain (Namecheap, GoDaddy, dll)
- [ ] Add custom domain di Railway Settings
- [ ] Update DNS records (CNAME)
- [ ] Update FRONTEND_URL di backend
- [ ] Update REACT_APP_API_URL di frontend
- [ ] Test dengan custom domain

### CI/CD Setup (Opsional)
- [ ] Enable auto-deploy dari GitHub
- [ ] Setup branch protection
- [ ] Add pre-deploy checks
- [ ] Setup staging environment

### Backup Strategy (Recommended)
- [ ] Setup automated database backup
- [ ] Test restore procedure
- [ ] Document backup location
- [ ] Schedule regular backups

### Monitoring & Alerts (Recommended)
- [ ] Setup error alerts
- [ ] Setup downtime alerts
- [ ] Setup performance alerts
- [ ] Setup cost alerts

---

## 📋 Final Verification

### URLs
- [ ] Frontend URL: `https://frontend-yyy.railway.app`
- [ ] Backend URL: `https://backend-xxx.railway.app`
- [ ] Database: Managed by Railway

### Services Status
- [ ] MySQL: Active (hijau)
- [ ] Backend: Active (hijau)
- [ ] Frontend: Active (hijau)

### Environment Variables
- [ ] Backend: 8+ variables set
- [ ] Frontend: 2+ variables set
- [ ] No missing required variables

### Functionality
- [ ] Login works
- [ ] CRUD operations work
- [ ] File upload works (if applicable)
- [ ] No console errors
- [ ] No CORS errors

---

## 🎉 Deployment Complete!

Selamat! Aplikasi Anda sudah live di Railway!

**Next Steps:**
1. Share URL dengan team/client
2. Monitor logs untuk 24 jam pertama
3. Setup monitoring dan alerts
4. Plan untuk backup strategy
5. Consider custom domain

**Support:**
- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Tutorial Lengkap: [DEPLOY_RAILWAY.md](./DEPLOY_RAILWAY.md)
- Quick Start: [QUICK_START_RAILWAY.md](./QUICK_START_RAILWAY.md)

---

## 📞 Troubleshooting

Jika ada masalah, cek:
1. ❌ Service logs di Railway Dashboard
2. ❌ Environment variables sudah benar
3. ❌ Database connection OK
4. ❌ CORS configuration benar
5. ❌ Build logs untuk error

**Common Issues:**
- CORS Error → Cek FRONTEND_URL di backend
- 500 Error → Cek backend logs
- Database Error → Cek MYSQL_URL reference
- Build Failed → Cek package.json dan dependencies

---

**Timestamp:** ${new Date().toISOString()}
**Status:** Ready for Deployment ✅
