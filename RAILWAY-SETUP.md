# 🚂 Railway Deployment Guide - iWare Perizinan

## 📋 Prerequisites
- Akun Railway (https://railway.app)
- GitHub repository sudah connected
- MySQL service sudah dibuat di Railway

---

## 🗄️ Step 1: Setup MySQL Database

### 1.1 Buat MySQL Service
1. Buka Railway Dashboard → New → Database → MySQL
2. Tunggu sampai status **Active**

### 1.2 Inisialisasi Database
1. Klik MySQL service → tab **Data** → **Query**
2. Paste SQL berikut:

```sql
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  nama VARCHAR(100) NOT NULL,
  role ENUM('admin', 'hrd') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pengajuan (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nama VARCHAR(100) NOT NULL,
  no_telp VARCHAR(20) NOT NULL,
  jenis_perizinan VARCHAR(50) NOT NULL,
  tanggal_mulai DATETIME NOT NULL,
  tanggal_selesai DATETIME NOT NULL,
  bukti_foto VARCHAR(255),
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  catatan TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO users (username, password, nama, role) 
VALUES ('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrator', 'admin');
```

3. Klik **Run Query**
4. Verify: Cek tabel `users` dan `pengajuan` sudah ada

---

## 🔧 Step 2: Deploy Backend

### 2.1 Buat Backend Service
1. Railway Dashboard → New → GitHub Repo
2. Pilih repository: `lutfllhm/licensing-iw`
3. Klik **Deploy**

### 2.2 Configure Backend Settings
1. Klik Backend service → tab **Settings**
2. Set **Root Directory**: `/backend`
3. Set **Branch**: `main`

### 2.3 Setup Environment Variables
1. Klik tab **Variables** → **Raw Editor**
2. Paste konfigurasi berikut:

```env
MYSQL_URL=${{MySQL.MYSQL_URL}}
JWT_SECRET=85d353bc9474c60da7df6412926f8686821ee2076e58598e932a56e87e236538
PORT=5000
NODE_ENV=production
```

3. Klik **Save**
4. Tunggu auto-redeploy

### 2.4 Verify Backend
1. Cek **Deploy Logs**, pastikan ada:
   ```
   ✅ Database connection successful
   ✅ Database sudah diinisialisasi
   🚀 Server berjalan di port 5000
   ```

2. Copy **Backend URL** dari tab **Settings** → **Domains**
   Format: `https://licensing-iw-production.up.railway.app`

3. Test endpoint:
   ```
   https://licensing-iw-production.up.railway.app/api/health
   ```
   Response: `{"status":"OK","message":"Server berjalan dengan baik"}`

---

## 🎨 Step 3: Deploy Frontend

### 3.1 Buat Frontend Service
1. Railway Dashboard → New → GitHub Repo
2. Pilih repository yang sama: `lutfllhm/licensing-iw`
3. Klik **Deploy**

### 3.2 Configure Frontend Settings
1. Klik Frontend service → tab **Settings**
2. Set **Root Directory**: `/frontend`
3. Set **Branch**: `main`

### 3.3 Setup Environment Variables
1. Klik tab **Variables** → **Raw Editor**
2. Paste (ganti dengan Backend URL Anda):

```env
REACT_APP_API_URL=https://licensing-iw-production.up.railway.app
PORT=3000
```

3. Klik **Save**
4. Tunggu auto-redeploy

### 3.4 Verify Frontend
1. Cek **Deploy Logs**, pastikan build success
2. Copy **Frontend URL** dari tab **Settings** → **Domains**
3. Buka di browser, test login dengan:
   - Username: `admin`
   - Password: `password`

---

## 🔗 Step 4: Configure CORS

### 4.1 Update Backend CORS
1. Buka Backend service → tab **Variables**
2. Tambahkan variable baru:

```env
FRONTEND_URL=https://your-frontend-url.up.railway.app
```

3. Save dan tunggu redeploy

---

## ✅ Verification Checklist

- [ ] MySQL service **Active** dan tabel sudah dibuat
- [ ] Backend deploy success dan `/api/health` return OK
- [ ] Frontend deploy success dan bisa diakses
- [ ] Login berhasil dengan admin/password
- [ ] CORS tidak ada error di browser console
- [ ] Upload file berfungsi
- [ ] Dashboard menampilkan data

---

## 🐛 Troubleshooting

### Backend Error: "Application failed to respond"
**Solusi:**
1. Cek Deploy Logs untuk error message
2. Pastikan environment variables sudah di-set
3. Verify MySQL service running
4. Cek `MYSQL_URL` format benar

### Frontend Error: "Network Error" saat login
**Solusi:**
1. Cek `REACT_APP_API_URL` di Frontend Variables
2. Pastikan tidak ada trailing slash: ❌ `/api` atau `/`
3. Test backend endpoint langsung di browser
4. Cek CORS settings di backend

### Database Connection Timeout
**Solusi:**
1. Restart MySQL service
2. Verify `MYSQL_URL` di Backend Variables
3. Cek MySQL service logs

### Image Upload Tidak Muncul
**Solusi:**
1. Pastikan `API_URL` di frontend sudah benar
2. Cek folder `/uploads` di backend
3. Verify file permissions

---

## 📝 Default Credentials

**Admin Account:**
- Username: `admin`
- Password: `password`

**⚠️ PENTING:** Ganti password setelah login pertama!

---

## 🔐 Security Notes

1. **JWT_SECRET**: Generate yang baru untuk production
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Admin Password**: Ganti segera setelah deploy

3. **Environment Variables**: Jangan commit file `.env` ke Git

---

## 📚 Useful Commands

### Check Backend Logs
```bash
# Di Railway Dashboard
Backend Service → Deployments → View Logs
```

### Restart Service
```bash
# Di Railway Dashboard
Service → Settings → Restart
```

### View Database
```bash
# Di Railway Dashboard
MySQL Service → Data → Query
```

---

## 🆘 Support

Jika ada masalah:
1. Cek Deploy Logs di Railway
2. Verify environment variables
3. Test endpoints dengan Postman/curl
4. Cek browser console untuk frontend errors

---

**Last Updated:** January 14, 2026
**Version:** 1.0.0
