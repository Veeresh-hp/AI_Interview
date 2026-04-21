import { motion } from 'framer-motion';

// eslint-disable-next-line no-unused-vars
export default function StepItem({ number, icon: IconComponent, text, isLast }) {
  return (
    <div className="flex flex-col items-center flex-1 relative px-4 text-center group">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative z-10"
      >
        <div className="w-16 h-16 rounded-full bg-card border-2 border-slate-200 dark:border-white/10 flex items-center justify-center mb-6 text-foreground shadow-xl group-hover:border-primary/50 transition-colors duration-300">
          <IconComponent size={28} className="group-hover:text-primary transition-colors duration-300" />
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center shadow-lg">
            {number}
          </div>
        </div>
      </motion.div>
      
      <p className="font-bold text-lg mb-2 text-foreground">{text}</p>
      
      {!isLast && (
        <div className="hidden lg:block absolute top-8 left-[calc(50%+40px)] w-[calc(100%-80px)] h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
      )}
    </div>
  );
}
