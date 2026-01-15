# 🚀 Quick Start - Deploy ke Railway (5 Menit)

## Langkah Cepat

### 1️⃣ Setup Railway (2 menit)
```bash
# 1. Buka https://railway.app dan login dengan GitHub
# 2. Klik "New Project"
# 3. Pilih "Provision MySQL" - tunggu hingga Active
```

### 2️⃣ Deploy Backend (1 menit)
```bash
# 1. Di Railway, klik "New" → "GitHub Repo"
# 2. Pilih repository ini
# 3. Set Root Directory: backend
# 4. Klik "Deploy"
```

**Set Variables Backend:**
- Klik Backend service → Tab "Variables"
- Klik "New Variable" → "Add Reference" → Pilih MySQL
- Pilih semua variable MySQL (MYSQL_URL, MYSQLHOST, dll)
- Tambahkan manual:
  ```
  JWT_SECRET=cf9376f298de46b707fbc7affa22f22d9dc6a6ca9f556a9874727a85007b2b68
  NODE_ENV=production
  ```
- Generate Domain di tab Settings → Domains
- Catat Backend URL: `https://backend-xxx.up.railway.app`

### 3️⃣ Deploy Frontend (1 menit)
```bash
# 1. Di Railway (project sama), klik "New" → "GitHub Repo"
# 2. Pilih repository yang sama
# 3. Set Root Directory: frontend
# 4. Klik "Deploy"
```

**Set Variables Frontend:**
- Klik Frontend service → Tab "Variables"
- Tambahkan:
  ```
  REACT_APP_API_URL=https://backend-xxx.up.railway.app/api
  NODE_ENV=production
  PORT=3000
  ```
- Generate Domain di tab Settings → Domains
- Catat Frontend URL: `https://frontend-yyy.up.railway.app`

### 4️⃣ Update Backend CORS (30 detik)
```bash
# Kembali ke Backend service → Variables
# Tambahkan:
FRONTEND_URL=https://frontend-yyy.up.railway.app
```

### 5️⃣ Test Aplikasi (30 detik)
```bash
# 1. Buka Frontend URL di browser
# 2. Login dengan: admin / admin123
# 3. Selesai! ✅
```

---

## 🔍 Troubleshooting Cepat

**Backend Error?**
```bash
# Cek logs: Backend service → Deployments → View Logs
# Pastikan MYSQL_URL sudah di-set
```

**Frontend Error?**
```bash
# Cek REACT_APP_API_URL sudah benar
# Pastikan tidak ada trailing slash
# Redeploy: Frontend service → Deployments → Redeploy
```

**CORS Error?**
```bash
# Pastikan FRONTEND_URL di Backend sudah benar
# Restart Backend service
```

---

## 📋 Checklist
- [ ] MySQL service Active (hijau)
- [ ] Backend deployed & has domain
- [ ] Frontend deployed & has domain
- [ ] Backend variables: MYSQL_URL, JWT_SECRET, FRONTEND_URL
- [ ] Frontend variables: REACT_APP_API_URL
- [ ] Login berhasil

---

**Untuk tutorial lengkap, baca: [DEPLOY_RAILWAY.md](./DEPLOY_RAILWAY.md)**
