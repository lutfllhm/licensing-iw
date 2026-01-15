# 🔐 Railway Environment Variables Reference

## 📊 MySQL Service (Auto-generated oleh Railway)

Ketika Anda provision MySQL di Railway, variable berikut akan otomatis dibuat:

```env
MYSQL_URL=mysql://root:password@containers-us-west-xxx.railway.app:6543/railway
MYSQLHOST=containers-us-west-xxx.railway.app
MYSQLPORT=6543
MYSQLUSER=root
MYSQLPASSWORD=random-generated-password
MYSQLDATABASE=railway
```

**Catatan:** Jangan set manual, gunakan "Add Reference" untuk link ke Backend service.

---

## 🔧 Backend Service Variables

### Required (Wajib)

```env
# Database Connection (Reference dari MySQL service)
MYSQL_URL=${MySQL.MYSQL_URL}
MYSQLHOST=${MySQL.MYSQLHOST}
MYSQLPORT=${MySQL.MYSQLPORT}
MYSQLUSER=${MySQL.MYSQLUSER}
MYSQLPASSWORD=${MySQL.MYSQLPASSWORD}
MYSQLDATABASE=${MySQL.MYSQLDATABASE}

# JWT Secret untuk authentication
JWT_SECRET=cf9376f298de46b707fbc7affa22f22d9dc6a6ca9f556a9874727a85007b2b68

# Frontend URL untuk CORS (isi setelah frontend di-deploy)
FRONTEND_URL=https://your-frontend-url.railway.app
```

### Optional (Opsional)

```env
# Port (Railway set otomatis, tapi bisa override)
PORT=5000

# Node Environment
NODE_ENV=production
```

---

## 🎨 Frontend Service Variables

### Required (Wajib)

```env
# Backend API URL (isi dengan URL backend yang sudah di-deploy)
REACT_APP_API_URL=https://your-backend-url.railway.app/api
```

### Optional (Opsional)

```env
# Port (Railway set otomatis)
PORT=3000

# Node Environment
NODE_ENV=production
```

---

## 📝 Cara Set Variables di Railway

### Method 1: Via Dashboard (Recommended)

**Untuk Database Reference:**
1. Buka Backend service
2. Klik tab "Variables"
3. Klik "New Variable" → "Add Reference"
4. Pilih MySQL service
5. Pilih variable yang ingin di-reference (pilih semua)
6. Klik "Add"

**Untuk Manual Variables:**
1. Buka service (Backend/Frontend)
2. Klik tab "Variables"
3. Klik "New Variable"
4. Masukkan Key dan Value
5. Klik "Add"

### Method 2: Via Railway CLI

```bash
# Link ke project
railway link

# Set variable
railway variables set JWT_SECRET=your-secret-here

# Set multiple variables
railway variables set \
  JWT_SECRET=your-secret \
  NODE_ENV=production \
  FRONTEND_URL=https://your-frontend.railway.app

# View all variables
railway variables

# Delete variable
railway variables delete VARIABLE_NAME
```

### Method 3: Via .env File (Local Development Only)

```bash
# Jangan commit .env ke Git!
# Gunakan .env.example sebagai template

# Backend
cp backend/.env.example backend/.env
# Edit backend/.env dengan kredensial lokal

# Frontend
cp frontend/.env.example frontend/.env
# Edit frontend/.env dengan API URL lokal
```

---

## 🔄 Update Variables

Setelah update variables, Railway akan otomatis:
1. Restart service
2. Apply variable baru
3. Redeploy jika perlu

**Catatan:** Perubahan pada referenced variables (dari MySQL) akan otomatis ter-update.

---

## 🔍 Verify Variables

### Via Railway Dashboard
1. Buka service
2. Klik tab "Variables"
3. Lihat semua variables yang ter-set

### Via Railway CLI
```bash
railway variables
```

### Via Deployment Check Script
```bash
# Di local (setelah set .env)
cd backend
npm run deploy-check

# Via Railway CLI
railway run npm run deploy-check --prefix backend
```

---

## ⚠️ Security Best Practices

### DO ✅
- Gunakan Railway Variables untuk production
- Generate JWT_SECRET yang kuat (32+ characters)
- Gunakan HTTPS untuk semua URLs
- Reference database credentials (jangan copy-paste)
- Gunakan .env.example sebagai template
- Add .env ke .gitignore

### DON'T ❌
- Jangan commit .env ke Git
- Jangan share JWT_SECRET di public
- Jangan hardcode credentials di code
- Jangan gunakan weak secrets
- Jangan expose database credentials

---

## 🔐 Generate Secure JWT Secret

```bash
# Method 1: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Method 2: OpenSSL
openssl rand -hex 32

# Method 3: Menggunakan script
cd backend
node scripts/generate-jwt-secret.js
```

---

## 📋 Variables Checklist

### MySQL Service
- [ ] Service sudah Active (hijau)
- [ ] MYSQL_URL ter-generate
- [ ] Credentials bisa diakses

### Backend Service
- [ ] MYSQL_URL (referenced)
- [ ] MYSQLHOST (referenced)
- [ ] MYSQLPORT (referenced)
- [ ] MYSQLUSER (referenced)
- [ ] MYSQLPASSWORD (referenced)
- [ ] MYSQLDATABASE (referenced)
- [ ] JWT_SECRET (manual)
- [ ] FRONTEND_URL (manual, setelah frontend deploy)
- [ ] NODE_ENV=production (manual)

### Frontend Service
- [ ] REACT_APP_API_URL (manual, setelah backend deploy)
- [ ] NODE_ENV=production (manual)

---

## 🐛 Troubleshooting

### Variable tidak ter-apply
```bash
# Restart service
railway restart --service backend

# Atau redeploy
railway redeploy --service backend
```

### Referenced variable tidak muncul
```bash
# Pastikan MySQL service sudah Active
# Hapus reference dan add ulang
# Restart backend service
```

### CORS error setelah set FRONTEND_URL
```bash
# Pastikan URL tidak ada trailing slash
# Benar: https://frontend.railway.app
# Salah: https://frontend.railway.app/

# Restart backend service setelah update
```

---

## 📞 Need Help?

- Railway Docs: https://docs.railway.app/develop/variables
- Railway Discord: https://discord.gg/railway
- Check logs: `railway logs --service backend`
