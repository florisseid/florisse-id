import { motion } from 'framer-motion';
import { Calendar, ArrowRight, ExternalLink } from 'lucide-react';
import { colors, collaborations } from '../data';

const CollaborationSection = ({ setSelectedCollab }) => (
  <section id="collaboration" aria-label="Kolaborasi dan workshop Florisse" className="py-32 bg-slate-50">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div className="max-w-xl">
          <span className="font-bold tracking-widest text-xs uppercase" style={{ color: colors.peach }}>Portfolio Kami</span>
          <h2 className="text-5xl font-serif font-bold mt-4 text-slate-900">Kolaborasi Workshop</h2>
          <p className="mt-6 text-slate-500 text-lg">Berbagi kebahagiaan melalui edukasi yang seru bersama brand terpercaya.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {collaborations.map((col) => (
          <motion.div
            key={col.id}
            whileHover={{ y: -10 }}
            onClick={() => !col.isComingSoon && setSelectedCollab(col)}
            role="button"
            tabIndex={0}
            aria-label={col.isComingSoon ? `${col.name} - Coming Soon` : `Lihat detail kolaborasi: ${col.name}`}
            onKeyDown={(e) => e.key === 'Enter' && !col.isComingSoon && setSelectedCollab(col)}
            className={`bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-500 group sm:h-[350px] ${col.isComingSoon ? 'cursor-default opacity-90' : 'cursor-pointer'}`}
          >
            <div className="flex flex-col sm:flex-row h-full">
              <div className="sm:w-1/2 h-64 sm:h-full overflow-hidden relative">
                <img
                  src={col.image}
                  className={`w-full h-full object-cover transition-transform duration-700 ${!col.isComingSoon && 'group-hover:scale-110'}`}
                  alt={col.name}
                  loading="lazy"
                  width="400"
                  height="350"
                />
                {col.isComingSoon && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm border border-slate-100 uppercase tracking-widest">
                      Coming Soon
                    </span>
                  </div>
                )}
                {!col.isComingSoon && (
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" aria-hidden="true">
                    <div className="bg-[#fbbaec]/90 backdrop-blur p-4 rounded-full text-white"><ExternalLink size={20} /></div>
                  </div>
                )}
              </div>
              <div className="sm:w-1/2 p-10 flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-bold uppercase tracking-widest mb-4">
                  <div className="flex items-center gap-1.5" style={{ color: colors.peach }}>
                    <Calendar size={12} /> {col.date}
                  </div>
                  <div className="text-slate-400">
                    Partner: {Array.isArray(col.partner)
                      ? col.partner.length > 2
                        ? col.partner.slice(0, -1).join(', ') + ' & ' + col.partner[col.partner.length - 1]
                        : col.partner.join(' & ')
                      : col.partner}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-800 leading-tight">{col.name}</h3>
                <p className="text-slate-400 text-sm line-clamp-2 mb-6">{col.fullDesc}</p>
                <div className="flex items-center gap-2 font-bold text-[10px] tracking-widest" style={{ color: col.isComingSoon ? '#cbd5e1' : colors.peach }}>
                  {col.isComingSoon ? 'BELUM TERSEDIA' : 'BACA CERITA'} {!col.isComingSoon && <ArrowRight size={14} />}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default CollaborationSection;
