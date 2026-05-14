import { motion } from 'framer-motion';
import { colors, products } from '../data';
import { Layers } from 'lucide-react';

const CatalogSection = ({ activeFilter, setActiveFilter, setSelectedProduct }) => (
  <section id="products" aria-label="Katalog produk Florisse" className="py-32 bg-white">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-20">
        <h2 className="text-5xl font-serif font-bold text-slate-900 mb-6">Pilih Hadiah Terbaik</h2>
        <div className="flex justify-start md:justify-center gap-4 overflow-x-auto no-scrollbar pb-4 px-2" role="group" aria-label="Filter kategori produk">
          {['Semua', 'Buket', 'Flower Box', 'Hampers', 'Collab Product'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              aria-pressed={activeFilter === cat}
              className={`px-8 py-2.5 rounded-full text-xs font-bold tracking-widest transition-all duration-300 ${activeFilter === cat ? 'text-white shadow-md' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
              style={{ backgroundColor: activeFilter === cat ? colors.peach : '' }}
            >{cat.toUpperCase()}</button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {products.filter(p => activeFilter === 'Semua' || (Array.isArray(p.category) ? p.category.includes(activeFilter) : p.category === activeFilter)).map((product) => (
          <motion.div
            key={product.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="group cursor-pointer"
            onClick={() => setSelectedProduct(product)}
            role="button"
            tabIndex={0}
            aria-label={`Lihat detail produk ${product.name}`}
            onKeyDown={(e) => e.key === 'Enter' && setSelectedProduct(product)}
          >
            <div className="relative rounded-[2rem] overflow-hidden mb-6 aspect-[4/5] shadow-sm group-hover:shadow-xl transition-all duration-500 bg-white">
              <img
                src={product.image}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                alt={product.name}
                loading="lazy"
                width="400"
                height="500"
              />

              {/* Variants Mini Previews */}
              {product.variants && product.variants.length > 1 && (
                <div className="absolute bottom-4 left-4 right-4 flex gap-2 z-20">
                  {product.variants.slice(0, 4).map((v, idx) => (
                    <div key={idx} className="w-8 h-8 rounded-lg overflow-hidden border border-white/50 shadow-sm">
                      <img src={v} className="w-full h-full object-cover" alt={`Varian ${idx + 1} dari ${product.name}`} loading="lazy" width="32" height="32" />
                    </div>
                  ))}
                  {product.variants.length > 4 && (
                    <div className="w-8 h-8 rounded-lg bg-black/50 backdrop-blur-sm flex items-center justify-center text-[10px] text-white font-bold border border-white/50">
                      +{product.variants.length - 4}
                    </div>
                  )}
                </div>
              )}

              {/* Variants Badge */}
              {product.variants && product.variants.length > 1 && (
                <div className="absolute top-6 right-6 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm z-20" aria-hidden="true">
                  <Layers size={14} style={{ color: colors.peach }} />
                  <span className="text-[10px] font-bold text-slate-600">{product.variants.length} Varian</span>
                </div>
              )}

              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10" aria-hidden="true">
                <div className="bg-white px-6 py-2.5 rounded-full font-bold text-xs shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform" style={{ color: colors.peach }}>LIHAT DETAIL</div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-[#f8b1d2] transition-colors">{product.name}</h3>
            <p className="font-black text-lg" style={{ color: colors.peach }}>{product.price}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default CatalogSection;
