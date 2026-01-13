import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authAPI } from '../utils/api';
import { FiUser, FiLock, FiLogIn } from 'react-icons/fi';

const Login = () => {
  const [dataForm, setDataForm] = useState({ username: '', password: '' });
  const [sedangMemuat, setSedangMemuat] = useState(false);
  const navigasi = useNavigate();

  const tanganiSubmit = async (e) => {
    e.preventDefault();
    setSedangMemuat(true);

    try {
      const respons = await authAPI.login(dataForm);
      const { token, user } = respons.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);
      localStorage.setItem('username', user.username);
      localStorage.setItem('nama', user.nama);

      toast.success(`Selamat datang, ${user.nama}!`);

      if (user.role === 'admin') {
        navigasi('/admin');
      } else {
        navigasi('/hrd');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login gagal');
    } finally {
      setSedangMemuat(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="inline-block p-4 bg-primary-100 rounded-full mb-4"
            >
              <FiLogIn className="text-4xl text-primary-600" />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800">Login</h2>
            <p className="text-gray-600 mt-2">Masuk ke dashboard Anda</p>
          </div>

          <form onSubmit={tanganiSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  required
                  value={dataForm.username}
                  onChange={(e) => setDataForm({ ...dataForm, username: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  placeholder="Masukkan username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  value={dataForm.password}
                  onChange={(e) => setDataForm({ ...dataForm, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  placeholder="Masukkan password"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={sedangMemuat}
              className="w-full py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sedangMemuat ? 'Memproses...' : 'Login'}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="text-primary-600 hover:text-primary-700 transition">
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
