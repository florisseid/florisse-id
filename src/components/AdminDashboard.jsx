import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Users, Download, LogOut, Trash2, Plus, 
  Sparkles, Check, Copy, X, Calendar, MapPin, Tag, Video, Image as ImageIcon,
  Edit
} from 'lucide-react';
import { colors } from '../data';

const AdminDashboard = ({ 
  productsList, 
  setProductsList, 
  collabsList, 
  setCollabsList, 
  onLogout,
  onBackToHome 
}) => {
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'collaborations', 'export'
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCollab, setShowAddCollab] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCollab, setEditingCollab] = useState(null);
  const [copied, setCopied] = useState(false);

  // States for new product form
  const [pName, setPName] = useState('');
  const [pPrice, setPPrice] = useState('Rp 50.000');
  const [pCategory, setPCategory] = useState('Buket');
  const [pImage, setPImage] = useState('1.jpeg');
  const [pDesc, setPDesc] = useState('');
  const [pBestSeller, setPBestSeller] = useState(false);
  const [pSpecs, setPSpecs] = useState(['Rangkaian bunga premium', 'Pita lucu']);
  const [pBonus, setPBonus] = useState(['FREE Packaging', 'Kartu ucapan']);
  const [pMaterial, setPMaterial] = useState(['Artificial Flower Premium']);
  const [newSpec, setNewSpec] = useState('');
  const [newBonus, setNewBonus] = useState('');
  const [newMaterial, setNewMaterial] = useState('');

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

  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    if (editingProduct) {
      // Edit mode
      const updatedProduct = {
        ...editingProduct,
        name: pName || 'Buket Bunga Baru',
        category: pCategory,
        price: pPrice,
        image: pImage || '1.jpeg',
        variants: [pImage || '1.jpeg'],
        bestSeller: pBestSeller,
        desc: pDesc || 'Rangkaian bunga yang elegan dari Florisse.',
        specs: pSpecs.filter(Boolean),
        bonus: pBonus.filter(Boolean),
        material: pMaterial.filter(Boolean)
      };
      setProductsList(productsList.map(p => p.id === editingProduct.id ? updatedProduct : p));
      setEditingProduct(null);
    } else {
      // Add mode
      const newId = productsList.length > 0 ? Math.max(...productsList.map(p => p.id)) + 1 : 1;
      const newProduct = {
        id: newId,
        name: pName || 'Buket Bunga Baru',
        category: pCategory,
        price: pPrice,
        image: pImage || '1.jpeg',
        variants: [pImage || '1.jpeg'],
        bestSeller: pBestSeller,
        desc: pDesc || 'Rangkaian bunga yang elegan dari Florisse.',
        specs: pSpecs.filter(Boolean),
        bonus: pBonus.filter(Boolean),
        material: pMaterial.filter(Boolean)
      };
      setProductsList([...productsList, newProduct]);
    }
    setShowAddProduct(false);

    // Reset fields
    setPName('');
    setPPrice('Rp 50.000');
    setPCategory('Buket');
    setPDesc('');
    setPBestSeller(false);
    setPSpecs(['Rangkaian bunga premium', 'Pita lucu']);
    setPBonus(['FREE Packaging', 'Kartu ucapan']);
    setPMaterial(['Artificial Flower Premium']);
  };

  const handleEditProductClick = (product) => {
    setEditingProduct(product);
    setPName(product.name);
    setPPrice(product.price);
    setPCategory(Array.isArray(product.category) ? product.category[0] : product.category);
    setPImage(product.image);
    setPDesc(product.desc);
    setPBestSeller(!!product.bestSeller);
    setPSpecs(product.specs || []);
    setPBonus(product.bonus || []);
    setPMaterial(product.material || []);
    setShowAddProduct(true);
  };

  const handleCancelProduct = () => {
    setEditingProduct(null);
    setShowAddProduct(false);
    setPName('');
    setPPrice('Rp 50.000');
    setPCategory('Buket');
    setPDesc('');
    setPBestSeller(false);
    setPSpecs(['Rangkaian bunga premium', 'Pita lucu']);
    setPBonus(['FREE Packaging', 'Kartu ucapan']);
    setPMaterial(['Artificial Flower Premium']);
  };

  const handleAddCollabSubmit = (e) => {
    e.preventDefault();
    if (editingCollab) {
      // Edit mode
      const updatedCollab = {
        ...editingCollab,
        name: cName || 'Kelas Baru',
        type: cType,
        isComingSoon: cComingSoon,
        partner: cPartners.filter(Boolean),
        date: cDate || 'Segera Hadir',
        location: cLocation || 'TBA',
        fullDesc: cDesc || 'Ikuti keseruan kelas dekorasi/baking kolaborasi.',
        image: cImage || 'cookies collab 2.png',
        videoCover: cVideoCover || 'cookies collab 2.png',
        video: cVideo || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        gallery: cGallery.length > 0 ? cGallery.filter(Boolean) : [cImage || 'cookies collab 2.png']
      };
      setCollabsList(collabsList.map(c => c.id === editingCollab.id ? updatedCollab : c));
      setEditingCollab(null);
    } else {
      // Add mode
      const newId = collabsList.length > 0 ? Math.max(...collabsList.map(c => c.id)) + 1 : 101;
      const newCollab = {
        id: newId,
        name: cName || 'Kelas Baru',
        type: cType,
        isComingSoon: cComingSoon,
        partner: cPartners.filter(Boolean),
        date: cDate || 'Segera Hadir',
        location: cLocation || 'TBA',
        fullDesc: cDesc || 'Ikuti keseruan kelas dekorasi/baking kolaborasi.',
        image: cImage || 'cookies collab 2.png',
        videoCover: cVideoCover || 'cookies collab 2.png',
        video: cVideo || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        gallery: cGallery.length > 0 ? cGallery.filter(Boolean) : [cImage || 'cookies collab 2.png']
      };
      setCollabsList([...collabsList, newCollab]);
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
    setCDate('');
    setCLocation('');
    setCDesc('');
    setCVideo('');
    setCPartners(['Your Cap']);
    setCGallery([]);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini dari katalog?')) {
      setProductsList(productsList.filter(p => p.id !== id));
    }
  };

  const handleDeleteCollab = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kolaborasi ini?')) {
      setCollabsList(collabsList.filter(c => c.id !== id));
    }
  };

  // Generate full code content for data.js
  const generateFullDataJs = () => {
    // Generate formatting
    const formattedProducts = productsList.map(p => {
      return `  {
    id: ${p.id},
    name: '${p.name.replace(/'/g, "\\'")}',
    category: ${Array.isArray(p.category) ? JSON.stringify(p.category) : `'${p.category}'`},
    price: '${p.price}',
    image: '${p.image}',
    variants: ${JSON.stringify(p.variants || [])},
    bestSeller: ${p.bestSeller},
    desc: '${p.desc.replace(/'/g, "\\'").replace(/\n/g, " ")}',
    specs: ${JSON.stringify(p.specs)},
    bonus: ${JSON.stringify(p.bonus)},
    material: ${JSON.stringify(p.material)}
  }`;
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
    const file = new Blob([generateFullDataJs()], {type: 'text/javascript'});
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
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Dashboard &bull; Mode Pengelola</p>
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

          <div className="bg-white/80 p-6 rounded-3xl border border-slate-100/50 shadow-sm text-center hidden md:block">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Simpan Hasil Kerja</p>
            <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
              Perubahan Anda disimpan di browser. Untuk memperbarui server web secara permanen, gunakan menu <strong>Ekspor data.js</strong>.
            </p>
            <button
              onClick={() => setActiveTab('export')}
              className="py-2.5 px-4 w-full bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Buka Halaman Ekspor
            </button>
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
                        <select
                          value={pCategory}
                          onChange={(e) => setPCategory(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-[#f8b1d2] focus:ring-0 outline-none text-slate-700 transition-colors text-sm bg-white"
                        >
                          <option value="Buket">Buket</option>
                          <option value="Flower Box">Flower Box</option>
                          <option value="Hampers">Hampers</option>
                          <option value="Collab Product">Collab Product</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Gambar Utama (File / Preset)</label>
                        <select
                          value={pImage}
                          onChange={(e) => setPImage(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-[#f8b1d2] focus:ring-0 outline-none text-slate-700 text-sm bg-white"
                        >
                          <option value="1.jpeg">Bucket Bunga 1 (1.jpeg)</option>
                          <option value="2.jpeg">Flower Bag Pink (2.jpeg)</option>
                          <option value="13.jpeg">Single Bouquet Pink (13.jpeg)</option>
                          <option value="Flower Bag Purple.jpg">Flower Bag Purple.jpg</option>
                          <option value="board.jpg">The Flora Board (board.jpg)</option>
                          <option value="Hampers Lebaran.jpg">Hampers Lebaran.jpg</option>
                        </select>
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

                    <div className="flex gap-4 pt-4 border-t border-slate-50">
                      <button
                        type="submit"
                        className="flex-1 py-3.5 bg-[#f8b1d2] hover:bg-[#fbbaec] text-white text-xs font-bold uppercase tracking-widest rounded-2xl shadow-lg transition-all cursor-pointer"
                      >
                        Simpan ke Katalog
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
                        <select
                          value={cType}
                          onChange={(e) => setCType(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-[#f8b1d2] focus:ring-0 outline-none text-slate-700 transition-colors text-sm bg-white"
                        >
                          <option value="Cooking Baking Class">Cooking Baking Class</option>
                          <option value="Journaling Class">Journaling Class</option>
                          <option value="Decoration Class">Decoration Class</option>
                          <option value="Event">Event / Lainnya</option>
                        </select>
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
                        <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Poster / Gambar Utama</label>
                        <select
                          value={cImage}
                          onChange={(e) => {
                            setCImage(e.target.value);
                            setCVideoCover(e.target.value);
                          }}
                          className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-[#f8b1d2] text-sm bg-white"
                        >
                          <option value="cookies collab 2.png">Cookies Class (cookies collab 2.png)</option>
                          <option value="journaling class 1.png">Journaling Class (journaling class 1.png)</option>
                          <option value="mochi.png">Mochi Class (mochi.png)</option>
                          <option value="chuncky bag 1.png">Chunky Bag 1 (chuncky bag 1.png)</option>
                          <option value="bow.png">Fairy Bow Class (bow.png)</option>
                          <option value="box.png">Dessert Box Class (box.png)</option>
                        </select>
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

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">Dokumentasi Galeri (URL/Filename)</label>
                        <div className="flex gap-1 mb-2">
                          <input
                            type="text"
                            placeholder="kegiatan/foto1.jpg"
                            value={newGalleryUrl}
                            onChange={(e) => setNewGalleryUrl(e.target.value)}
                            className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => addListItem(cGallery, setCGallery, newGalleryUrl, setNewGalleryUrl)}
                            className="p-2 bg-slate-100 hover:bg-[#f8b1d2] hover:text-white rounded-xl transition-colors cursor-pointer"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <div className="space-y-1 max-h-[80px] overflow-y-auto pr-1">
                          {cGallery.map((img, i) => (
                            <div key={i} className="flex items-center justify-between bg-slate-50 px-2 py-1 rounded-lg text-[10px] text-slate-600">
                              <span className="truncate">{img}</span>
                              <button type="button" onClick={() => removeListItem(cGallery, setCGallery, i)} className="text-red-500 hover:text-red-700"><X size={10} /></button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-slate-50">
                      <button
                        type="submit"
                        className="flex-1 py-3.5 bg-[#f8b1d2] hover:bg-[#fbbaec] text-white text-xs font-bold uppercase tracking-widest rounded-2xl shadow-lg transition-all cursor-pointer"
                      >
                        Simpan Kolaborasi
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

              <div className="bg-amber-50 border border-amber-100 rounded-3xl p-5 text-amber-800 text-xs leading-relaxed space-y-2">
                <p className="font-bold flex items-center gap-2 text-sm"><Sparkles size={16} className="text-amber-600 shrink-0" /> PENTING: Cara Menyimpan Perubahan secara Permanen</p>
                <p>
                  Karena website ini berjalan di sisi pengguna (*client-side*), data buket atau kolaborasi baru yang Anda tambahkan disimpan sementara di peramban internet (*localStorage*) Anda.
                </p>
                <p>
                  Untuk menyimpannya secara <strong>permanen dan mempublikasikannya agar terlihat oleh semua pengunjung website</strong>:
                </p>
                <ol className="list-decimal pl-5 space-y-1.5 font-medium mt-2">
                  <li>Klik tombol <strong>"Unduh Berkas data.js"</strong> di bawah untuk mengunduh kode data terbaru.</li>
                  <li>Timpa berkas lama yang ada di folder proyek Anda di lokasi: <code>c:\laragon\www\florisse.id\src\data.js</code> dengan berkas yang baru saja diunduh.</li>
                  <li>Lakukan kompilasi/deploy ulang ke server Netlify atau Vercel. Selesai!</li>
                </ol>
              </div>

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
      
      {/* Footer copyright admin panel */}
      <footer className="py-6 border-t border-slate-100 bg-white text-center mt-12">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Panel Admin Florisse &bull; Desain Premium Terenkripsi &copy; 2026</p>
      </footer>
    </div>
  );
};

export default AdminDashboard;
