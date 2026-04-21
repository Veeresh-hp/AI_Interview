import { motion } from 'framer-motion';
import { useResume } from '../../hooks/useResume';
import { Link } from 'react-router-dom';
import TemplateExecutive from './templates/TemplateExecutive';
import TemplateLaTeX from './templates/TemplateLaTeX';
import TemplateModern from './templates/TemplateModern';
import TemplateMinimalist from './templates/TemplateMinimalist';
import TemplateAurora from './templates/TemplateAurora';
import TemplateHyperion from './templates/TemplateHyperion';
import TemplateLunar from './templates/TemplateLunar';

const templates = [
  {
    id: 'executive',
    name: 'Executive Classic',
    description: 'Traditional academic/professional layout.',
    component: TemplateExecutive,
  },
  {
    id: 'latex',
    name: 'Academic LaTeX',
    description: 'Sophisticated serif design.',
    component: TemplateLaTeX,
  },
  {
    id: 'modern',
    name: 'Modern Impact',
    description: 'Bold corporate sans-serif.',
    component: TemplateModern,
  },
  {
    id: 'minimalist',
    name: 'Pure Minimalist',
    description: 'Clean whitespace & typography.',
    component: TemplateMinimalist,
  },
  {
    id: 'aurora',
    name: 'Aurora Creative',
    description: 'Vibrant pastel design.',
    component: TemplateAurora,
  },
  {
    id: 'hyperion',
    name: 'Hyperion Bold',
    description: 'Structured high-impact flow.',
    component: TemplateHyperion,
  },
  {
    id: 'lunar',
    name: 'Lunar Minimal',
    description: 'Monochrome elegance.',
    component: TemplateLunar,
  }
];

const TemplateSelector = () => {
  const { selectTemplate, formData, showGitHub } = useResume();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-8 py-16 overflow-y-auto transition-colors">
      <div className="max-w-[1240px] w-full">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6 px-4"
        >
          <div>
            <h1 className="text-5xl font-black text-foreground tracking-tighter mb-3">Resume Gallery</h1>
            <p className="text-[14px] text-slate-400 dark:text-[#B0B0B0] font-bold uppercase tracking-[0.3em] ml-1">Select your design foundation</p>
          </div>
          <Link to="/dashboard" className="px-8 py-4 bg-card border border-slate-200 dark:border-[#444444] text-foreground rounded-2xl font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-[#2a2a2a] transition-all text-[12px] shadow-sm flex items-center gap-2 group">
             <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
             Dashboard
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10">
          {templates.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -12 }}
              className="group cursor-pointer"
              onClick={() => selectTemplate(t.id)}
            >
              <div className="bg-card rounded-[3rem] border border-slate-200 dark:border-[#444444] overflow-hidden shadow-[0_15px_45px_rgb(0,0,0,0.03)] group-hover:shadow-[0_40px_80px_rgb(0,0,0,0.3)] group-hover:border-[#0ea5e9]/30 transition-all duration-700">
                {/* Visual Preview - Focused & Zoomed */}
                <div className="h-[300px] bg-background-alt relative overflow-hidden flex justify-center border-b border-slate-100 dark:border-[#2a2a2a]">
                  {idx === 0 && (
                    <div className="absolute top-6 right-6 z-20 px-4 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                      Flagship
                    </div>
                  )}
                  
                  {/* Glass Interactivity Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-[#0ea5e9]/5 transition-all duration-700 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-[2px]">
                     <div className="bg-background dark:bg-[#121212] px-8 py-4 rounded-2xl shadow-2xl scale-75 group-hover:scale-100 transition-all duration-500 border border-slate-200 dark:border-[#444444]">
                        <p className="text-[12px] font-black uppercase tracking-widest text-[#0ea5e9]">Use This Design</p>
                     </div>
                  </div>

                  {/* Zoomed Snapshot of the actual template */}
                  <div 
                    className="w-[794px] bg-white shadow-2xl origin-top mt-10 scale-[0.55] pointer-events-none group-hover:scale-[0.58] transition-all duration-[1.2s] ease-in-out"
                    style={{ minHeight: '1123px' }}
                  >
                    <t.component data={formData} showGitHub={showGitHub} />
                  </div>
                </div>

                {/* Refined Metadata Footer */}
                <div className="p-10 pt-12 text-center relative">
                    {/* Background Number */}
                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[80px] font-black text-slate-100 dark:text-[#2a2a2a] select-none pointer-events-none opacity-40 italic">
                      {idx + 1}
                    </span>
                    
                    <h3 className="text-xl font-black text-foreground mb-2 relative z-10">{t.name}</h3>
                    <p className="text-[13px] text-slate-400 dark:text-[#B0B0B0] font-bold leading-relaxed relative z-10">
                      {t.description}
                    </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;
