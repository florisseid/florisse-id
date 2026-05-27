import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, Users, Download, LogOut, Trash2, Plus,
  Sparkles, Check, Copy, X, Calendar, MapPin, Tag, Video, Image as ImageIcon,
  Edit, Loader2, Cloud, CloudOff, CheckCircle, AlertCircle
} from 'lucide-react';
import { colors } from '../data';
import { supabase } from '../supabaseClient';

const AdminDashboard = ({
  productsList,
  setProductsList,
  collabsList,
  setCollabsList,
  categoriesList,
  setCategoriesList,
  isSupabaseConnected,
  onLogout,
  onBackToHome
}) => {
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'collaborations', 'export'
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCollab, setShowAddCollab] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCollab, setEditingCollab] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: string }

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  // States for new product form
  const [pName, setPName] = useState('');
  const [pPrice, setPPrice] = useState('Rp 50.000');
  const [pCategory, setPCategory] = useState('Buket');
  const [pImage, setPImage] = useState('1.jpeg');
  const [pVariants, setPVariants] = useState(['1.jpeg']);
  const [newVariant, setNewVariant] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pBestSeller, setPBestSeller] = useState(false);
  const [pSpecs, setPSpecs] = useState(['Rangkaian bunga premium', 'Pita lucu']);
  const [pBonus, setPBonus] = useState(['FREE Packaging', 'Kartu ucapan']);
  const [pMaterial, setPMaterial] = useState(['Artificial Flower Premium']);
  const [pKukerOptions, setPKukerOptions] = useState(['Nastar', 'Kastengel']);
  const [newSpec, setNewSpec] = useState('');
  const [newBonus, setNewBonus] = useState('');
  const [newMaterial, setNewMaterial] = useState('');
  const [newKukerOption, setNewKukerOption] = useState('');

  // Dynamic product categories (from Supabase via App.jsx props)
  const categoryOptions = categoriesList || ['Buket', 'Flower Box', 'Hampers', 'Collab Product'];
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // States for new collaboration form
  const [cName, setCName] = useState('');
  const [cType, setCType] = useState('Cooking Baking Class');
  const [cComingSoon, setCComingSoon] = useState(false);
  const [cDate, setCDate] = useState('');
  const [cLocation, setCLocation] = useState('');
  const [cDesc, setCDesc] = useState('');
  const [cImage, setCImage] = useState('cookies collab 2.png');
  const [cVideoCover, setCVideoCover] = useState('cookies collab 2.png');
  const [cVideo, setCVideo] = useState('');
  const [cPartners, setCPartners] = useState(['Your Cap']);
  const [newPartner, setNewPartner] = useState('');
  const [cGallery, setCGallery] = useState([]);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  // Helpers to add to list
  const addListItem = (list, setList, val, setVal) => {
    if (!val.trim()) return;
    setList([...list, val.trim()]);
    setVal('');
  };

  const removeListItem = (list, setList, index) => {
    setList(list.filter((_, i) => i !== index));
  };

  const handleImageUpload = (file, callback) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Helper: Insert ke Supabase dengan auto-retry saat terjadi duplicate key error.
  // Ketika data di-seed manual (misal ID 1-12), sequence auto-increment PostgreSQL
  // bisa tertinggal dan menyebabkan konflik. Fungsi ini otomatis menghitung
  // ID baru dari MAX(id)+1 dan retry insert.
  const insertWithAutoId = async (tableName, payload, maxRetries = 3) => {
    // Percobaan pertama: biarkan PostgreSQL auto-generate ID
    const { data, error } = await supabase.from(tableName).insert(payload).select();
    if (!error) return { data, error: null };

    // Jika error bukan duplicate key, langsung kembalikan
    const isDuplicateKey = error.message?.includes('duplicate key') || error.code === '23505';
    if (!isDuplicateKey) return { data: null, error };

    // Duplicate key terdeteksi — hitung ID baru dari MAX(id) yang ada
    console.warn(`[${tableName}] Duplicate key detected, auto-fixing sequence...`);
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const { data: rows } = await supabase
        .from(tableName)
        .select('id')
        .order('id', { ascending: false })
        .limit(1);

      const maxId = (rows && rows.length > 0) ? rows[0].id : 0;
      const newId = maxId + attempt; // +attempt untuk menghindari race condition

      const { data: retryData, error: retryError } = await supabase
        .from(tableName)
        .insert({ ...payload, id: newId })
        .select();

      if (!retryError) {
        console.log(`[${tableName}] Auto-fix berhasil dengan ID: ${newId}`);
        return { data: retryData, error: null };
      }

      const isStillDuplicate = retryError.message?.includes('duplicate key') || retryError.code === '23505';
      if (!isStillDuplicate) return { data: null, error: retryError };
    }

    return { data: null, error: { message: `Gagal insert setelah ${maxRetries} percobaan retry. Silakan reset sequence ID di Supabase SQL Editor.` } };
  };

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const finalProduct = {
      name: pName || 'Buket Bunga Baru',
      category: pCategory,
      price: pPrice,
      image: pImage || '1.jpeg',
      variants: pVariants.length > 0 ? pVariants : [pImage || '1.jpeg'],
      bestSeller: pBestSeller,
      desc: pDesc || 'Rangkaian bunga yang elegan dari Florisse.',
      specs: pSpecs.filter(Boolean),
      bonus: pBonus.filter(Boolean),
      material: pMaterial.filter(Boolean),
      ...(pCategory === 'Hampers' && pKukerOptions.length > 0 ? { kukerOptions: pKukerOptions.filter(Boolean) } : {})
    };

    // Payload for Supabase (snake_case column names)
    const dbPayload = {
      name: finalProduct.name, category: finalProduct.category, price: finalProduct.price,
      image: finalProduct.image, variants: finalProduct.variants, best_seller: finalProduct.bestSeller,
      desc: finalProduct.desc, specs: finalProduct.specs, bonus: finalProduct.bonus,
      material: finalProduct.material, kuker_options: finalProduct.kukerOptions || []
    };

    try {
      if (editingProduct) {
        // Optimistic local update
        setProductsList(productsList.map(p => p.id === editingProduct.id ? { ...editingProduct, ...finalProduct } : p));
        // Sync to Supabase
        if (supabase && isSupabaseConnected) {
          const { error } = await supabase.from('products').update(dbPayload).eq('id', editingProduct.id);
          if (error) throw error;
        }
        setEditingProduct(null);
        showToast('success', `Produk "${finalProduct.name}" berhasil diperbarui!`);
      } else {
        if (supabase && isSupabaseConnected) {
          // Insert with auto-retry on duplicate key (self-healing sequence)
          const { data: inserted, error } = await insertWithAutoId('products', dbPayload);
          if (error) throw error;
          if (inserted && inserted.length > 0) {
            const row = inserted[0];
            const formatted = {
              ...row,
              variants: Array.isArray(row.variants) ? row.variants : JSON.parse(row.variants || '[]'),
              specs: Array.isArray(row.specs) ? row.specs : JSON.parse(row.specs || '[]'),
              bonus: Array.isArray(row.bonus) ? row.bonus : JSON.parse(row.bonus || '[]'),
              material: Array.isArray(row.material) ? row.material : JSON.parse(row.material || '[]'),
              kukerOptions: Array.isArray(row.kuker_options) ? row.kuker_options : JSON.parse(row.kuker_options || '[]'),
              bestSeller: row.best_seller
            };
            setProductsList([...productsList, formatted]);
          }
        } else {
          // Offline fallback: use client-side ID
          const newId = productsList.length > 0 ? Math.max(...productsList.map(p => p.id)) + 1 : 1;
          setProductsList([...productsList, { id: newId, ...finalProduct }]);
        }
        showToast('success', `Produk "${finalProduct.name}" berhasil ditambahkan!`);
      }
    } catch (err) {
      console.error('Product save error:', err.message);
      showToast('error', `Gagal menyimpan produk: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
    setShowAddProduct(false);
    handleCancelProduct();
  };

  const handleEditProductClick = (product) => {
    setEditingProduct(product);
    setPName(product.name);
    setPPrice(product.price);
    setPCategory(Array.isArray(product.category) ? product.category[0] : product.category);
    setPImage(product.image);
    setPVariants(product.variants || [product.image]);
    setPDesc(product.desc);
    setPBestSeller(!!product.bestSeller);
    setPSpecs(product.specs || []);
    setPBonus(product.bonus || []);
    setPMaterial(product.material || []);
    setPKukerOptions(product.kukerOptions || []);
    setShowAddProduct(true);
  };

  const handleCancelProduct = () => {
    setEditingProduct(null);
    setShowAddProduct(false);
    setPName('');
    setPPrice('Rp 50.000');
    setPCategory('Buket');
    setPImage('1.jpeg');
    setPVariants(['1.jpeg']);
    setPDesc('');
    setPBestSeller(false);
    setPSpecs(['Rangkaian bunga premium', 'Pita lucu']);
    setPBonus(['FREE Packaging', 'Kartu ucapan']);
    setPMaterial(['Artificial Flower Premium']);
    setPKukerOptions([]);
    setNewVariant('');
    setNewKukerOption('');
  };

  const handleAddCollabSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const collabPayload = {
      name: cName || 'Kelas Baru',
      type: cType,
      is_coming_soon: cComingSoon,
      partner: cPartners.filter(Boolean),
      date: cDate || 'Segera Hadir',
      location: cLocation || 'TBA',
      full_desc: cDesc || 'Ikuti keseruan kelas dekorasi/baking kolaborasi.',
      image: cImage || 'cookies collab 2.png',
      video_cover: cVideoCover || 'cookies collab 2.png',
      video: cVideo || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      gallery: cGallery.length > 0 ? cGallery.filter(Boolean) : [cImage || 'cookies collab 2.png']
    };
    // Local-friendly format
    const localCollab = {
      ...collabPayload,
      isComingSoon: collabPayload.is_coming_soon,
      fullDesc: collabPayload.full_desc,
      videoCover: collabPayload.video_cover
    };

    try {
      if (editingCollab) {
        setCollabsList(collabsList.map(c => c.id === editingCollab.id ? { ...editingCollab, ...localCollab } : c));
        if (supabase && isSupabaseConnected) {
          const { error } = await supabase.from('collaborations').update(collabPayload).eq('id', editingCollab.id);
          if (error) throw error;
        }
        setEditingCollab(null);
        showToast('success', `Kolaborasi "${localCollab.name}" berhasil diperbarui!`);
      } else {
        if (supabase && isSupabaseConnected) {
          // Insert with auto-retry on duplicate key (self-healing sequence)
          const { data: inserted, error } = await insertWithAutoId('collaborations', collabPayload);
          if (error) throw error;
          if (inserted && inserted.length > 0) {
            const row = inserted[0];
            const formatted = {
              ...row,
              partner: Array.isArray(row.partner) ? row.partner : JSON.parse(row.partner || '[]'),
              gallery: Array.isArray(row.gallery) ? row.gallery : JSON.parse(row.gallery || '[]'),
              isComingSoon: row.is_coming_soon,
              fullDesc: row.full_desc,
              videoCover: row.video_cover
            };
            setCollabsList([...collabsList, formatted]);
          }
        } else {
          // Offline fallback: use client-side ID
          const newId = collabsList.length > 0 ? Math.max(...collabsList.map(c => c.id)) + 1 : 101;
          setCollabsList([...collabsList, { id: newId, ...localCollab }]);
        }
        showToast('success', `Kolaborasi "${localCollab.name}" berhasil ditambahkan!`);
      }
    } catch (err) {
      console.error('Collab save error:', err.message);
      showToast('error', `Gagal menyimpan kolaborasi: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
    setShowAddCollab(false);

    // Reset fields
    setCName('');
    setCDate('');
    setCLocation('');
    setCDesc('');
    setCVideo('');
    setCPartners(['Your Cap']);
    setCGallery([]);
  };

  const handleEditCollabClick = (collab) => {
    setEditingCollab(collab);
    setCName(collab.name);
    setCType(collab.type);
    setCComingSoon(!!collab.isComingSoon);
    setCDate(collab.date);
    setCLocation(collab.location);
    setCDesc(collab.fullDesc);
    setCImage(collab.image);
    setCVideoCover(collab.videoCover || collab.image);
    setCVideo(collab.video || '');
    setCPartners(collab.partner || []);
    setCGallery(collab.gallery || []);
    setShowAddCollab(true);
  };

  const handleCancelCollab = () => {
    setEditingCollab(null);
    setShowAddCollab(false);
    setCName('');
    setCType('Cooking Baking Class');
    setCDate('');
    setCLocation('');
    setCDesc('');
    setCVideo('');
    setCPartners(['Your Cap']);
    setCGallery([]);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini dari katalog?')) {
      setProductsList(productsList.filter(p => p.id !== id));
      if (supabase && isSupabaseConnected) {
        try {
          const { error } = await supabase.from('products').delete().eq('id', id);
          if (error) throw error;
          showToast('success', 'Produk berhasil dihapus dari database.');
        } catch (err) {
          showToast('error', `Gagal menghapus produk: ${err.message}`);
        }
      }
    }
  };

  const handleDeleteCollab = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kolaborasi ini?')) {
      setCollabsList(collabsList.filter(c => c.id !== id));
      if (supabase && isSupabaseConnected) {
        try {
          const { error } = await supabase.from('collaborations').delete().eq('id', id);
          if (error) throw error;
          showToast('success', 'Kolaborasi berhasil dihapus dari database.');
        } catch (err) {
          showToast('error', `Gagal menghapus kolaborasi: ${err.message}`);
        }
      }
    }
  };

  // Generate full code content for data.js
  const generateFullDataJs = () => {
    // Generate formatting
    const formattedProducts = productsList.map(p => {
      const parts = [
        `    id: ${p.id}`,
        `    name: '${p.name.replace(/'/g, "\\'")}'`,
        `    category: ${Array.isArray(p.category) ? JSON.stringify(p.category) : `'${p.category}'`}`,
        `    price: '${p.price}'`,
        `    image: '${p.image}'`,
        `    variants: ${JSON.stringify(p.variants || [])}`,
        `    bestSeller: ${p.bestSeller}`,
        `    desc: '${p.desc.replace(/'/g, "\\'").replace(/\n/g, " ")}'`,
        `    specs: ${JSON.stringify(p.specs)}`,
        `    bonus: ${JSON.stringify(p.bonus)}`,
        `    material: ${JSON.stringify(p.material)}`
      ];
      if (p.kukerOptions && p.kukerOptions.length > 0) {
        parts.push(`    kukerOptions: ${JSON.stringify(p.kukerOptions)}`);
      }
      return `  {\n${parts.join(',\n')}\n  }`;
    }).join(',\n');

    const formattedCollabs = collabsList.map(c => {
      return `  {
    id: ${c.id},
    name: '${c.name.replace(/'/g, "\\'")}',
    type: '${c.type}',
    isComingSoon: ${!!c.isComingSoon},
    partner: ${JSON.stringify(c.partner)},
    date: '${c.date}',
    location: '${c.location}',
    fullDesc: '${c.fullDesc.replace(/'/g, "\\'").replace(/\n/g, " ")}',
    image: '${c.image}',
    videoCover: '${c.videoCover || c.image}',
    video: '${c.video || ''}',
    gallery: ${JSON.stringify(c.gallery || [])}
  }`;
    }).join(',\n');

    return `export const colors = {
  peach: '#f8b1d2',     // Rose (Primary)
  softPink: '#fbbaec',
  softBlue: '#b7d7f7',
  lavender: '#dadafb',
  cream: '#fff2d2',
  white: '#ffffff',
  dark: '#1e293b',
  slate: '#64748b',
  lightGray: '#f8fafc'
};

export const WA_NUMBER = "6289692820887";
export const getWaLink = (message) => \`https://wa.me/\${WA_NUMBER}?text=\${encodeURIComponent(message)}\`;

export const socialLinks = [
  { name: 'Instagram', href: 'https://www.instagram.com/florisse.id?igsh=MWhyOGNpd2NvcDBwdA==' },
  { name: 'WhatsApp', href: \`https://wa.me/\${WA_NUMBER}\` },
  { name: 'Email', href: 'mailto:florisse.id@gmail.com' }
];

export const categories = ${JSON.stringify(categoryOptions, null, 2)};

export const products = [
${formattedProducts}
];

export const collaborations = [
${formattedCollabs}
];
`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generateFullDataJs());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const element = document.createElement("a");
    const file = new Blob([generateFullDataJs()], { type: 'text/javascript' });
    element.href = URL.createObjectURL(file);
    element.download = "data.js";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-100 py-6 px-6 sm:px-12 flex items-center justify-between shadow-sm sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#f8b1d2]/10 flex items-center justify-center text-[#f8b1d2]">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold text-slate-800">Florisse Admin Portal</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Dashboard &bull; Mode Pengelola</p>
              {isSupabaseConnected ? (
                <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-600 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
                  <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span></span>
                  <Cloud size={9} /> Cloud Sync Aktif
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-600 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
                  <span className="relative flex h-1.5 w-1.5"><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-400"></span></span>
                  <CloudOff size={9} /> Mode Offline
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onBackToHome}
            className="text-xs font-bold text-slate-500 hover:text-[#f8b1d2] transition-colors cursor-pointer hidden sm:block"
          >
            Lihat Website Utama
          </button>

          <button
            onClick={onLogout}
            className="py-2.5 px-4 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-500 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border border-slate-100"
          >
            <LogOut size={14} />
            Keluar Sesi
          </button>
        </div>
      </header>

      {/* Main Grid Area */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 sm:px-12 py-8 flex flex-col md:flex-row gap-8">

        {/* Left Side Navigation Panel */}
        <aside className="w-full md:w-64 shrink-0 space-y-2">
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm space-y-1">
            <button
              onClick={() => { setActiveTab('products'); setShowAddProduct(false); }}
              className={`w-full py-3.5 px-5 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center gap-3 transition-all cursor-pointer ${activeTab === 'products' ? 'bg-[#f8b1d2] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
            >
              <ShoppingBag size={16} />
              Kelola Produk ({productsList.length})
            </button>

            <button
              onClick={() => { setActiveTab('collaborations'); setShowAddCollab(false); }}
              className={`w-full py-3.5 px-5 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center gap-3 transition-all cursor-pointer ${activeTab === 'collaborations' ? 'bg-[#f8b1d2] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
            >
              <Users size={16} />
              Kolaborasi ({collabsList.length})
            </button>

            <button
              onClick={() => setActiveTab('export')}
              className={`w-full py-3.5 px-5 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center gap-3 transition-all cursor-pointer ${activeTab === 'export' ? 'bg-[#f8b1d2] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
            >
              <Download size={16} />
              Ekspor data.js
            </button>
          </div>

          <div className={`p-6 rounded-3xl border shadow-sm text-center hidden md:block ${isSupabaseConnected ? 'bg-emerald-50/50 border-emerald-100/50' : 'bg-white/80 border-slate-100/50'}`}>
            {isSupabaseConnected ? (
              <>
                <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-2 flex items-center justify-center gap-1.5"><Cloud size={12} /> Supabase Cloud</p>
                <p className="text-[11px] text-emerald-700/70 leading-relaxed mb-4">
                  Semua perubahan <strong>otomatis tersinkronisasi</strong> ke database cloud Supabase secara real-time. Tidak perlu ekspor manual.
                </p>
                <div className="py-2.5 px-4 w-full bg-emerald-100/50 text-emerald-600 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5">
                  <CheckCircle size={12} /> Sinkronisasi Aktif
                </div>
              </>
            ) : (
              <>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Mode Offline</p>
                <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
                  Supabase tidak terhubung. Perubahan hanya tersimpan di sesi browser ini. Gunakan menu <strong>Ekspor data.js</strong> untuk cadangan.
                </p>
                <button
                  onClick={() => setActiveTab('export')}
                  className="py-2.5 px-4 w-full bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Buka Halaman Ekspor
                </button>
              </>
            )}
          </div>
        </aside>

        {/* Right Side Content Panel */}
        <main className="flex-1 min-w-0">

          {/* TAB 1: PRODUCTS MANAGER */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-slate-800">Daftar Produk</h2>
                  <p className="text-xs text-slate-400">Total {productsList.length} produk terdaftar di katalog Florisse</p>
                </div>
                {!showAddProduct && (
                  <button
                    onClick={() => setShowAddProduct(true)}
                    className="py-3 px-6 bg-[#f8b1d2] hover:bg-[#fbbaec] text-white text-xs font-bold uppercase tracking-widest rounded-2xl flex items-center gap-2 shadow-lg shadow-pink-100 transition-all cursor-pointer"
                  >
                    <Plus size={16} />
                    Tambah Produk
                  </button>
                )}
              </div>

              {/* Add Product Inline Form */}
              {showAddProduct && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-[#f8b1d2]/20 shadow-lg shadow-pink-50/20"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                    <h3 className="font-serif font-bold text-lg text-slate-800">
                      {editingProduct ? `Edit Produk: ${editingProduct.name}` : 'Katalog Produk Baru'}
                    </h3>
                    <button
                      onClick={handleCancelProduct}
                      className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <form onSubmit={handleAddProductSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Nama Produk</label>
                        <input
                          type="text"
                          required
                          placeholder="Buket Tulip Cantik"
                          value={pName}
                          onChange={(e) => setPName(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-[#f8b1d2] focus:ring-0 outline-none text-slate-700 transition-colors text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Harga</label>
                        <input
                          type="text"
                          required
                          placeholder="Rp 65.000"
                          value={pPrice}
                          onChange={(e) => setPPrice(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-[#f8b1d2] focus:ring-0 outline-none text-slate-700 transition-colors text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Kategori</label>
                        <div className="flex gap-2 items-start">
                          <select
                            value={pCategory}
                            onChange={(e) => setPCategory(e.target.value)}
                            className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 focus:border-[#f8b1d2] focus:ring-0 outline-none text-slate-700 transition-colors text-sm bg-white"
                          >
                            {categoryOptions.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => setShowAddCategory(!showAddCategory)}
                            className={`py-3 px-4 rounded-2xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 shrink-0 ${
                              showAddCategory
                                ? 'bg-[#f8b1d2] text-white border-[#f8b1d2]'
                                : 'bg-slate-50 hover:bg-[#f8b1d2] hover:text-white text-slate-500 border-slate-100'
                            }`}
                            title="Tambah kategori baru"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        {showAddCategory && (
                          <div className="mt-2 flex gap-2 items-center animate-in fade-in">
                            <input
                              type="text"
                              placeholder="Nama kategori baru..."
                              value={newCategoryName}
                              onChange={(e) => setNewCategoryName(e.target.value)}
                              onKeyDown={async (e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  const trimmed = newCategoryName.trim();
                                  if (!trimmed) return;
                                  if (categoryOptions.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
                                    alert('Kategori tersebut sudah ada.');
                                    return;
                                  }
                                  const updated = [...categoryOptions, trimmed];
                                  setCategoriesList(updated);
                                  if (supabase && isSupabaseConnected) {
                                    await supabase.from('categories').insert({ name: trimmed });
                                  }
                                  setPCategory(trimmed);
                                  setNewCategoryName('');
                                  setShowAddCategory(false);
                                }
                              }}
                              className="flex-1 px-4 py-2.5 rounded-2xl border border-dashed border-[#f8b1d2] focus:border-[#f8b1d2] focus:ring-0 outline-none text-slate-700 text-sm bg-pink-50/30"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={async () => {
                                const trimmed = newCategoryName.trim();
                                if (!trimmed) return;
                                if (categoryOptions.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
                                  alert('Kategori tersebut sudah ada.');
                                  return;
                                }
                                const updated = [...categoryOptions, trimmed];
                                setCategoriesList(updated);
                                if (supabase && isSupabaseConnected) {
                                  await supabase.from('categories').insert({ name: trimmed });
                                }
                                setPCategory(trimmed);
                                setNewCategoryName('');
                                setShowAddCategory(false);
                              }}
                              className="py-2.5 px-4 bg-[#f8b1d2] hover:bg-[#fbbaec] text-white rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                            >
                              <Check size={14} /> Simpan
                            </button>
                            <button
                              type="button"
                              onClick={() => { setShowAddCategory(false); setNewCategoryName(''); }}
                              className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-full transition-colors cursor-pointer"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        )}
                        {categoryOptions.length > 4 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {categoryOptions.filter(c => !['Buket', 'Flower Box', 'Hampers', 'Collab Product'].includes(c)).map(cat => (
                              <span key={cat} className="inline-flex items-center gap-1 bg-pink-50 border border-[#f8b1d2]/20 px-2.5 py-1 rounded-full text-[10px] text-[#f8b1d2] font-bold">
                                {cat}
                                <button
                                  type="button"
                                  onClick={async () => {
                                    if (pCategory === cat) setPCategory(categoryOptions[0]);
                                    const updated = categoryOptions.filter(c2 => c2 !== cat);
                                    setCategoriesList(updated);
                                    if (supabase && isSupabaseConnected) {
                                      await supabase.from('categories').delete().eq('name', cat);
                                    }
                                  }}
                                  className="text-red-400 hover:text-red-600 ml-0.5"
                                  title={`Hapus kategori ${cat}`}
                                >
                                  <X size={10} />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Gambar Utama (Upload / Link)</label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="text"
                            placeholder="Link gambar atau nama preset (misal: 1.jpeg)"
                            value={pImage}
                            onChange={(e) => setPImage(e.target.value)}
                            className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 focus:border-[#f8b1d2] focus:ring-0 outline-none text-slate-700 text-sm"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            id="upload-main-image"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e.target.files[0], setPImage)}
                          />
                          <label
                            htmlFor="upload-main-image"
                            className="py-3 px-4 bg-slate-100 hover:bg-[#f8b1d2] hover:text-white text-slate-600 rounded-2xl text-xs font-bold transition-all cursor-pointer border border-slate-100 flex items-center gap-1.5 shrink-0"
                          >
                            <ImageIcon size={14} /> Upload
                          </label>
                        </div>
                        {pImage && (
                          <div className="mt-2 flex items-center gap-2">
                            <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 shrink-0">
                              <img src={pImage.startsWith('data:') || pImage.startsWith('http') ? pImage : `./${pImage}`} className="w-full h-full object-cover" alt="Preview" />
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono truncate max-w-[200px]">Preview Gambar Utama</span>
                          </div>
                        )}
                      </div>

                      {/* Variants Management */}
                      <div className="sm:col-span-2 border-t border-slate-50 pt-4">
                        <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Varian Gambar Buket/Hampers</label>
                        <div className="flex gap-2 items-center mb-4">
                          <input
                            type="text"
                            placeholder="Tulis Link/URL Gambar Varian Baru"
                            value={newVariant}
                            onChange={(e) => setNewVariant(e.target.value)}
                            className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 focus:border-[#f8b1d2] focus:ring-0 outline-none text-slate-700 text-sm"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            id="upload-variant-image"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e.target.files[0], (url) => {
                              if (url) {
                                setPVariants([...pVariants, url]);
                              }
                            })}
                          />
                          <label
                            htmlFor="upload-variant-image"
                            className="py-3 px-4 bg-slate-100 hover:bg-[#f8b1d2] hover:text-white text-slate-600 rounded-2xl text-xs font-bold transition-all cursor-pointer border border-slate-100 flex items-center gap-1.5 shrink-0"
                          >
                            <ImageIcon size={14} /> Upload File
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              if (newVariant.trim()) {
                                setPVariants([...pVariants, newVariant.trim()]);
                                setNewVariant('');
                              }
                            }}
                            className="py-3 px-4 bg-[#f8b1d2] hover:bg-[#fbbaec] text-white rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                          >
                            Tambah
                          </button>
                        </div>

                        {/* List of current variants */}
                        <div className="flex flex-wrap gap-3">
                          {pVariants.map((v, idx) => (
                            <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-100 bg-slate-50 group shadow-sm">
                              <img src={v.startsWith('data:') || v.startsWith('http') ? v : `./${v}`} className="w-full h-full object-cover" alt="" />
                              <button
                                type="button"
                                onClick={() => setPVariants(pVariants.filter((_, i) => i !== idx))}
                                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                          {pVariants.length === 0 && (
                            <span className="text-xs text-slate-400 font-medium">Belum ada varian gambar. Gambar utama akan digunakan sebagai varian tunggal.</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="pBestSeller"
                        checked={pBestSeller}
                        onChange={(e) => setPBestSeller(e.target.checked)}
                        className="w-4 h-4 rounded text-[#f8b1d2] border-slate-300 focus:ring-[#f8b1d2]"
                      />
                      <label htmlFor="pBestSeller" className="text-xs font-bold uppercase text-slate-600 tracking-wider cursor-pointer">
                        Tandai sebagai Best Seller ⭐
                      </label>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Deskripsi Produk</label>
                      <textarea
                        required
                        placeholder="Rangkaian bunga menawan..."
                        value={pDesc}
                        onChange={(e) => setPDesc(e.target.value)}
                        rows="3"
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-[#f8b1d2] focus:ring-0 outline-none text-slate-700 transition-colors text-sm"
                      />
                    </div>

                    {/* Specs, Bonus, Material */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-50">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">Spesifikasi</label>
                        <div className="flex gap-1 mb-2">
                          <input
                            type="text"
                            placeholder="Input baru"
                            value={newSpec}
                            onChange={(e) => setNewSpec(e.target.value)}
                            className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => addListItem(pSpecs, setPSpecs, newSpec, setNewSpec)}
                            className="p-2 bg-slate-100 hover:bg-[#f8b1d2] hover:text-white rounded-xl transition-colors cursor-pointer"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <div className="space-y-1 max-h-[100px] overflow-y-auto pr-1">
                          {pSpecs.map((spec, i) => (
                            <div key={i} className="flex items-center justify-between bg-slate-50 px-2 py-1 rounded-lg text-[10px] text-slate-600">
                              <span className="truncate">{spec}</span>
                              <button type="button" onClick={() => removeListItem(pSpecs, setPSpecs, i)} className="text-red-500 hover:text-red-700"><X size={10} /></button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">Bonus Paket</label>
                        <div className="flex gap-1 mb-2">
                          <input
                            type="text"
                            placeholder="Input baru"
                            value={newBonus}
                            onChange={(e) => setNewBonus(e.target.value)}
                            className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => addListItem(pBonus, setPBonus, newBonus, setNewBonus)}
                            className="p-2 bg-slate-100 hover:bg-[#f8b1d2] hover:text-white rounded-xl transition-colors cursor-pointer"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <div className="space-y-1 max-h-[100px] overflow-y-auto pr-1">
                          {pBonus.map((b, i) => (
                            <div key={i} className="flex items-center justify-between bg-slate-50 px-2 py-1 rounded-lg text-[10px] text-slate-600">
                              <span className="truncate">{b}</span>
                              <button type="button" onClick={() => removeListItem(pBonus, setPBonus, i)} className="text-red-500 hover:text-red-700"><X size={10} /></button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">Bahan / Material</label>
                        <div className="flex gap-1 mb-2">
                          <input
                            type="text"
                            placeholder="Input baru"
                            value={newMaterial}
                            onChange={(e) => setNewMaterial(e.target.value)}
                            className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => addListItem(pMaterial, setPMaterial, newMaterial, setNewMaterial)}
                            className="p-2 bg-slate-100 hover:bg-[#f8b1d2] hover:text-white rounded-xl transition-colors cursor-pointer"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <div className="space-y-1 max-h-[100px] overflow-y-auto pr-1">
                          {pMaterial.map((m, i) => (
                            <div key={i} className="flex items-center justify-between bg-slate-50 px-2 py-1 rounded-lg text-[10px] text-slate-600">
                              <span className="truncate">{m}</span>
                              <button type="button" onClick={() => removeListItem(pMaterial, setPMaterial, i)} className="text-red-500 hover:text-red-700"><X size={10} /></button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Hampers Kue Kering Options */}
                    {pCategory === 'Hampers' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-[#b7d7f7]/5 border border-[#b7d7f7]/20 p-6 rounded-3xl mt-4 space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-xs font-bold uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                              🍪 Request Kue Kering (Kuker) untuk Hampers
                            </h4>
                            <p className="text-[10px] text-slate-400 mt-0.5">Daftar pilihan kue kering yang bisa dipilih oleh pembeli dalam Hampers ini.</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Contoh: Nastar Wisman, Kastengel Premium, Putri Salju"
                            value={newKukerOption}
                            onChange={(e) => setNewKukerOption(e.target.value)}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => addListItem(pKukerOptions, setPKukerOptions, newKukerOption, setNewKukerOption)}
                            className="py-2.5 px-4 bg-[#b7d7f7] hover:bg-[#b7d7f7]/80 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0"
                          >
                            Tambah Pilihan
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {pKukerOptions.map((opt, i) => (
                            <span key={i} className="inline-flex items-center gap-1.5 bg-white border border-[#b7d7f7]/20 px-3 py-1 rounded-full text-xs text-slate-600 font-medium">
                              ✨ {opt}
                              <button
                                type="button"
                                onClick={() => removeListItem(pKukerOptions, setPKukerOptions, i)}
                                className="text-red-500 hover:text-red-700 text-xs shrink-0 cursor-pointer font-bold"
                              >
                                &times;
                              </button>
                            </span>
                          ))}
                          {pKukerOptions.length === 0 && (
                            <span className="text-xs text-slate-400 italic">Belum ada pilihan kue kering. Tambahkan pilihan di atas agar muncul di detail produk.</span>
                          )}
                        </div>
                      </motion.div>
                    )}

                    <div className="flex gap-4 pt-4 border-t border-slate-50">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="flex-1 py-3.5 bg-[#f8b1d2] hover:bg-[#fbbaec] text-white text-xs font-bold uppercase tracking-widest rounded-2xl shadow-lg transition-all cursor-pointer disabled:opacity-60 disabled:cursor-wait flex items-center justify-center gap-2"
                      >
                        {isSaving ? <><Loader2 size={14} className="animate-spin" /> Menyimpan...</> : 'Simpan ke Katalog'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelProduct}
                        className="py-3.5 px-6 border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-widest rounded-2xl transition-all cursor-pointer"
                      >
                        Batal
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Product Lists Table */}
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/50">
                        <th className="py-4 px-6 text-xs font-bold uppercase text-slate-400 tracking-wider">Produk</th>
                        <th className="py-4 px-6 text-xs font-bold uppercase text-slate-400 tracking-wider">Kategori</th>
                        <th className="py-4 px-6 text-xs font-bold uppercase text-slate-400 tracking-wider">Harga</th>
                        <th className="py-4 px-6 text-xs font-bold uppercase text-slate-400 tracking-wider text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {productsList.map((product) => (
                        <tr key={product.id} className="hover:bg-slate-50/30 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                                <img src={product.image.startsWith('http') ? product.image : `./${product.image}`} className="w-full h-full object-cover" alt="" />
                              </div>
                              <div>
                                <span className="font-bold text-slate-800 block">{product.name}</span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                                  ID: {product.id}
                                  {product.bestSeller && <span className="bg-amber-50 text-amber-600 border border-amber-100 rounded-full px-2 py-0.5 scale-90">Best Seller</span>}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="px-3 py-1 bg-slate-50 text-slate-600 rounded-full text-xs font-medium border border-slate-100/50">
                              {Array.isArray(product.category) ? product.category.join(', ') : product.category}
                            </span>
                          </td>
                          <td className="py-4 px-6 font-bold text-slate-700">{product.price}</td>
                          <td className="py-4 px-6 text-right flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditProductClick(product)}
                              className="p-2.5 bg-slate-50 hover:bg-[#f8b1d2]/15 text-slate-400 hover:text-[#f8b1d2] rounded-full transition-colors cursor-pointer"
                              title="Edit Produk"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-2.5 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors cursor-pointer"
                              title="Hapus Produk"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COLLABORATIONS MANAGER */}
          {activeTab === 'collaborations' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-slate-800">Daftar Kolaborasi</h2>
                  <p className="text-xs text-slate-400">Total {collabsList.length} kelas / kegiatan kolaborasi</p>
                </div>
                {!showAddCollab && (
                  <button
                    onClick={() => setShowAddCollab(true)}
                    className="py-3 px-6 bg-[#f8b1d2] hover:bg-[#fbbaec] text-white text-xs font-bold uppercase tracking-widest rounded-2xl flex items-center gap-2 shadow-lg shadow-pink-100 transition-all cursor-pointer"
                  >
                    <Plus size={16} />
                    Tambah Kolaborasi
                  </button>
                )}
              </div>

              {/* Add Collaboration Form */}
              {showAddCollab && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-[#f8b1d2]/20 shadow-lg shadow-pink-50/20"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                    <h3 className="font-serif font-bold text-lg text-slate-800">
                      {editingCollab ? `Edit Kolaborasi: ${editingCollab.name}` : 'Kegiatan Kolaborasi Baru'}
                    </h3>
                    <button
                      onClick={handleCancelCollab}
                      className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <form onSubmit={handleAddCollabSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Nama Kegiatan</label>
                        <input
                          type="text"
                          required
                          placeholder="Scoopable Cookies Class"
                          value={cName}
                          onChange={(e) => setCName(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-[#f8b1d2] focus:ring-0 outline-none text-slate-700 transition-colors text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Jenis Kegiatan</label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Cooking Baking Class, Decoration Class, dll."
                          value={cType}
                          onChange={(e) => setCType(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-[#f8b1d2] focus:ring-0 outline-none text-slate-700 transition-colors text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Tanggal Kegiatan</label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: 28 Mei 2026"
                          value={cDate}
                          onChange={(e) => setCDate(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-[#f8b1d2] focus:ring-0 outline-none text-slate-700 transition-colors text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Lokasi Kegiatan</label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Fugo Hotel Banjarmasin"
                          value={cLocation}
                          onChange={(e) => setCLocation(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-[#f8b1d2] focus:ring-0 outline-none text-slate-700 transition-colors text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Poster / Gambar Utama (Upload / Link)</label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="text"
                            placeholder="Link gambar atau nama preset (misal: cookies collab 2.png)"
                            value={cImage}
                            onChange={(e) => {
                              setCImage(e.target.value);
                              setCVideoCover(e.target.value);
                            }}
                            className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 focus:border-[#f8b1d2] focus:ring-0 outline-none text-slate-700 text-sm"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            id="upload-collab-image"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e.target.files[0], (url) => {
                              setCImage(url);
                              setCVideoCover(url);
                            })}
                          />
                          <label
                            htmlFor="upload-collab-image"
                            className="py-3 px-4 bg-slate-100 hover:bg-[#f8b1d2] hover:text-white text-slate-600 rounded-2xl text-xs font-bold transition-all cursor-pointer border border-slate-100 flex items-center gap-1.5 shrink-0"
                          >
                            <ImageIcon size={14} /> Upload
                          </label>
                        </div>
                        {cImage && (
                          <div className="mt-2 flex items-center gap-2">
                            <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 shrink-0">
                              <img src={cImage.startsWith('data:') || cImage.startsWith('http') ? cImage : `./${cImage}`} className="w-full h-full object-cover" alt="Preview" />
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono truncate max-w-[200px]">Preview Poster Utama</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Embed Video URL (YouTube / Cloudinary)</label>
                        <input
                          type="text"
                          placeholder="https://player.cloudinary.com/embed/..."
                          value={cVideo}
                          onChange={(e) => setCVideo(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-[#f8b1d2] focus:ring-0 outline-none text-slate-700 transition-colors text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="cComingSoon"
                        checked={cComingSoon}
                        onChange={(e) => setCComingSoon(e.target.checked)}
                        className="w-4 h-4 rounded text-[#f8b1d2] border-slate-300 focus:ring-[#f8b1d2]"
                      />
                      <label htmlFor="cComingSoon" className="text-xs font-bold uppercase text-slate-600 tracking-wider cursor-pointer">
                        Status Coming Soon (Akan Datang) ⏳
                      </label>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Deskripsi Detail Kegiatan</label>
                      <textarea
                        required
                        placeholder="Deskripsikan keseruan, materi, benefit kelas..."
                        value={cDesc}
                        onChange={(e) => setCDesc(e.target.value)}
                        rows="3"
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-[#f8b1d2] focus:ring-0 outline-none text-slate-700 transition-colors text-sm"
                      />
                    </div>

                    {/* Partners and Gallery input lists */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-50">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">Mitra / Partners</label>
                        <div className="flex gap-1 mb-2">
                          <input
                            type="text"
                            placeholder="Your Cap / Wardah"
                            value={newPartner}
                            onChange={(e) => setNewPartner(e.target.value)}
                            className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => addListItem(cPartners, setCPartners, newPartner, setNewPartner)}
                            className="p-2 bg-slate-100 hover:bg-[#f8b1d2] hover:text-white rounded-xl transition-colors cursor-pointer"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {cPartners.map((pt, i) => (
                            <span key={i} className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full text-[10px] text-slate-600">
                              {pt}
                              <button type="button" onClick={() => removeListItem(cPartners, setCPartners, i)} className="text-red-500 hover:text-red-700"><X size={10} /></button>
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="sm:col-span-2 border-t border-slate-50 pt-4">
                        <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">Dokumentasi Galeri (Upload / Link)</label>
                        <div className="flex gap-2 items-center mb-4">
                          <input
                            type="text"
                            placeholder="Tulis Link/URL Gambar Galeri Baru"
                            value={newGalleryUrl}
                            onChange={(e) => setNewGalleryUrl(e.target.value)}
                            className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 focus:border-[#f8b1d2] focus:ring-0 outline-none text-slate-700 text-sm"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            id="upload-gallery-image"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e.target.files[0], (url) => {
                              if (url) {
                                setCGallery([...cGallery, url]);
                              }
                            })}
                          />
                          <label
                            htmlFor="upload-gallery-image"
                            className="py-3 px-4 bg-slate-100 hover:bg-[#f8b1d2] hover:text-white text-slate-600 rounded-2xl text-xs font-bold transition-all cursor-pointer border border-slate-100 flex items-center gap-1.5 shrink-0"
                          >
                            <ImageIcon size={14} /> Upload File
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              if (newGalleryUrl.trim()) {
                                setCGallery([...cGallery, newGalleryUrl.trim()]);
                                setNewGalleryUrl('');
                              }
                            }}
                            className="py-3 px-4 bg-[#f8b1d2] hover:bg-[#fbbaec] text-white rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                          >
                            Tambah
                          </button>
                        </div>

                        {/* Visual gallery grid */}
                        <div className="flex flex-wrap gap-3">
                          {cGallery.map((img, i) => (
                            <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-100 bg-slate-50 group shadow-sm">
                              <img src={img.startsWith('data:') || img.startsWith('http') ? img : `./${img}`} className="w-full h-full object-cover" alt="" />
                              <button
                                type="button"
                                onClick={() => setCGallery(cGallery.filter((_, idx) => idx !== i))}
                                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                          {cGallery.length === 0 && (
                            <span className="text-xs text-slate-400 font-medium">Belum ada dokumentasi galeri. Upload atau tambahkan link gambar di atas.</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-slate-50">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="flex-1 py-3.5 bg-[#f8b1d2] hover:bg-[#fbbaec] text-white text-xs font-bold uppercase tracking-widest rounded-2xl shadow-lg transition-all cursor-pointer disabled:opacity-60 disabled:cursor-wait flex items-center justify-center gap-2"
                      >
                        {isSaving ? <><Loader2 size={14} className="animate-spin" /> Menyimpan...</> : 'Simpan Kolaborasi'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelCollab}
                        className="py-3.5 px-6 border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-widest rounded-2xl transition-all cursor-pointer"
                      >
                        Batal
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Collaboration Table Lists */}
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/50">
                        <th className="py-4 px-6 text-xs font-bold uppercase text-slate-400 tracking-wider">Kegiatan</th>
                        <th className="py-4 px-6 text-xs font-bold uppercase text-slate-400 tracking-wider">Tanggal & Lokasi</th>
                        <th className="py-4 px-6 text-xs font-bold uppercase text-slate-400 tracking-wider">Partner</th>
                        <th className="py-4 px-6 text-xs font-bold uppercase text-slate-400 tracking-wider text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {collabsList.map((collab) => (
                        <tr key={collab.id} className="hover:bg-slate-50/30 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                                <img src={collab.image.startsWith('http') ? collab.image : `./${collab.image}`} className="w-full h-full object-cover" alt="" />
                              </div>
                              <div>
                                <span className="font-bold text-slate-800 block leading-tight">{collab.name}</span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-1">
                                  ID: {collab.id} &bull; {collab.type}
                                  {collab.isComingSoon && <span className="bg-pink-50 text-[#f8b1d2] border border-[#f8b1d2]/20 rounded-full px-2 py-0.5 scale-90">Coming Soon</span>}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="space-y-0.5">
                              <span className="text-slate-600 font-medium flex items-center gap-1 text-xs"><Calendar size={12} className="text-slate-400" /> {collab.date}</span>
                              <span className="text-slate-400 text-[11px] flex items-center gap-1"><MapPin size={12} className="text-slate-400" /> {collab.location}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                              {collab.partner.slice(0, 3).map((p, i) => (
                                <span key={i} className="px-2 py-0.5 bg-slate-50 text-slate-500 rounded-md text-[10px] border border-slate-100">{p}</span>
                              ))}
                              {collab.partner.length > 3 && <span className="text-[10px] text-slate-400 font-bold">+{collab.partner.length - 3}</span>}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-right flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditCollabClick(collab)}
                              className="p-2.5 bg-slate-50 hover:bg-[#f8b1d2]/15 text-slate-400 hover:text-[#f8b1d2] rounded-full transition-colors cursor-pointer"
                              title="Edit Kolaborasi"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteCollab(collab.id)}
                              className="p-2.5 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors cursor-pointer"
                              title="Hapus Kolaborasi"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EXPORT DATA.JS */}
          {activeTab === 'export' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-serif font-bold text-slate-800 font-serif">Ekspor Berkas data.js</h2>
                <p className="text-xs text-slate-400">Salin atau unduh berkas data.js baru yang menggabungkan seluruh perubahan data Anda secara otomatis.</p>
              </div>

              {isSupabaseConnected ? (
                <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-5 text-emerald-800 text-xs leading-relaxed space-y-2">
                  <p className="font-bold flex items-center gap-2 text-sm"><Cloud size={16} className="text-emerald-600 shrink-0" /> Supabase Cloud Terhubung — Perubahan Otomatis Tersimpan</p>
                  <p>
                    Semua perubahan yang Anda buat melalui panel admin (tambah, edit, hapus produk/kolaborasi) <strong>langsung tersimpan secara permanen di database cloud Supabase</strong> dan terlihat oleh semua pengunjung website secara real-time.
                  </p>
                  <p>
                    Fitur <strong>Ekspor data.js</strong> ini kini bersifat <strong>opsional sebagai cadangan (backup)</strong> — berguna jika Anda ingin menyimpan snapshot kode data lokal untuk arsip atau jika suatu saat ingin kembali ke mode offline.
                  </p>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-100 rounded-3xl p-5 text-amber-800 text-xs leading-relaxed space-y-2">
                  <p className="font-bold flex items-center gap-2 text-sm"><CloudOff size={16} className="text-amber-600 shrink-0" /> Mode Offline — Supabase Tidak Terhubung</p>
                  <p>
                    Supabase tidak terhubung. Data yang Anda tambahkan hanya tersimpan di sesi browser saat ini dan akan hilang jika halaman dimuat ulang.
                  </p>
                  <p>
                    Untuk menyimpannya secara <strong>permanen</strong>:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1.5 font-medium mt-2">
                    <li>Klik tombol <strong>"Unduh Berkas data.js"</strong> di bawah untuk mengunduh kode data terbaru.</li>
                    <li>Timpa berkas lama yang ada di folder proyek Anda di lokasi: <code>c:\laragon\www\florisse.id\src\data.js</code> dengan berkas yang baru saja diunduh.</li>
                    <li>Lakukan kompilasi/deploy ulang ke server. Selesai!</li>
                  </ol>
                </div>
              )}

              <div className="bg-slate-900 text-slate-200 p-6 rounded-[2rem] border border-slate-800 font-mono text-xs overflow-x-auto shadow-inner relative group max-h-[400px]">
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={handleCopyCode}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg flex items-center gap-1 text-[10px] font-bold uppercase transition-all cursor-pointer"
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? 'Tersalin' : 'Salin'}
                  </button>
                </div>
                <pre>{generateFullDataJs()}</pre>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  onClick={handleDownloadFile}
                  className="flex-1 py-4 bg-[#f8b1d2] hover:bg-[#fbbaec] text-white text-xs font-bold uppercase tracking-widest rounded-2xl shadow-lg shadow-pink-100 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download size={16} />
                  Unduh Berkas data.js Terbaru
                </button>

                <button
                  onClick={handleCopyCode}
                  className="py-4 px-6 border-2 border-slate-100 hover:border-[#f8b1d2]/40 hover:text-[#f8b1d2] text-slate-600 text-xs font-bold uppercase tracking-widest rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check size={16} /> Tersalin ke Clipboard!
                    </>
                  ) : (
                    <>
                      <Copy size={16} /> Salin Semua Kode
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-8 right-8 z-50 max-w-sm"
          >
            <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border text-sm font-medium ${
              toast.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              {toast.type === 'success' ? <CheckCircle size={18} className="text-emerald-500 shrink-0" /> : <AlertCircle size={18} className="text-red-500 shrink-0" />}
              <span className="text-xs leading-relaxed">{toast.message}</span>
              <button onClick={() => setToast(null)} className="ml-2 p-1 rounded-full hover:bg-black/5 transition-colors cursor-pointer shrink-0">
                <X size={12} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer copyright admin panel */}
      <footer className="py-6 border-t border-slate-100 bg-white text-center mt-12">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Panel Admin Florisse &bull; Desain Premium Terenkripsi &copy; 2026</p>
      </footer>
    </div>
  );
};

export default AdminDashboard;
