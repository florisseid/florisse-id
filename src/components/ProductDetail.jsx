import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Package, Heart } from 'lucide-react';
import { colors, getWaLink } from '../data';
import FlowerLoader from './Loader';

const ProductDetail = ({ product, onBack }) => {
  const [mainImage, setMainImage] = useState(product.image);
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    // Force loading state when product changes
    setLocalLoading(true);
    setMainImage(product.image);
    
    // Increased duration to 2.5s so the animation is clearly visible
    const timer = setTimeout(() => {
      setLocalLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [product]);

  return (
    <motion.div
      key="product-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] bg-white overflow-y-auto"
    >
      <AnimatePresence mode="wait">
        {localLoading ? (
          <FlowerLoader key="loader" message="Wait a Moment Please" />
        ) : (
          <motion.div
            key="product-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="pt-32 pb-20 max-w-6xl mx-auto px-6"
          >
            <button onClick={onBack} className="flex items-center gap-2 font-bold text-slate-400 transition mb-10 group">
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition" style={{ color: colors.peach }} />
              <span className="group-hover:text-slate-800 uppercase tracking-widest text-xs">Kembali ke Katalog</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="space-y-6">
                <motion.div
                  key={mainImage}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-100 aspect-square"
                >
                  <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
                </motion.div>

                {/* Variants Section */}
                {product.variants && product.variants.length > 0 && (
                  <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
                    {product.variants.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setMainImage(img)}
                        className={`relative w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${mainImage === img ? 'border-[#f8b1d2] scale-105 shadow-md' : 'border-transparent hover:border-slate-200'}`}
                      >
                        <img src={img} className="w-full h-full object-cover" alt={`${product.name} variant ${i + 1}`} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-8">
                <div>
                  <span className="font-bold tracking-widest text-[10px] uppercase" style={{ color: colors.peach }}>{Array.isArray(product.category) ? product.category.join(' • ') : product.category}</span>
                  <h1 className="text-5xl font-serif font-bold mt-2 text-slate-900">{product.name}</h1>
                  <p className="text-3xl font-black mt-4" style={{ color: colors.peach }}>{product.price}</p>
                </div>
                <p className="text-slate-500 text-lg leading-relaxed">{product.desc}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 rounded-3xl border border-slate-100 bg-slate-50/50">
                    <h4 className="font-bold mb-3 flex items-center gap-2" style={{ color: colors.peach }}><Package size={18} /> Isi Paket</h4>
                    <ul className="text-sm space-y-2 text-slate-600">
                      {product.specs.map((s, i) => <li key={i}>• {s}</li>)}
                    </ul>
                  </div>
                  <div className="p-6 rounded-3xl border border-slate-100 bg-white">
                    <h4 className="font-bold mb-3 flex items-center gap-2" style={{ color: colors.peach }}><Heart size={18} /> Bonus </h4>
                    <ul className="text-sm space-y-2 text-slate-600">
                      {product.bonus.map((s, i) => <li key={i}>• {s}</li>)}
                    </ul>
                  </div>
                  <div className="p-6 rounded-3xl border border-slate-100 bg-white">
                    <h4 className="font-bold mb-3 flex items-center gap-2" style={{ color: colors.peach }}><Heart size={18} /> Material </h4>
                    <ul className="text-sm space-y-2 text-slate-600">
                      {product.material.map((s, i) => <li key={i}>• {s}</li>)}
                    </ul>
                  </div>
                  {product.kukerOptions && (
                    <div className="p-6 rounded-3xl border border-[#b7d7f7] bg-[#b7d7f7]/5">
                      <h4 className="font-bold mb-3 flex items-center gap-2 text-[#b7d7f7]"><Package size={18} /> Request Kuker</h4>
                      <ul className="text-sm space-y-2 text-slate-600">
                        {product.kukerOptions.map((s, i) => <li key={i}>✨ {s}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => window.open(getWaLink(`Halo Florisse! Saya berminat untuk memesan ${product.name}`), '_blank')}
                  className="w-full py-5 rounded-2xl text-white font-bold text-lg shadow-lg transition transform hover:-translate-y-1 flex items-center justify-center gap-2"
                  style={{ backgroundColor: colors.peach }}
                >
                  Pesan via WhatsApp <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductDetail;
