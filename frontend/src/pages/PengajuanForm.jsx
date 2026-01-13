import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { pengajuanAPI } from '../utils/api';
import { FiUser, FiPhone, FiCalendar, FiUpload, FiSend } from 'react-icons/fi';

const PengajuanForm = () => {
  const navigasi = useNavigate();
  const [sedangMemuat, setSedangMemuat] = useState(false);
  const [dataForm, setDataForm] = useState({
    nama: '',
    no_telp: '',
    jenis_perizinan: 'cuti',
    tanggal_mulai: '',
    tanggal_selesai: '',
    bukti_foto: null
  });

  const jenisPerizinan = ['cuti', 'lembur', 'sakit', 'lainnya'];

  const tanganiPerubahanFile = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB');
      return;
    }
    setDataForm({ ...dataForm, bukti_foto: file });
  };

  const tanganiSubmit = async (e) => {
    e.preventDefault();
    setSedangMemuat(true);

    const data = new FormData();
    Object.keys(dataForm).forEach(kunci => {
      if (dataForm[kunci]) {
        data.append(kunci, dataForm[kunci]);
      }
    });

    try {
      await pengajuanAPI.submit(data);
      toast.success('Pengajuan berhasil dikirim! Silakan tunggu konfirmasi dari HRD.');
      navigasi('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mengirim pengajuan');
    } finally {
      setSedangMemuat(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Form Pengajuan</h2>
            <p className="text-gray-600 mt-2">Isi formulir di bawah ini dengan lengkap</p>
          </div>

          <form onSubmit={tanganiSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiUser className="inline mr-2" />
                Nama Lengkap
              </label>
              <input
                type="text"
                required
                value={dataForm.nama}
                onChange={(e) => setDataForm({ ...dataForm, nama: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                placeholder="Masukkan nama lengkap"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiPhone className="inline mr-2" />
                No. Telp/WhatsApp
              </label>
              <input
                type="tel"
                required
                value={dataForm.no_telp}
                onChange={(e) => setDataForm({ ...dataForm, no_telp: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                placeholder="08xxxxxxxxxx"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jenis Perizinan
              </label>
              <select
                value={dataForm.jenis_perizinan}
                onChange={(e) => setDataForm({ ...dataForm, jenis_perizinan: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              >
                {jenisPerizinan.map(jenis => (
                  <option key={jenis} value={jenis}>
                    {jenis.charAt(0).toUpperCase() + jenis.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiCalendar className="inline mr-2" />
                  Tanggal & Jam Mulai
                </label>
                <input
                  type="datetime-local"
                  required
                  value={dataForm.tanggal_mulai}
                  onChange={(e) => setDataForm({ ...dataForm, tanggal_mulai: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiCalendar className="inline mr-2" />
                  Tanggal & Jam Selesai
                </label>
                <input
                  type="datetime-local"
                  required
                  value={dataForm.tanggal_selesai}
                  onChange={(e) => setDataForm({ ...dataForm, tanggal_selesai: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiUpload className="inline mr-2" />
                Bukti Foto (Opsional)
              </label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={tanganiPerubahanFile}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />
              <p className="text-sm text-gray-500 mt-1">Format: JPG, PNG, PDF (Maks 5MB)</p>
            </div>

            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={sedangMemuat}
                className="flex-1 flex items-center justify-center space-x-2 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
              >
                <FiSend />
                <span>{sedangMemuat ? 'Mengirim...' : 'Kirim Pengajuan'}</span>
              </motion.button>

              <Link to="/" className="flex-1">
                <button
                  type="button"
                  className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Batal
                </button>
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default PengajuanForm;
