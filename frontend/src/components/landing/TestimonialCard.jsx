import { motion } from 'framer-motion';

export default function TestimonialCard({ quote, name, role }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="p-8 rounded-3xl bg-card border border-slate-200 dark:border-white/10 shadow-lg relative h-full flex flex-col"
    >
      <div className="text-primary mb-6">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V21H14.017ZM6.017 21L6.017 18C6.017 16.8954 6.91243 16 8.017 16H11.017C11.5693 16 12.017 15.5523 12.017 15V9C12.017 8.44772 11.5693 8 11.017 8H7.017C6.46472 8 6.017 8.44772 6.017 9V11C6.017 11.5523 5.56929 12 5.017 12H4.017V21H6.017Z" />
        </svg>
      </div>
      <p className="text-foreground text-lg italic mb-8 grow leading-relaxed">
        "{quote}"
      </p>
      <div>
        <h4 className="font-bold text-foreground">{name}</h4>
        <p className="text-primary text-sm font-semibold">{role}</p>
      </div>
    </motion.div>
  );
}
