import { motion } from 'framer-motion';
import { Calendar, ArrowRight, ExternalLink } from 'lucide-react';
import { colors, collaborations } from '../data';

const CollaborationSection = ({ setSelectedCollab }) => (
  <section id="collaboration" className="py-32 bg-slate-50">
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
            onClick={() => setSelectedCollab(col)}
            className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-500 cursor-pointer group sm:h-[350px]"
          >
            <div className="flex flex-col sm:flex-row h-full">
              <div className="sm:w-1/2 h-64 sm:h-full overflow-hidden relative">
                <img src={col.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={col.name} />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-[#fbbaec]/90 backdrop-blur p-4 rounded-full text-white"><ExternalLink size={20} /></div>
                </div>
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
                <div className="flex items-center gap-2 font-bold text-[10px] tracking-widest" style={{ color: colors.peach }}>
                  BACA CERITA <ArrowRight size={14} />
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
