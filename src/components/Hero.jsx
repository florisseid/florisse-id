import { motion } from 'framer-motion';
import { colors } from '../data';

const Hero = ({ scrollToSection }) => (
  <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
    <motion.img
      initial={{ scale: 1.1 }}
      animate={{ scale: 1 }}
      transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
      src="ChatGPT Image May 9, 2026, 01_26_45 PM.png"
      className="absolute inset-0 w-full h-full object-cover brightness-[0.7]"
    />
    <div className="relative z-10 text-center text-white px-6">
      <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-block px-4 py-1.5 rounded-full border border-white/30 backdrop-blur-md text-[10px] font-bold tracking-[0.3em] uppercase mb-6">Est. 2025 • Florist & Workshop</motion.span>
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-6xl md:text-8xl font-serif font-bold mb-8 leading-[1.1]">Bloom In<br /> Every <span style={{ color: colors.peach }}>Moment</span></motion.h1>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button onClick={() => scrollToSection('products')} className="px-10 py-4 rounded-full font-bold text-white shadow-xl transition hover:scale-105" style={{ backgroundColor: colors.peach }}>Eksplor Produk</button>
        <button onClick={() => scrollToSection('collaboration')} className="px-10 py-4 rounded-full font-bold bg-white/10 backdrop-blur-md border border-white/20 text-white transition hover:bg-white/20">Lihat Workshop</button>
      </motion.div>
    </div>
  </section>
);

export default Hero;
