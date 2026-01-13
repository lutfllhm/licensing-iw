# Changelog - Aplikasi Perizinan IWARE

## [1.0.0] - 2024-01-12

### ✨ Initial Release

#### Features
- ✅ Sistem perizinan cuti/lembur berbasis web
- ✅ Role-based access control (Admin & HRD)
- ✅ Dashboard interaktif dengan grafik
- ✅ Form pengajuan public
- ✅ Upload bukti foto
- ✅ Approval system
- ✅ Report per bulan/tahun
- ✅ Responsive design
- ✅ Modern animations

#### Tech Stack
- **Backend:** Node.js + Express.js
- **Frontend:** React.js (JSX)
- **Database:** MySQL
- **Styling:** TailwindCSS
- **Animation:** Framer Motion
- **Charts:** Recharts

#### Security
- ✅ Password hashing dengan bcrypt (salt rounds: 10)
- ✅ JWT authentication
- ✅ Protected routes
- ✅ File upload validation
- ✅ SQL injection prevention (prepared statements)

#### Default Credentials
- **Username:** admin
- **Password:** admin123 (bcrypt hash: `$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi`)

#### Database
- **Name:** iware_perizinan
- **Tables:** users, pengajuan
- **Default admin:** Pre-seeded dengan password ter-hash

#### File Structure
```
iware-perizinan/
├── backend/
│   ├── config/
│   │   ├── database.js
│   │   └── init-db.sql (✅ dengan bcrypt hash)
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── pengajuan.js
│   ├── scripts/
│   │   ├── generate-hash.js (✅ NEW)
│   │   ├── verify-password.js (✅ NEW)
│   │   └── README.md (✅ NEW)
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   ├── server.js
│   └── SECURITY.md (✅ NEW)
├── frontend/
│   ├── public/
│   │   ├── img/ (untuk logo.png & 1-5.jpeg)
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx (✅ JSX)
│   │   │   └── PrivateRoute.jsx (✅ JSX)
│   │   ├── pages/
│   │   │   ├── Home.jsx (✅ JSX)
│   │   │   ├── Login.jsx (✅ JSX)
│   │   │   ├── PengajuanForm.jsx (✅ JSX)
│   │   │   ├── AdminDashboard.jsx (✅ JSX)
│   │   │   └── HRDDashboard.jsx (✅ JSX)
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx (✅ JSX)
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── tailwind.config.js
├── .gitignore (✅ Updated)
├── README.md
├── SETUP.md (✅ NEW)
├── CHANGELOG.md (✅ NEW)
├── CREDENTIALS.md (✅ NEW - gitignored)
└── CREDENTIALS.example.md (✅ NEW)
```

#### Documentation
- ✅ README.md - Overview & quick start
- ✅ SETUP.md - Detailed installation guide
- ✅ SECURITY.md - Security best practices
- ✅ CREDENTIALS.md - Default credentials (gitignored)
- ✅ CREDENTIALS.example.md - Template
- ✅ backend/scripts/README.md - Password management guide

#### Key Changes from Initial Setup

1. **Password Security**
   - ✅ Admin password di-hash dengan bcrypt
   - ✅ Hash: `$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi`
   - ✅ Script untuk generate & verify hash

2. **File Extensions**
   - ✅ Semua React components menggunakan `.jsx`
   - ✅ Import statements updated

3. **Branding**
   - ✅ Nama perusahaan: RBM → IWARE
   - ✅ Database: rbm_perizinan → iware_perizinan
   - ✅ Logo path: /img/logo.png
   - ✅ Company photos: /img/1-5.jpeg

4. **Security Enhancements**
   - ✅ Comprehensive security documentation
   - ✅ Password management scripts
   - ✅ .gitignore updated untuk credentials
   - ✅ Environment variables template

#### Known Issues
- None

#### TODO / Future Enhancements
- [ ] Change password feature di dashboard
- [ ] Email notifications
- [ ] Export report to PDF/Excel
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Mobile app
- [ ] Rate limiting
- [ ] Audit logging
- [ ] Two-factor authentication

#### Installation

See `SETUP.md` for detailed installation instructions.

Quick start:
```bash
# Database
mysql -u root -p < backend/config/init-db.sql

# Backend
cd backend && npm install && npm start

# Frontend
cd frontend && npm install && npm start
```

#### Support

For issues or questions, contact IWARE IT Team.

---

## Version History

### [1.0.0] - 2024-01-12
- Initial release with full features
- Bcrypt password hashing implemented
- JSX file extensions
- IWARE branding
- Comprehensive documentation

---

**Maintained by:** IWARE IT Team
**License:** © 2024 IWARE. All rights reserved.
