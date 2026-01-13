import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { FiClock, FiCalendar, FiCheckCircle, FiArrowRight } from 'react-icons/fi';

const Home = () => {
  const [gambarSaatIni, setGambarSaatIni] = useState(1);
  const gambar = [1, 2, 4, 5];

  useEffect(() => {
    const interval = setInterval(() => {
      setGambarSaatIni((prev) => (prev % 5) + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fitur = [
    {
      ikon: <FiClock className="text-4xl" />,
      judul: 'Cepat & Mudah',
      deskripsi: 'Ajukan perizinan cuti atau lembur dengan cepat dan mudah'
    },
    {
      ikon: <FiCalendar className="text-4xl" />,
      judul: 'Fleksibel',
      deskripsi: 'Atur jadwal cuti atau lembur sesuai kebutuhan Anda'
    },
    {
      ikon: <FiCheckCircle className="text-4xl" />,
      judul: 'Transparan',
      deskripsi: 'Pantau status pengajuan Anda secara real-time'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      {/* Bagian Hero */}
      <section className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
                Sistem Perizinan
                <span className="text-primary-600"> Cuti & Lembur</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Kelola pengajuan cuti dan lembur dengan mudah, cepat, dan efisien. 
                Sistem terintegrasi untuk kemudahan manajemen SDM.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/ajukan">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 px-8 py-4 bg-primary-600 text-white rounded-lg text-lg font-semibold hover:bg-primary-700 transition shadow-lg"
                  >
                    <span>Ajukan Sekarang</span>
                    <FiArrowRight />
                  </motion.button>
                </Link>
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 border-2 border-primary-600 text-primary-600 rounded-lg text-lg font-semibold hover:bg-primary-50 transition"
                  >
                    Login Staff
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative h-96 rounded-2xl overflow-hidden shadow-2xl"
            >
              {gambar.map((num) => (
                <img
                  key={num}
                  src={`/img/${num}.jpeg`}
                  alt={`Perusahaan IWARE ${num}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                    gambarSaatIni === num ? 'opacity-100' : 'opacity-0'
                  }`}
                  onError={(e) => {
                    e.target.onerror = null; // Mencegah loop tak terbatas
                    e.target.style.display = 'none';
                  }}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bagian Fitur */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center text-gray-800 mb-12"
          >
            Mengapa Memilih Kami?
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {fitur.map((item, indeks) => (
              <motion.div
                key={indeks}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: indeks * 0.2 }}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition"
              >
                <div className="text-primary-600 mb-4">{item.ikon}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{item.judul}</h3>
                <p className="text-gray-600">{item.deskripsi}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bagian Ajakan */}
      <section className="py-16 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-gradient-to-r from-primary-600 to-indigo-600 rounded-2xl p-12 text-center shadow-2xl"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Siap Mengajukan Perizinan?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Proses cepat dan mudah, hanya butuh beberapa menit
          </p>
          <Link to="/ajukan">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-white text-primary-600 rounded-lg text-lg font-bold hover:bg-gray-100 transition shadow-lg"
            >
              Mulai Pengajuan
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p>&copy; 2026 IWARE. Hak Cipta Dilindungi.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
