import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, ArrowLeft, AlertCircle, ShieldCheck } from 'lucide-react';
import { colors } from '../data';
import { supabase } from '../supabaseClient';

const AdminLogin = ({ onLoginSuccess, onBackToHome }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Map Supabase error messages to user-friendly Indonesian text
  const getErrorMessage = (error) => {
    const msg = error?.message?.toLowerCase() || '';
    if (msg.includes('invalid login credentials') || msg.includes('invalid_credentials')) {
      return 'Email atau Password yang Anda masukkan salah!';
    }
    if (msg.includes('email not confirmed')) {
      return 'Akun belum dikonfirmasi. Silakan hubungi administrator.';
    }
    if (msg.includes('too many requests') || msg.includes('rate limit')) {
      return 'Terlalu banyak percobaan login. Silakan coba lagi dalam beberapa menit.';
    }
    if (msg.includes('network') || msg.includes('fetch')) {
      return 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
    }
    return error?.message || 'Terjadi kesalahan. Silakan coba lagi.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!supabase) {
        throw new Error('Koneksi ke Supabase belum dikonfigurasi. Periksa file .env Anda.');
      }

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (authError) {
        throw authError;
      }

      // Login berhasil — session dikelola oleh Supabase & App.jsx listener
      if (onLoginSuccess) {
        onLoginSuccess(data.session);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden px-4">
      {/* Background elements for premium aesthetic */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#f8b1d2]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#fbbaec]/10 blur-[120px] pointer-events-none" />

      {/* Back button */}
      <button
        onClick={onBackToHome}
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-700 transition-colors cursor-pointer group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Kembali ke Beranda
      </button>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring', damping: 20 }}
        className="w-full max-w-md bg-white border border-slate-100/80 rounded-[2.5rem] shadow-xl shadow-slate-100 p-8 sm:p-10 relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-full bg-[#f8b1d2]/10 text-[#f8b1d2] mb-4">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-serif font-bold text-slate-800 mb-2">Admin Florisse</h1>
          <p className="text-sm text-slate-400">Silakan masuk untuk mengelola katalog produk dan kolaborasi</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-xs flex items-center gap-3"
          >
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
              <input
                type="email"
                required
                disabled={loading}
                placeholder="Masukkan email admin"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:border-[#f8b1d2] focus:ring-0 outline-none text-slate-700 transition-colors text-sm disabled:bg-slate-50 disabled:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                disabled={loading}
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-slate-200 focus:border-[#f8b1d2] focus:ring-0 outline-none text-slate-700 transition-colors text-sm disabled:bg-slate-50 disabled:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#f8b1d2] hover:bg-[#fbbaec] active:scale-98 text-white text-xs font-bold uppercase tracking-widest rounded-2xl shadow-lg shadow-pink-100 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Masuk Sekarang'
            )}
          </button>
        </form>

        <div className="text-center mt-8 pt-6 border-t border-slate-50">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Lock size={10} className="text-slate-300" />
            <p className="text-[10px] text-slate-300 uppercase tracking-widest">Secured by Supabase Auth</p>
          </div>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest">Florisse.id &copy; 2026</p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
