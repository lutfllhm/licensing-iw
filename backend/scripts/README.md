# Backend Scripts - Password Management & Railway Deployment

Folder ini berisi utility scripts untuk manajemen password, security, dan deployment ke Railway.

## 🚀 Railway Deployment Scripts

### test-railway-mysql.js
Test koneksi ke Railway MySQL database.

**Usage:**
```bash
# 1. Isi kredensial Railway di .env.railway.local
# 2. Run test
node backend/scripts/test-railway-mysql.js
```

**Output:**
```
✅ Connected to MySQL server!
✅ Available databases: railway, information_schema, ...
✅ Using database: railway
✅ Existing tables: users, pengajuan, ...
```

### init-railway-db.js
Initialize database Railway dengan schema dan data awal.

**Usage:**
```bash
# Via Railway CLI
railway run node backend/scripts/init-railway-db.js

# Atau set environment variables manual
node backend/scripts/init-railway-db.js
```

### import-to-railway.js
Import data dari database lokal ke Railway.

**Usage:**
```bash
# 1. Export database lokal
mysqldump -u root -p iware_perizinan > backup.sql

# 2. Import ke Railway
node backend/scripts/import-to-railway.js
```

## 🔐 Password Management Scripts

### 1. generate-hash.js
Generate bcrypt hash untuk password baru.

**Usage:**
```bash
# Generate hash untuk password default (admin123)
node backend/scripts/generate-hash.js

# Generate hash untuk password custom
node backend/scripts/generate-hash.js "password_anda"
```

**Output:**
```
Generating bcrypt hash...

Password: admin123
Hash: $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi

✅ Copy hash di atas untuk digunakan di database

Contoh SQL:
INSERT INTO users (username, password, nama, role) VALUES ('username', '$2a$10$...', 'Nama User', 'hrd');
```

### 2. verify-password.js
Verify apakah password cocok dengan hash bcrypt.

**Usage:**
```bash
# Verify password default
node backend/scripts/verify-password.js

# Verify password custom dengan hash
node backend/scripts/verify-password.js "password" "$2a$10$hash..."
```

**Output:**
```
Verifying password...

Password: admin123
Hash: $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi

✅ Password MATCH! Hash is correct.
```

## Password Hash Information

### Default Admin Password
- **Plain Text:** `admin123`
- **Bcrypt Hash:** `$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi`
- **Salt Rounds:** 10

### Bcrypt Details
- **Algorithm:** Blowfish-based
- **Cost Factor:** 10 (2^10 = 1,024 iterations)
- **Hash Length:** 60 characters
- **Format:** `$2a$[cost]$[22 character salt][31 character hash]`

## Common Tasks

### Membuat User HRD Baru via Database

1. Generate hash untuk password:
```bash
node backend/scripts/generate-hash.js "password_hrd"
```

2. Insert ke database:
```sql
INSERT INTO users (username, password, nama, role) 
VALUES ('hrd_user', '$2a$10$HASH_DARI_STEP_1', 'Nama HRD', 'hrd');
```

### Reset Password Admin

1. Generate hash baru:
```bash
node backend/scripts/generate-hash.js "password_baru"
```

2. Update di database:
```sql
UPDATE users 
SET password = '$2a$10$HASH_DARI_STEP_1' 
WHERE username = 'admin';
```

### Verify Password Hash

Untuk memastikan hash yang dibuat benar:
```bash
node backend/scripts/verify-password.js "password_asli" "$2a$10$hash..."
```

## Security Notes

⚠️ **PENTING:**
- Jangan pernah simpan password dalam plain text
- Selalu gunakan bcrypt untuk hashing password
- Gunakan salt rounds minimal 10
- Jangan commit password atau hash ke repository public
- Ubah password default setelah instalasi

## Troubleshooting

### Error: Cannot find module 'bcryptjs'
```bash
cd backend
npm install
```

### Hash tidak cocok saat login
1. Verify hash dengan script verify-password.js
2. Pastikan tidak ada spasi atau karakter tambahan
3. Regenerate hash jika perlu

### Password terlalu pendek
Bcrypt bisa handle password hingga 72 bytes. Untuk password lebih panjang, pertimbangkan pre-hash dengan SHA-256.

## References

- [bcrypt npm package](https://www.npmjs.com/package/bcryptjs)
- [bcrypt algorithm](https://en.wikipedia.org/wiki/Bcrypt)
- [OWASP Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)

---
© 2024 IWARE IT Team
