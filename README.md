# 🏢 Aplikasi Perizinan Cuti/Lembur IWARE

Aplikasi web modern untuk mengelola perizinan cuti dan lembur dengan interface yang interaktif dan responsif.

## 🚀 Deploy ke Railway

### 🎯 **[START HERE - Panduan Deployment](./START_HERE.md)** ⭐

### 📚 Dokumentasi Lengkap

- **[Tutorial Deploy Railway - Lengkap](./DEPLOY_RAILWAY.md)** - Panduan step-by-step dari awal hingga akhir
- **[Quick Start (5 Menit)](./QUICK_START_RAILWAY.md)** - Deploy cepat dalam 5 menit
- **[Visual Guide](./VISUAL_GUIDE.md)** - Panduan visual dengan diagram
- **[Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)** - Checklist lengkap untuk deployment
- **[Environment Variables](./RAILWAY_VARIABLES.md)** - Panduan setting environment variables
- **[Architecture Diagram](./ARCHITECTURE.md)** - Diagram arsitektur dan flow aplikasi
- **[Troubleshooting](./TROUBLESHOOTING.md)** - Solusi masalah umum
- **[Docs Index](./DOCS_INDEX.md)** - Index lengkap dokumentasi

### ⚡ Quick Start

```bash
# 1. Push ke GitHub
git add .
git commit -m "Ready for Railway deployment"
git push origin main

# 2. Buka Railway Dashboard
# https://railway.app

# 3. Deploy (ikuti QUICK_START_RAILWAY.md)
# - Provision MySQL
# - Deploy Backend
# - Deploy Frontend
# - Set Environment Variables

# 4. Test deployment
npm run deploy-check --prefix backend
```

## 💻 Development Local

```bash
# Install dependencies
npm run install:all

# Setup database lokal
# Import: backend/config/init-db.sql ke MySQL

# Jalankan development server
npm run dev
```

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

### Railway Deployment
- **[DEPLOY_RAILWAY.md](./DEPLOY_RAILWAY.md)** - Tutorial lengkap deploy ke Railway
- **[QUICK_START_RAILWAY.md](./QUICK_START_RAILWAY.md)** - Quick start 5 menit
- **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Checklist deployment
- **[RAILWAY_VARIABLES.md](./RAILWAY_VARIABLES.md)** - Environment variables guide
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Architecture & flow diagram
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Troubleshooting guide

### Project Documentation
- **[backend/scripts/README.md](./backend/scripts/README.md)** - Helper scripts
- **[backend/SECURITY.md](./backend/SECURITY.md)** - Security best practices

## 🧪 Testing

```bash
# Check deployment readiness
cd backend
npm run deploy-check

# Generate JWT secret
node scripts/generate-jwt-secret.js

# Test backend health (production)
curl https://your-backend-url.railway.app/api/health

# Test login (production)
curl -X POST https://your-backend-url.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Test database connection (via Railway CLI)
railway connect mysql
```

## 🔧 Helper Scripts

```bash
# Backend scripts
cd backend

# Initialize database
npm run init-db

# Check deployment readiness
npm run deploy-check

# Generate JWT secret
node scripts/generate-jwt-secret.js

# Create admin user
node scripts/create-admin.js

# Debug login
node scripts/debug-login.js

# Test Railway connection
node scripts/test-railway-connection.js
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## Lisensi

© 2024 IWARE. All rights reserved.
