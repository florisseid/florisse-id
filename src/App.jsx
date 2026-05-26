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
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { products as initialProducts, collaborations as initialCollabs } from './data';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Minimum display time agar animasi bunga sempat bloom penuh
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  // Persistent dynamic states
  const [productsList, setProductsList] = useState(() => {
    const localData = localStorage.getItem('florisse_products');
    return localData ? JSON.parse(localData) : initialProducts;
  });

  const [collabsList, setCollabsList] = useState(() => {
    const localData = localStorage.getItem('florisse_collaborations');
    return localData ? JSON.parse(localData) : initialCollabs;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('florisse_products', JSON.stringify(productsList));
  }, [productsList]);

  useEffect(() => {
    localStorage.setItem('florisse_collaborations', JSON.stringify(collabsList));
  }, [collabsList]);

  // SPA Hash Router
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash);
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('florisse_admin_auth') === 'true';
  });

  const handleLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    localStorage.setItem('florisse_admin_auth', 'true');
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('florisse_admin_auth');
  };

  const handleBackToHome = () => {
    window.location.hash = '';
  };

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

  // Render Admin page conditionally if hash matches #admin
  if (hash === '#admin') {
    return (
      <AnimatePresence mode="wait">
        {isAdminLoggedIn ? (
          <motion.div key="admin-dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AdminDashboard
              productsList={productsList}
              setProductsList={setProductsList}
              collabsList={collabsList}
              setCollabsList={setCollabsList}
              onLogout={handleLogout}
              onBackToHome={handleBackToHome}
            />
          </motion.div>
        ) : (
          <motion.div key="admin-login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AdminLogin
              onLoginSuccess={handleLoginSuccess}
              onBackToHome={handleBackToHome}
            />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Render main storefront website
  return (
    <div className="min-h-screen font-sans bg-white text-slate-800 scroll-smooth">
      <AnimatePresence mode="wait">
        {loading && <FlowerLoader key="flower-loader" message="Bloom in Every Moment" />}
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
        <CollaborationSection
          setSelectedCollab={setSelectedCollab}
          collabsList={collabsList}
        />
        <CatalogSection
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          setSelectedProduct={setSelectedProduct}
          productsList={productsList}
        />
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
