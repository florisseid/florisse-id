import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Play } from 'lucide-react';
import { colors, getWaLink } from '../data';
import FlowerLoader from './Loader';

const CollabDetail = ({ collab, onBack }) => {
  const [localLoading, setLocalLoading] = useState(true);

  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setLocalLoading(true);
    setIsPlaying(false);
    // Increased duration to 2.5s for visibility
    const timer = setTimeout(() => setLocalLoading(false), 2500);
    return () => clearTimeout(timer);
  }, [collab]);

  // Handle video URL to include autoplay if needed
  const getVideoUrl = (url) => {
    if (!url) return '';
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}autoplay=1`;
  };

  return (
    <motion.div
      key="collab-overlay"
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
            key="collab-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative h-[60vh] overflow-hidden">
              <img src={collab.image} className="w-full h-full object-cover" alt={collab.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent"></div>
              <button 
                onClick={onBack} 
                className="absolute top-10 left-10 p-4 rounded-full bg-white shadow-xl text-slate-800 hover:scale-110 transition"
              >
                <ArrowLeft size={24} />
              </button>
            </div>
            
            <div className="max-w-4xl mx-auto px-4 md:px-6 -mt-20 md:-mt-32 relative z-10">
              <div className="bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-slate-50">
                <div className="flex flex-wrap gap-2 md:gap-3 mb-6">
                  <span className="px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white" style={{ backgroundColor: colors.peach }}>{collab.type}</span>
                  <span className="px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-500">
                    Partner: {Array.isArray(collab.partner) 
                      ? collab.partner.length > 2 
                        ? collab.partner.slice(0, -1).join(', ') + ' & ' + collab.partner[collab.partner.length - 1]
                        : collab.partner.join(' & ')
                      : collab.partner}
                  </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-6 md:mb-8 leading-tight">{collab.name}</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-10 md:mb-12 border-b border-slate-100 pb-10 md:pb-12">
                   <div className="space-y-4 md:space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-[#fff2d2] text-[#f8b1d2]"><Calendar size={18} className="md:w-5 md:h-5"/></div>
                        <div>
                          <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Waktu Pelaksanaan</p>
                          <p className="font-bold text-slate-700 text-sm md:text-base">{collab.date}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-[#dadafb] text-[#f8b1d2]"><MapPin size={18} className="md:w-5 md:h-5"/></div>
                        <div>
                          <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Lokasi Acara</p>
                          <p className="font-bold text-slate-700 text-sm md:text-base">{collab.location}</p>
                        </div>
                      </div>
                   </div>
                   <p className="text-slate-500 leading-relaxed text-base md:text-lg italic">&ldquo;{collab.fullDesc}&rdquo;</p>
                </div>

                {/* Video Section */}
                {collab.video && (
                  <div className="mb-10 md:mb-12">
                    <h3 className="text-xl md:text-2xl font-serif font-bold mb-4 md:mb-6 flex items-center gap-2">
                      <Play size={18} className="md:w-5 md:h-5" style={{ color: colors.peach }} /> Highlight Video
                    </h3>
                    <div className="aspect-[16/9] sm:aspect-video w-full rounded-2xl md:rounded-[2rem] overflow-hidden shadow-lg border border-slate-100 bg-slate-900 relative group">
                      {!isPlaying ? (
                        <div className="absolute inset-0 cursor-pointer" onClick={() => setIsPlaying(true)}>
                          <img 
                            src={collab.videoCover || collab.image} 
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-50 transition-opacity duration-500" 
                            alt="Video Cover" 
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-2xl"
                            >
                              <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center text-[#f8b1d2]">
                                <Play size={24} className="md:w-8 md:h-8" fill="currentColor" />
                              </div>
                            </motion.div>
                          </div>
                        </div>
                      ) : (
                        <iframe 
                          width="100%" 
                          height="100%" 
                          src={getVideoUrl(collab.video)} 
                          title="Video player" 
                          frameBorder="0" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                        ></iframe>
                      )}
                    </div>
                  </div>
                )}

                {collab.gallery && collab.gallery.some(img => img && img.trim() !== '') && (
                  <div className="mt-10 md:mt-12">
                    <h3 className="text-xl md:text-2xl font-serif font-bold mb-4 md:mb-6">Momen Workshop</h3>
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      {collab.gallery.filter(img => img && img.trim() !== '').map((img, i) => (
                        <img key={i} src={img} className="w-full h-40 md:h-48 object-cover rounded-2xl md:rounded-3xl" alt="Gallery" />
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-10 md:mt-12 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="text-center md:text-left">
                    <h4 className="font-bold text-lg md:text-xl mb-1">Tertarik Kolaborasi?</h4>
                    <p className="text-xs md:text-sm text-slate-500">Bawa pengalaman floral ke komunitas atau brand Anda.</p>
                  </div>
                  <button 
                    onClick={() => window.open(getWaLink(`Halo Florisse! Saya tertarik untuk mendiskusikan peluang kolaborasi workshop.`), '_blank')}
                    className="w-full md:w-auto px-8 py-3.5 md:py-4 rounded-full text-white font-bold text-sm shadow-lg transition hover:scale-105 active:scale-95"
                    style={{ backgroundColor: colors.peach }}
                  >
                    Hubungi Tim Kolaborasi
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CollabDetail;
