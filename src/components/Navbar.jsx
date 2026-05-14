import { motion } from 'framer-motion';
import { Flower, Menu, X } from 'lucide-react';
import { colors } from '../data';

const Navbar = ({ scrolled, isMenuOpen, setIsMenuOpen, scrollToSection, closeOverlays, hasOverlay }) => {
  const solid = scrolled || hasOverlay;

  return (
    <nav aria-label="Navigasi utama" className={`fixed top-0 w-full z-50 transition-all duration-500 ${solid ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => { closeOverlays(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          role="link"
          aria-label="Kembali ke beranda Florisse"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <img src="/FLORISSELOGO.png" className="w-15 h-15 rounded-full" alt="Logo Florisse" width="60" height="60" />
          <span className="font-serif text-2xl font-bold tracking-tight" style={{ color: solid ? colors.peach : '#ffffff' }}>Florisse.id</span>
        </motion.div>

        <div className={`hidden md:flex gap-10 font-bold text-[11px] uppercase tracking-widest ${solid ? 'text-slate-600' : 'text-white'}`}>
          {['beranda', 'kolaborasi', 'produk', 'kontak'].map((item) => (
            <button
              key={item}
              onClick={() => {
                closeOverlays();
                const target = item === 'beranda' ? 'home' : item === 'kolaborasi' ? 'collaboration' : item === 'produk' ? 'products' : 'contact';
                setTimeout(() => scrollToSection(target), 50);
              }}
              aria-label={`Navigasi ke ${item}`}
              className="hover:opacity-70 transition-all relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-current transition-all group-hover:w-full"></span>
            </button>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => scrollToSection('products')}
          aria-label="Pesan produk sekarang via WhatsApp"
          className="hidden md:block px-6 py-2.5 rounded-full text-xs font-bold text-white transition shadow-sm"
          style={{ backgroundColor: colors.peach }}
        >
          Pesan Sekarang
        </motion.button>

        <button
          className={`${solid ? 'text-slate-800' : 'text-white'} md:hidden p-2`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div id="mobile-menu" className="md:hidden bg-white/95 backdrop-blur-md border-t border-slate-100 mobile-menu-enter">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-4">
            {['beranda', 'kolaborasi', 'produk', 'kontak'].map((item) => (
              <button
                key={item}
                onClick={() => {
                  closeOverlays();
                  const target = item === 'beranda' ? 'home' : item === 'kolaborasi' ? 'collaboration' : item === 'produk' ? 'products' : 'contact';
                  setTimeout(() => scrollToSection(target), 50);
                }}
                aria-label={`Navigasi ke ${item}`}
                className="text-left font-bold text-sm uppercase tracking-widest text-slate-600 hover:text-[#f8b1d2] transition py-2"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
