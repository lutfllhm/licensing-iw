const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../config/database');
const { auth, isHRD } = require('../middleware/auth');

// Konfigurasi multer untuk upload file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Buat nama file unik dengan timestamp
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Maksimal 5MB
  fileFilter: (req, file, cb) => {
    // Hanya izinkan file gambar dan PDF
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Hanya file gambar atau PDF yang diizinkan!');
    }
  }
});

// Kirim pengajuan baru (publik - tidak perlu login)
router.post('/submit', upload.single('bukti_foto'), async (req, res) => {
  try {
    const { nama, no_telp, jenis_perizinan, tanggal_mulai, tanggal_selesai } = req.body;
    const bukti_foto = req.file ? req.file.filename : null;
    
    await db.query(
      'INSERT INTO pengajuan (nama, no_telp, jenis_perizinan, tanggal_mulai, tanggal_selesai, bukti_foto) VALUES (?, ?, ?, ?, ?, ?)',
      [nama, no_telp, jenis_perizinan, tanggal_mulai, tanggal_selesai, bukti_foto]
    );
    
    res.status(201).json({ message: 'Pengajuan berhasil dikirim' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
  }
});

// Ambil semua pengajuan (hanya HRD dan Admin)
router.get('/', auth, isHRD, async (req, res) => {
  try {
    const [pengajuan] = await db.query('SELECT * FROM pengajuan ORDER BY created_at DESC');
    res.json(pengajuan);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
  }
});

// Update status pengajuan (hanya HRD dan Admin)
router.put('/:id', auth, isHRD, async (req, res) => {
  try {
    const { status, catatan } = req.body;
    
    await db.query(
      'UPDATE pengajuan SET status = ?, catatan = ? WHERE id = ?',
      [status, catatan, req.params.id]
    );
    
    res.json({ message: 'Status pengajuan berhasil diupdate' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
  }
});

// Hapus pengajuan (hanya HRD dan Admin)
router.delete('/:id', auth, isHRD, async (req, res) => {
  try {
    await db.query('DELETE FROM pengajuan WHERE id = ?', [req.params.id]);
    res.json({ message: 'Pengajuan berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
  }
});

// Ambil statistik dashboard (hanya HRD dan Admin)
router.get('/stats/dashboard', auth, isHRD, async (req, res) => {
  try {
    // Hitung total pengajuan
    const [total] = await db.query('SELECT COUNT(*) as total FROM pengajuan');
    const [pending] = await db.query('SELECT COUNT(*) as pending FROM pengajuan WHERE status = "pending"');
    const [approved] = await db.query('SELECT COUNT(*) as approved FROM pengajuan WHERE status = "approved"');
    const [rejected] = await db.query('SELECT COUNT(*) as rejected FROM pengajuan WHERE status = "rejected"');
    
    // Statistik berdasarkan jenis perizinan
    const [byType] = await db.query(`
      SELECT jenis_perizinan, COUNT(*) as jumlah 
      FROM pengajuan 
      GROUP BY jenis_perizinan
    `);
    
    // Statistik berdasarkan bulan (12 bulan terakhir)
    const [byMonth] = await db.query(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as bulan,
        COUNT(*) as jumlah
      FROM pengajuan
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY bulan
    `);
    
    res.json({
      total: total[0].total,
      pending: pending[0].pending,
      approved: approved[0].approved,
      rejected: rejected[0].rejected,
      byType,
      byMonth
    });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
  }
});

// Ambil laporan pengajuan dengan filter (hanya HRD dan Admin)
router.get('/report', auth, isHRD, async (req, res) => {
  try {
    const { bulan, tahun } = req.query;
    
    let query = 'SELECT * FROM pengajuan WHERE 1=1';
    const params = [];
    
    // Filter berdasarkan bulan dan tahun jika ada
    if (bulan && tahun) {
      query += ' AND MONTH(created_at) = ? AND YEAR(created_at) = ?';
      params.push(bulan, tahun);
    } else if (tahun) {
      query += ' AND YEAR(created_at) = ?';
      params.push(tahun);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const [report] = await db.query(query, params);
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
  }
});

module.exports = router;
