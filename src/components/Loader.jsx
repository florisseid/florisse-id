import React from 'react';
import { motion } from 'framer-motion';

const FlowerLoader = ({ message = "Bloom in Every Moment" }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Soft Background Glow */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[500px] h-[500px] bg-[#f8b1d2]/15 rounded-full blur-[100px]"
      />

      <div className="relative z-10 flex flex-col items-center">
        <div className="relative w-44 h-44 flex items-center justify-center">
          {/* Outer Petals Layer - Circular Sequential Blooming */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <motion.div
              key={`outer-${angle}`}
              className="absolute w-12 h-24 rounded-full"
              style={{ 
                backgroundColor: '#f8b1d2',
                opacity: 0.2,
                rotate: `${angle}deg`,
                originY: '100%',
                top: '-10%',
                willChange: 'transform'
              }}
              initial={{ scale: 0, opacity: 0, rotate: angle - 30 }}
              animate={{ 
                scale: [0, 1.1, 1],
                opacity: 0.2,
                rotate: angle
              }}
              transition={{ 
                delay: i * 0.1,
                duration: 1,
                ease: "easeOut",
                scale: {
                  delay: 1.5,
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                  values: [1, 1.05, 1]
                }
              }}
            />
          ))}

          {/* Inner Petals Layer */}
          {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle, i) => (
            <motion.div
              key={`inner-${angle}`}
              className="absolute w-10 h-20 rounded-full"
              style={{ 
                backgroundColor: '#f8b1d2',
                rotate: `${angle}deg`,
                originY: '100%',
                top: '0%',
                willChange: 'transform',
                boxShadow: '0 4px 10px rgba(248, 177, 210, 0.2)'
              }}
              initial={{ scale: 0, opacity: 0, rotate: angle - 30 }}
              animate={{ 
                scale: [0, 1, 0.95],
                opacity: 1,
                rotate: angle
              }}
              transition={{ 
                delay: 0.5 + (i * 0.1),
                duration: 1,
                ease: "easeOut",
                scale: {
                  delay: 1.8,
                  duration: 2.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  values: [0.95, 1.02, 0.95]
                }
              }}
            />
          ))}

          {/* Center Core */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
            className="w-10 h-10 bg-yellow-200 rounded-full shadow-inner relative z-20 flex items-center justify-center border-2 border-white/50"
          >
             <div className="w-5 h-5 bg-yellow-400/30 rounded-full blur-[2px]" />
          </motion.div>
        </div>

        {/* Text Animation */}
        <div className="mt-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="text-3xl font-serif font-bold text-slate-900 tracking-tight"
          >
            Florisse.id
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 120 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="h-[1.5px] bg-[#f8b1d2] mx-auto my-4 rounded-full"
          />
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-[11px] uppercase tracking-[0.5em] text-slate-400 font-semibold"
          >
            {message}
          </motion.p>
        </div>
      </div>

      {/* Falling Petals Background */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-5 h-7 bg-[#f8b1d2]/15 rounded-full"
            style={{ 
              left: `${Math.random() * 100}%`,
              top: '-10%',
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%'
            }}
            animate={{ 
              top: '110%',
              rotate: [0, 360, 720]
            }}
            transition={{ 
              duration: 7 + Math.random() * 5,
              repeat: Infinity, 
              ease: "linear",
              delay: i * 0.8
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default FlowerLoader;
