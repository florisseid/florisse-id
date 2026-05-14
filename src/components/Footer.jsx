import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, MessageCircle, Mail, Globe, MapPin, Clock, ArrowRight } from 'lucide-react';
import { colors, socialLinks } from '../data';

const InstagramIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const WhatsAppIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const Footer = ({ scrollToSection }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    try {
      // GANTI 'YOUR_FORMSPREE_ID' dengan ID dari formspree.io Anda
      const FORMSPREE_ID = "meennepd";
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message: "Newsletter Subscription" }),
      });

      if (response.ok) {
        setStatus('success');
        setEmail('');
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const socialIcons = [Camera, MessageCircle, Mail, Globe];

  const navLinks = [
    { name: 'Beranda', id: 'home' },
    { name: 'Kolaborasi', id: 'collaboration' },
    { name: 'Produk', id: 'products' },
    { name: 'Kontak', id: 'contact' }
  ];

  const getIcon = (name) => {
    switch (name) {
      case 'Instagram': return InstagramIcon;
      case 'WhatsApp': return WhatsAppIcon;
      case 'Email': return Mail;
      default: return Globe;
    }
  };

  return (
    <footer className="bg-slate-900 text-white pt-24 pb-12 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none select-none opacity-[0.03] flex items-center justify-center" aria-hidden="true">
        <span className="text-[25vw] font-serif font-black leading-none uppercase tracking-tighter">FLORISSE</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 pb-20 border-b border-white/10">

          {/* Brand Identity */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img src="/FLORISSELOGO.png" alt="Logo Florisse" className="w-12 h-12 rounded-md" width="48" height="48" loading="lazy" />
              <span className="font-serif text-2xl font-bold tracking-tight">Florisse.id</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed pr-4">
              Menciptakan momen magis melalui rangkaian bunga pilihan. Florist berbasis di Banjarmasin yang berfokus pada kualitas dan estetika modern.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((link, i) => {
                const Icon = getIcon(link.name);
                return (
                  <a
                    key={i}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-[#f8b1d2] hover:text-white transition-all duration-300"
                    title={link.name}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="lg:pl-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f8b1d2] mb-8">Eksplorasi</h4>
            <ul className="grid grid-cols-1 gap-4 text-sm font-medium">
              {navLinks.map(link => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#f8b1d2] scale-0 group-hover:scale-100 transition-transform"></div>
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Operating Info */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f8b1d2] mb-8">Kunjungan</h4>
            <div className="space-y-6 text-sm">
              <div className="flex items-start gap-4 text-slate-400">
                <Clock className="w-5 h-5 text-[#f8b1d2] shrink-0" />
                <div>
                  <p className="text-white font-bold mb-1 uppercase tracking-tighter text-xs">Jam Buka</p>
                  <p>Sen - Sab: 08.00 - 22.00</p>
                  <p>Minggu: Berdasarkan Janji</p>
                </div>
              </div>
              <div className="flex items-start gap-4 text-slate-400">
                <MapPin className="w-5 h-5 text-[#f8b1d2] shrink-0" />
                <div>
                  <p className="text-white font-bold mb-1 uppercase tracking-tighter text-xs">Studio</p>
                  <p>Antasan Kecil Timur, Banjarmasin Utara, Banjarmasin City, South Kalimantan 70123</p>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
            <h4 className="font-serif text-xl font-bold mb-4">Ingin Update Terbaru?</h4>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">Dapatkan tips merawat bunga dan info stok terbaru langsung di email Anda.</p>

            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl text-[10px] font-bold uppercase tracking-widest text-center"
              >
                Terima kasih! Email Anda telah terdaftar ✨
              </motion.div>
            ) : status === 'error' ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-[10px] font-bold uppercase tracking-widest text-center"
              >
                Maaf, terjadi kesalahan. Silakan coba lagi.
              </motion.div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="relative">
                <label htmlFor="newsletter-email" className="sr-only">Alamat email Anda</label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Anda"
                  className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-sm outline-none focus:border-[#f8b1d2] transition disabled:opacity-50"
                  disabled={status === 'loading'}
                  autoComplete="email"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  aria-label="Daftar newsletter Florisse"
                  className="absolute right-2 top-2 p-1.5 rounded-lg bg-[#f8b1d2] text-white hover:scale-105 transition-transform disabled:opacity-50"
                >
                  {status === 'loading' ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true"></div>
                  ) : (
                    <ArrowRight size={16} aria-hidden="true" />
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">
            © 2026 Florisse Indonesia. Dibuat dengan cinta untuk setiap kelopak.
          </p>
          <div className="flex gap-8">
            <span className="text-[10px] text-slate-500 hover:text-[#f8b1d2] cursor-pointer transition uppercase tracking-widest">Privacy</span>
            <span className="text-[10px] text-slate-500 hover:text-[#f8b1d2] cursor-pointer transition uppercase tracking-widest">Terms</span>
            <span className="text-[10px] text-slate-500 hover:text-[#f8b1d2] cursor-pointer transition uppercase tracking-widest">Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
