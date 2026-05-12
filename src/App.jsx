import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CollaborationSection from './components/CollaborationSection';
import CatalogSection from './components/CatalogSection';
import ContactSection from './components/ContactSection';
import ProductDetail from './components/ProductDetail';
import CollabDetail from './components/CollabDetail';
import Footer from './components/Footer';
import FlowerLoader from './components/Loader';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const [activeFilter, setActiveFilter] = useState('Semua');
  const [scrolled, setScrolled] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCollab, setSelectedCollab] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const closeOverlays = () => {
    setSelectedProduct(null);
    setSelectedCollab(null);
  };

  const hasOverlay = selectedProduct || selectedCollab;

  useEffect(() => {
    if (hasOverlay) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [hasOverlay]);

  return (
    <div className="min-h-screen font-sans bg-white text-slate-800 scroll-smooth">
      <AnimatePresence>
        {loading && <FlowerLoader message="Bloom in Every Moment" />}
      </AnimatePresence>

      <Navbar 
        scrolled={scrolled}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        scrollToSection={scrollToSection}
        closeOverlays={closeOverlays}
        hasOverlay={hasOverlay}
      />

      <main>
        <Hero scrollToSection={scrollToSection} />
        <CollaborationSection setSelectedCollab={setSelectedCollab} />
        <CatalogSection activeFilter={activeFilter} setActiveFilter={setActiveFilter} setSelectedProduct={setSelectedProduct} />
        <ContactSection />
      </main>

      <AnimatePresence>
        {selectedProduct && (
          <ProductDetail 
            product={selectedProduct} 
            onBack={() => setSelectedProduct(null)} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedCollab && (
          <CollabDetail 
            collab={selectedCollab} 
            onBack={() => setSelectedCollab(null)} 
          />
        )}
      </AnimatePresence>

      <Footer scrollToSection={scrollToSection} />
    </div>
  );
};

export default App;
