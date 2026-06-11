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
import { products as initialProducts, collaborations as initialCollabs, categories as initialCategories } from './data';
import { supabase } from './supabaseClient';

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

  // Persistent dynamic states with local fallback initially
  const [productsList, setProductsList] = useState(initialProducts);
  const [collabsList, setCollabsList] = useState(initialCollabs);
  const [categoriesList, setCategoriesList] = useState(initialCategories);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);

  // Fetch initial data from Supabase if configured, otherwise fallback to data.js
  useEffect(() => {
    const fetchData = async () => {
      if (!supabase) {
        console.log('Supabase credentials not configured. Using local fallback data.');
        return;
      }
      try {
        // 1. Fetch categories
        const { data: categoriesData, error: catError } = await supabase
          .from('categories')
          .select('name')
          .order('id', { ascending: true });
        if (catError) throw catError;
        if (categoriesData && categoriesData.length > 0) {
          const list = categoriesData.map(c => c.name);
          setCategoriesList(list);
        }

        // 2. Fetch products
        const { data: productsData, error: prodError } = await supabase
          .from('products')
          .select('*')
          .order('id', { ascending: true });
        if (prodError) throw prodError;
        if (productsData) {
          // Format arrays if stored as JSONB or text
          const formatted = productsData.map(p => ({
            ...p,
            category: (typeof p.category === 'string' && p.category.startsWith('[')) ? JSON.parse(p.category) : p.category,
            variants: Array.isArray(p.variants) ? p.variants : JSON.parse(p.variants || '[]'),
            specs: Array.isArray(p.specs) ? p.specs : JSON.parse(p.specs || '[]'),
            bonus: Array.isArray(p.bonus) ? p.bonus : JSON.parse(p.bonus || '[]'),
            material: Array.isArray(p.material) ? p.material : JSON.parse(p.material || '[]'),
            kukerOptions: Array.isArray(p.kuker_options) ? p.kuker_options : JSON.parse(p.kuker_options || '[]'),
            bestSeller: p.best_seller
          }));
          setProductsList(formatted);
        }

        // 3. Fetch collaborations
        const { data: collabsData, error: collabsError } = await supabase
          .from('collaborations')
          .select('*')
          .order('id', { ascending: true });
        if (collabsError) throw collabsError;
        if (collabsData) {
          const formatted = collabsData.map(c => ({
            ...c,
            partner: Array.isArray(c.partner) ? c.partner : JSON.parse(c.partner || '[]'),
            gallery: Array.isArray(c.gallery) ? c.gallery : JSON.parse(c.gallery || '[]'),
            isComingSoon: c.is_coming_soon,
            fullDesc: c.full_desc,
            videoCover: c.video_cover
          }));
          setCollabsList(formatted);
        }

        // If we reached here without throwing, Supabase is connected
        setIsSupabaseConnected(true);
      } catch (err) {
        console.error('Failed to fetch from Supabase:', err.message);
        setIsSupabaseConnected(false);
      }
    };

    fetchData();
  }, []);

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

  // Admin Auth State — managed by Supabase Auth session
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      return;
    }

    // 1. Cek session yang sudah ada saat app mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdminLoggedIn(!!session);
      setAuthLoading(false);
    });

    // 2. Listen untuk perubahan auth (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdminLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLoginSuccess = () => {
    // Session sudah di-set oleh Supabase secara otomatis via onAuthStateChange
    // Tidak perlu manual setState karena listener di atas akan menghandle-nya
    setIsAdminLoggedIn(true);
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setIsAdminLoggedIn(false);
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
    // Tampilkan loading saat mengecek session Supabase (hindari flash login page)
    if (authLoading) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <span className="w-8 h-8 border-3 border-[#f8b1d2] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Memeriksa sesi...</p>
          </motion.div>
        </div>
      );
    }

    return (
      <AnimatePresence mode="wait">
        {isAdminLoggedIn ? (
          <motion.div key="admin-dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AdminDashboard
              productsList={productsList}
              setProductsList={setProductsList}
              collabsList={collabsList}
              setCollabsList={setCollabsList}
              categoriesList={categoriesList}
              setCategoriesList={setCategoriesList}
              isSupabaseConnected={isSupabaseConnected}
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
          categoriesList={categoriesList}
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
