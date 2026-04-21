import { motion } from 'framer-motion';

// eslint-disable-next-line no-unused-vars
export default function FeatureCard({ icon: IconComponent, title, description }) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="relative group p-8 rounded-3xl bg-card dark:bg-[#111111] border border-slate-200 dark:border-white/10 overflow-hidden transition-all duration-300 shadow-sm hover:shadow-xl"
    >
      {/* Glowing Border Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/50 to-purple-500/50 rounded-3xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
      
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform duration-300">
          <IconComponent size={24} />
        </div>
        <h3 className="text-xl font-bold mb-3 text-foreground dark:text-white">{title}</h3>
        <p className="text-muted-foreground dark:text-slate-400 leading-relaxed font-medium">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
