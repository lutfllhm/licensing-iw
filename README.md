# Aplikasi Perizinan Cuti/Lembur IWARE

Aplikasi web modern untuk mengelola perizinan cuti dan lembur dengan interface yang interaktif dan responsif.

## 🚀 Quick Start

### Development Local

```bash
# Install dependencies
npm run install:all

# Jalankan development server
npm run dev
```

### Deployment

Aplikasi ini siap di-deploy ke Railway atau Vercel. Ikuti panduan berikut:

1. **Quick Deploy**: Baca [QUICK-DEPLOY.md](./QUICK-DEPLOY.md) untuk checklist cepat
2. **Detailed Guide**: Baca [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md) untuk panduan lengkap
3. **Check Readiness**: Jalankan `node check-deployment-ready.js` untuk verifikasi
4. **Deploy Helper**: Jalankan `node deploy-helper.js` untuk generate JWT secret

## 📁 Struktur Project

```
iware-perizinan/
├── backend/              # Node.js + Express API
│   ├── config/          # Database & configuration
│   ├── middleware/      # Authentication middleware
│   ├── routes/          # API routes
│   ├── scripts/         # Helper scripts
│   └── server.js        # Main server file
├── frontend/            # React application
│   ├── public/          # Static files
│   └── src/             # React components
├── DEPLOYMENT-GUIDE.md  # Panduan deployment lengkap
├── QUICK-DEPLOY.md      # Checklist deployment cepat
└── deploy-helper.js     # Script helper deployment
```

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express
- MySQL
- JWT Authentication
- bcryptjs untuk password hashing

**Frontend:**
- React 18
- React Router v6
- Axios
- Tailwind CSS
- Framer Motion
- Recharts

## 📦 Deployment Platforms

- **Backend + Database**: Railway
- **Frontend**: Railway atau Vercel
- **Database**: MySQL (Railway)

## 🔐 Default Credentials

Setelah deployment, login dengan:
- Username: `admin`
- Password: `admin123`

**⚠️ PENTING**: Segera ganti password setelah login pertama!

## 📚 Documentation

- [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md) - Panduan deployment lengkap
- [QUICK-DEPLOY.md](./QUICK-DEPLOY.md) - Checklist deployment cepat
- [backend/scripts/README.md](./backend/scripts/README.md) - Dokumentasi helper scripts
- [backend/SECURITY.md](./backend/SECURITY.md) - Security best practices

## 🧪 Testing

```bash
# Check deployment readiness
node check-deployment-ready.js

# Generate JWT secret
node deploy-helper.js

# Test backend health
curl https://your-backend-url/api/health

# Test login
curl -X POST https://your-backend-url/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## Lisensi

© 2024 IWARE. All rights reserved.
