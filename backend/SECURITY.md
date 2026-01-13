# Security Guide - Aplikasi Perizinan IWARE

## Default Credentials

### Admin Account
- **Username:** `admin`
- **Password:** `admin123`
- **Hash (bcrypt):** `$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi`

⚠️ **PENTING:** Segera ubah password default setelah instalasi pertama!

## Password Hashing

Aplikasi ini menggunakan **bcrypt** untuk hashing password dengan:
- **Salt Rounds:** 10
- **Algorithm:** bcrypt (Blowfish-based)

### Generate Password Hash

Jika Anda perlu membuat hash password baru:

```bash
# Masuk ke folder backend
cd backend

# Install dependencies jika belum
npm install

# Generate hash untuk password tertentu
node scripts/generate-hash.js "password_anda"

# Atau untuk password default
node scripts/generate-hash.js admin123
```

Output akan menampilkan hash yang bisa digunakan di database.

## Mengubah Password Admin

### Cara 1: Melalui Database (Manual)

```sql
-- Generate hash terlebih dahulu menggunakan script di atas
-- Kemudian update di database

UPDATE users 
SET password = '$2a$10$YOUR_NEW_HASH_HERE' 
WHERE username = 'admin';
```

### Cara 2: Melalui API (Recommended)

Buat endpoint baru atau gunakan MySQL client untuk update password yang sudah di-hash.

## Best Practices

### 1. Password Policy
- Minimal 8 karakter
- Kombinasi huruf besar, kecil, angka, dan simbol
- Tidak menggunakan kata yang mudah ditebak
- Ubah password secara berkala

### 2. JWT Secret
File `.env` berisi `JWT_SECRET` yang digunakan untuk signing token:

```env
JWT_SECRET=iware_secret_key_2024
```

⚠️ **Untuk Production:**
- Gunakan string random yang panjang (minimal 32 karakter)
- Jangan commit JWT_SECRET ke repository
- Simpan di environment variables server

Generate JWT Secret yang aman:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Database Security
- Gunakan user database dengan privilege terbatas
- Jangan gunakan root user untuk aplikasi
- Aktifkan SSL/TLS untuk koneksi database
- Backup database secara berkala

### 4. File Upload Security
- Validasi tipe file (hanya gambar dan PDF)
- Batasi ukuran file (max 5MB)
- Scan file untuk malware jika memungkinkan
- Simpan file di luar document root jika memungkinkan

### 5. Environment Variables
Jangan pernah commit file `.env` ke repository. Gunakan `.env.example`:

```env
# .env.example
PORT=5000
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=iware_perizinan
JWT_SECRET=your_very_long_random_secret_key_here
```

### 6. HTTPS
Untuk production, selalu gunakan HTTPS:
- Dapatkan SSL certificate (Let's Encrypt gratis)
- Redirect semua HTTP ke HTTPS
- Set secure flag pada cookies

### 7. Rate Limiting
Implementasi rate limiting untuk mencegah brute force:

```javascript
// Contoh dengan express-rate-limit
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 5, // maksimal 5 request
  message: 'Terlalu banyak percobaan login, coba lagi nanti'
});

app.post('/api/auth/login', loginLimiter, loginHandler);
```

### 8. Input Validation
- Validasi semua input di backend
- Gunakan prepared statements untuk SQL (sudah diimplementasi)
- Sanitize input untuk mencegah XSS
- Validasi tipe data dan format

### 9. CORS Configuration
Untuk production, batasi CORS hanya untuk domain yang diizinkan:

```javascript
const cors = require('cors');

app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true
}));
```

### 10. Logging & Monitoring
- Log semua aktivitas penting (login, perubahan data)
- Monitor failed login attempts
- Set up alerts untuk aktivitas mencurigakan
- Jangan log password atau data sensitif

## Security Checklist untuk Production

- [ ] Ubah password default admin
- [ ] Generate JWT_SECRET yang kuat
- [ ] Gunakan HTTPS
- [ ] Batasi CORS ke domain spesifik
- [ ] Implementasi rate limiting
- [ ] Setup database user dengan privilege minimal
- [ ] Aktifkan firewall
- [ ] Update dependencies secara berkala
- [ ] Backup database otomatis
- [ ] Setup monitoring & logging
- [ ] Scan vulnerabilities dengan npm audit
- [ ] Review dan update security policy

## Vulnerability Reporting

Jika menemukan security issue, segera laporkan ke tim IT IWARE.

## Audit Log

Pertimbangkan untuk menambahkan tabel audit log:

```sql
CREATE TABLE audit_log (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  action VARCHAR(50),
  table_name VARCHAR(50),
  record_id INT,
  old_value TEXT,
  new_value TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

**Last Updated:** 2024
**Maintained by:** IWARE IT Team
