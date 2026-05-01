import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-brand-white" id="hero">
      <div className="absolute inset-0 bg-grid opacity-20" />
      
      <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-block bg-brand-yellow px-4 py-2 border border-black mb-8">
            <span className="text-xs font-bold uppercase tracking-widest">New Collection — 2026</span>
          </div>
          <h1 className="text-7xl md:text-[120px] font-display font-bold leading-[0.85] tracking-tighter uppercase mb-8">
            ELEVAPE THE <br />
            <span className="text-brand-yellow-dark">HOUSE</span> STYLE
          </h1>
          <p className="text-lg text-black/60 max-w-md mb-10 leading-relaxed font-light">
            Discover a curated selection of minimal silhouettes designed for modern living. 
            Bright tones, architectural cuts, and sustainable fabrics.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-4 bg-brand-black text-white px-10 py-5 font-display font-medium uppercase tracking-widest group border border-transparent hover:bg-brand-yellow hover:text-black hover:border-black transition-all"
            id="hero-cta"
          >
            Shop Collection
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative"
        >
          <div className="relative aspect-[4/5] overflow-hidden border border-black/10 origin-bottom-right">
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop"
              alt="Editorial Fashion"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Decorative Overlay */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-yellow -translate-y-1/2 translate-x-1/2 mix-blend-multiply" />
          </div>
          
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-8 -left-8 bg-brand-white border border-black p-6 hidden md:block max-w-[240px]"
          >
            <p className="text-xs font-bold uppercase tracking-tighter mb-2 italic">Aesthetic Focus</p>
            <p className="text-sm font-light leading-snug">
              Every piece in our house is chosen for its architectural integrity and bold yellow presence.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
