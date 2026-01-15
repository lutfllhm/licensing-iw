# 🏗️ Architecture & Flow Diagram

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        RAILWAY CLOUD                         │
│                                                              │
│  ┌────────────────┐      ┌────────────────┐      ┌────────┐│
│  │   Frontend     │      │    Backend     │      │ MySQL  ││
│  │   (React)      │◄────►│   (Express)    │◄────►│   DB   ││
│  │                │      │                │      │        ││
│  │  Port: 3000    │      │  Port: 5000    │      │ Port:  ││
│  │                │      │                │      │  3306  ││
│  └────────────────┘      └────────────────┘      └────────┘│
│         │                        │                     │    │
│         │                        │                     │    │
│  frontend-xxx.          backend-xxx.            Managed by  │
│  railway.app            railway.app              Railway    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
         │                        │                     │
         │                        │                     │
         ▼                        ▼                     ▼
    User Browser              API Requests          Data Storage
```

---

## 🔄 Data Flow

### 1. User Login Flow
```
User (Browser)
    │
    │ 1. Enter credentials
    ▼
Frontend (React)
    │
    │ 2. POST /api/auth/login
    │    { username, password }
    ▼
Backend (Express)
    │
    │ 3. Verify credentials
    │    bcrypt.compare()
    ▼
MySQL Database
    │
    │ 4. Query user table
    │    SELECT * FROM users WHERE username=?
    ▼
Backend (Express)
    │
    │ 5. Generate JWT token
    │    jwt.sign({ userId, role })
    ▼
Frontend (React)
    │
    │ 6. Store token in localStorage
    │    Redirect to dashboard
    ▼
User sees Dashboard
```

### 2. CRUD Operations Flow
```
User Action (Create/Read/Update/Delete)
    │
    ▼
Frontend Component
    │
    │ axios.post/get/put/delete
    │ Headers: { Authorization: Bearer <token> }
    ▼
Backend API Route
    │
    │ Middleware: auth.js
    │ Verify JWT token
    ▼
Backend Controller
    │
    │ Business logic
    │ Validation
    ▼
MySQL Database
    │
    │ Execute SQL query
    │ INSERT/SELECT/UPDATE/DELETE
    ▼
Backend Response
    │
    │ JSON response
    │ { status, data, message }
    ▼
Frontend Update
    │
    │ Update state
    │ Re-render component
    ▼
User sees updated UI
```

---

## 🔐 Authentication Flow

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       │ 1. Login Request
       │    POST /api/auth/login
       │    { username, password }
       ▼
┌─────────────────────────────────────┐
│          Backend Server             │
│                                     │
│  ┌──────────────────────────────┐  │
│  │   Auth Route                 │  │
│  │   /api/auth/login            │  │
│  └────────────┬─────────────────┘  │
│               │                     │
│               │ 2. Hash & Compare   │
│               ▼                     │
│  ┌──────────────────────────────┐  │
│  │   bcryptjs                   │  │
│  │   compare(password, hash)    │  │
│  └────────────┬─────────────────┘  │
│               │                     │
│               │ 3. Query User       │
│               ▼                     │
│  ┌──────────────────────────────┐  │
│  │   MySQL Database             │  │
│  │   SELECT * FROM users        │  │
│  └────────────┬─────────────────┘  │
│               │                     │
│               │ 4. Generate Token   │
│               ▼                     │
│  ┌──────────────────────────────┐  │
│  │   jsonwebtoken               │  │
│  │   jwt.sign({ id, role })     │  │
│  └────────────┬─────────────────┘  │
│               │                     │
└───────────────┼─────────────────────┘
                │
                │ 5. Return Token
                │    { token, user }
                ▼
       ┌─────────────┐
       │   Browser   │
       │             │
       │  Store in   │
       │ localStorage│
       └─────────────┘
```

---

## 🌐 Network Architecture

### Development (Local)
```
localhost:3000 (Frontend)
    │
    │ REACT_APP_API_URL=http://localhost:5000/api
    ▼
localhost:5000 (Backend)
    │
    │ DB_HOST=localhost
    │ DB_PORT=3306
    ▼
localhost:3306 (MySQL)
```

### Production (Railway)
```
frontend-xxx.railway.app (Frontend)
    │
    │ REACT_APP_API_URL=https://backend-xxx.railway.app/api
    │ CORS: Allowed by FRONTEND_URL
    ▼
backend-xxx.railway.app (Backend)
    │
    │ MYSQL_URL=mysql://user:pass@host:port/db
    │ Connection Pool (max 10)
    ▼
Railway MySQL (Internal Network)
    │
    │ Private Network
    │ Auto-managed by Railway
    ▼
Persistent Storage
```

---

## 📁 Project Structure

```
project-root/
│
├── backend/                    # Backend Service
│   ├── config/
│   │   ├── database.js        # MySQL connection pool
│   │   ├── init-db.sql        # Database schema
│   │   └── reset-admin.sql    # Reset admin script
│   │
│   ├── middleware/
│   │   └── auth.js            # JWT authentication
│   │
│   ├── routes/
│   │   ├── auth.js            # Auth endpoints
│   │   └── pengajuan.js       # CRUD endpoints
│   │
│   ├── scripts/
│   │   ├── init-railway-db.js # DB initialization
│   │   └── railway-deploy-check.js # Pre-deploy check
│   │
│   ├── uploads/               # File uploads (use cloud in prod)
│   │
│   ├── .env                   # Local environment (gitignored)
│   ├── .env.example           # Environment template
│   ├── railway.toml           # Railway config
│   ├── nixpacks.toml          # Build config
│   ├── package.json           # Dependencies
│   └── server.js              # Entry point
│
├── frontend/                  # Frontend Service
│   ├── public/
│   │   └── index.html
│   │
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── App.js             # Main app
│   │   └── index.js           # Entry point
│   │
│   ├── .env                   # Local environment (gitignored)
│   ├── .env.example           # Environment template
│   ├── railway.toml           # Railway config
│   ├── nixpacks.toml          # Build config
│   └── package.json           # Dependencies
│
├── .railwayignore             # Files to ignore in deployment
├── DEPLOY_RAILWAY.md          # Full deployment guide
├── QUICK_START_RAILWAY.md     # Quick start guide
├── RAILWAY_VARIABLES.md       # Environment variables guide
├── DEPLOYMENT_CHECKLIST.md    # Deployment checklist
└── ARCHITECTURE.md            # This file
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/login          # User login
POST   /api/auth/register       # User registration (if enabled)
GET    /api/auth/me             # Get current user
POST   /api/auth/logout         # User logout
```

### Pengajuan (Submissions)
```
GET    /api/pengajuan           # Get all submissions
GET    /api/pengajuan/:id       # Get single submission
POST   /api/pengajuan           # Create submission
PUT    /api/pengajuan/:id       # Update submission
DELETE /api/pengajuan/:id       # Delete submission
```

### Health Check
```
GET    /api/health              # Server health check
```

---

## 🔒 Security Layers

```
┌─────────────────────────────────────────┐
│         Security Layers                 │
├─────────────────────────────────────────┤
│                                         │
│  1. HTTPS (Railway SSL)                 │
│     └─ All traffic encrypted            │
│                                         │
│  2. CORS (Backend)                      │
│     └─ Only allowed origins             │
│                                         │
│  3. JWT Authentication                  │
│     └─ Token-based auth                 │
│                                         │
│  4. Password Hashing (bcrypt)           │
│     └─ Passwords never stored plain     │
│                                         │
│  5. Environment Variables               │
│     └─ Secrets not in code              │
│                                         │
│  6. Input Validation                    │
│     └─ Sanitize user input              │
│                                         │
│  7. SQL Injection Prevention            │
│     └─ Parameterized queries            │
│                                         │
│  8. Rate Limiting (optional)            │
│     └─ Prevent abuse                    │
│                                         │
└─────────────────────────────────────────┘
```

---

## 📊 Database Schema

```sql
┌─────────────────────────────────────────┐
│              users                      │
├─────────────────────────────────────────┤
│ id (PK)          INT AUTO_INCREMENT     │
│ username         VARCHAR(50) UNIQUE     │
│ password         VARCHAR(255)           │
│ nama_lengkap     VARCHAR(100)           │
│ email            VARCHAR(100)           │
│ role             ENUM('admin','user')   │
│ created_at       TIMESTAMP              │
└─────────────────────────────────────────┘
                    │
                    │ 1:N
                    ▼
┌─────────────────────────────────────────┐
│           pengajuan                     │
├─────────────────────────────────────────┤
│ id (PK)          INT AUTO_INCREMENT     │
│ user_id (FK)     INT                    │
│ jenis_izin       VARCHAR(100)           │
│ tanggal_mulai    DATE                   │
│ tanggal_selesai  DATE                   │
│ keterangan       TEXT                   │
│ status           ENUM('pending',...)    │
│ dokumen          VARCHAR(255)           │
│ created_at       TIMESTAMP              │
│ updated_at       TIMESTAMP              │
└─────────────────────────────────────────┘
```

---

## 🚀 Deployment Pipeline

```
┌──────────────┐
│   GitHub     │
│  Repository  │
└──────┬───────┘
       │
       │ git push
       ▼
┌──────────────────────────────────┐
│      Railway Platform            │
│                                  │
│  ┌────────────────────────────┐ │
│  │  1. Detect Changes         │ │
│  │     (GitHub webhook)       │ │
│  └────────────┬───────────────┘ │
│               │                  │
│               ▼                  │
│  ┌────────────────────────────┐ │
│  │  2. Build Phase            │ │
│  │     - npm install          │ │
│  │     - npm run build (FE)   │ │
│  └────────────┬───────────────┘ │
│               │                  │
│               ▼                  │
│  ┌────────────────────────────┐ │
│  │  3. Deploy Phase           │ │
│  │     - Start containers     │ │
│  │     - Inject env vars      │ │
│  │     - Health check         │ │
│  └────────────┬───────────────┘ │
│               │                  │
│               ▼                  │
│  ┌────────────────────────────┐ │
│  │  4. Live                   │ │
│  │     - Service running      │ │
│  │     - Domain active        │ │
│  └────────────────────────────┘ │
│                                  │
└──────────────────────────────────┘
       │
       │ Access via
       ▼
┌──────────────┐
│    Users     │
└──────────────┘
```

---

## 💾 Data Persistence

```
┌─────────────────────────────────────────┐
│         Data Storage Strategy           │
├─────────────────────────────────────────┤
│                                         │
│  Database (MySQL)                       │
│  ├─ User data                           │
│  ├─ Submissions                         │
│  └─ Persistent across deploys           │
│                                         │
│  File Uploads (Local - Dev only)        │
│  ├─ backend/uploads/                    │
│  └─ NOT persistent on Railway           │
│                                         │
│  Recommended for Production:            │
│  ├─ AWS S3                              │
│  ├─ Cloudinary                          │
│  ├─ Railway Volumes (paid)              │
│  └─ Google Cloud Storage                │
│                                         │
└─────────────────────────────────────────┘
```

---

## 📈 Scaling Strategy

```
Current Setup (Free Tier):
┌────────────────────────────────┐
│  Frontend: 1 instance          │
│  Backend: 1 instance           │
│  MySQL: 1 instance             │
└────────────────────────────────┘

Future Scaling (If needed):
┌────────────────────────────────┐
│  Frontend: Multiple instances  │
│  Backend: Horizontal scaling   │
│  MySQL: Vertical scaling       │
│  + Redis for caching           │
│  + CDN for static assets       │
│  + Load balancer              │
└────────────────────────────────┘
```

---

## 🔍 Monitoring Points

```
Frontend Monitoring:
├─ Page load time
├─ API response time
├─ Error rate
├─ User sessions
└─ Browser console errors

Backend Monitoring:
├─ Request rate
├─ Response time
├─ Error rate
├─ CPU usage
├─ Memory usage
└─ Database query time

Database Monitoring:
├─ Connection pool usage
├─ Query performance
├─ Storage usage
├─ Slow queries
└─ Connection errors
```

---

**Last Updated:** ${new Date().toISOString()}
**Version:** 1.0.0
