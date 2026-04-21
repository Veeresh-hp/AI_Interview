import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center relative overflow-hidden bg-[#fafafa]">
      
      {/* Navigation Pill */}
      <header className="w-full max-w-[1400px] px-8 mt-4 z-50">
        <nav className="bg-white px-8 md:px-12 py-3 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-between border border-slate-100">
          <div className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 border-2 border-slate-900 bg-slate-900 text-white rounded flex items-center justify-center text-[10px] tracking-tighter">AI</span>
            AI Interview
          </div>
          <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-slate-600">
            {/* Products Dropdown */}
            <div className="relative group py-2">
              <button className="flex items-center gap-1 hover:text-[#0ea5e9] transition-colors focus:outline-none">
                Products 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:rotate-180 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col overflow-hidden z-50">
                <Link to="/resume-builder" className="px-5 py-4 hover:bg-[#f0f9ff] text-slate-700 font-semibold transition-colors flex items-center gap-3">
                   <span className="text-xl">📄</span> Resume Builder
                </Link>
                <Link to="/interview" className="px-5 py-4 hover:bg-[#f0f9ff] text-slate-700 font-semibold transition-colors border-t border-slate-50 flex items-center gap-3">
                   <span className="text-xl">🎙️</span> Mock Interviews
                </Link>
              </div>
            </div>

            {/* Dashboard & Pricing */}
            <Link to="/dashboard" className="hover:text-[#0ea5e9] transition-colors py-2">Dashboard</Link>
            <Link to="/pricing" className="hover:text-[#0ea5e9] transition-colors py-2">Pricing</Link>
          </div>
          <Link to="/auth" className="bg-[#111] text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-black transition-colors shadow-md">
            Get Started
          </Link>
        </nav>
      </header>

      {/* Background soft glow */ }
      <div className="absolute top-0 w-full h-[500px] bg-gradient-to-b from-[#f0f9ff]/50 to-transparent pointer-events-none" />

      <main className="z-10 text-left px-4 md:px-8 max-w-[1400px] w-full mt-2 md:mt-4 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 xl:gap-20">
        <div className="w-full max-w-[550px] xl:max-w-[600px] shrink-0">
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="text-[#0ea5e9] font-bold tracking-wide mb-2 text-base"
          >
             #1 AI Career Tool for GenZ
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl lg:text-[48px] xl:text-[52px] font-extrabold tracking-tight mb-4 text-slate-900 leading-[1.05]"
          >
            An AI mock interviewer<br />
            driven by your resume<br />
            and job description.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base text-slate-700 mb-5 max-w-[480px] leading-relaxed font-medium"
          >
            Built for GenZ. AI Interview automates your entire job hunt with AI from job matching to interview prep.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col xl:flex-row items-start xl:items-center gap-4 mt-2"
          >
            <Link to="/interview" className="px-6 py-3 bg-[#111] text-white rounded-full font-bold hover:bg-black transition-all shadow-xl shadow-black/10 hover:-translate-y-0.5 text-sm">
              Land more interviews for free
            </Link>
            <Link to="/auth" className="text-[#0ea5e9] hover:text-[#0284c7] hover:underline font-semibold text-sm transition-colors mt-2 xl:mt-4 xl:ml-0">
              Already have an account? Sign in
            </Link>
          </motion.div>
        </div>

        {/* Right side artistic graphic */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full flex justify-center lg:justify-start mt-4 lg:mt-0 max-w-[400px] xl:max-w-[480px]"
        >
           <img src="/hero_illustration.png" alt="AI Job Hunt Illustration" className="w-full object-contain origin-left" />
        </motion.div>
      </main>

      {/* Footer / Logos section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="w-full max-w-[1300px] px-8 mt-2 pb-6 pt-4 flex flex-col lg:flex-row items-center justify-between gap-6 text-slate-400 font-semibold text-sm relative z-10"
      >
         <div className="whitespace-nowrap">Users landed roles at</div>
         <div className="flex flex-wrap justify-center lg:justify-end gap-10 lg:gap-14 items-center grayscale opacity-50">
            <span className="text-xl font-bold font-serif hover:grayscale-0 hover:opacity-100 transition-all cursor-default">Meta</span>
            <span className="text-xl font-bold hover:grayscale-0 hover:opacity-100 transition-all cursor-default">Google</span>
            <span className="text-xl font-bold hover:grayscale-0 hover:opacity-100 transition-all cursor-default">Amazon</span>
            <span className="text-xl font-bold italic hover:grayscale-0 hover:opacity-100 transition-all cursor-default">Nike</span>
            <span className="text-xl font-bold uppercase tracking-widest text-[#111] hover:grayscale-0 hover:opacity-100 transition-all cursor-default">T E S L A</span>
            <span className="text-xl font-bold hover:grayscale-0 hover:opacity-100 transition-all cursor-default">BCG</span>
         </div>
      </motion.div>
    </div>
  );
}
