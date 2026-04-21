import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sun, Moon, FileCheck, Scale, AlertCircle, Ban, ArrowLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Footer from '../components/landing/Footer';

export default function Terms() {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing or using AI Interview, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, you may not use our platform."
    },
    {
      title: "2. Description of Service",
      content: "AI Interview provides an AI-powered platform for mock interview preparation. The evaluations and scores provided are for informational purposes only and do not guarantee actual job placement or career outcomes."
    },
    {
      title: "3. User Conduct",
      content: "You agree to use the platform only for lawful purposes. You are prohibited from attempting to reverse-engineer our AI models, bypassing security measures, or using the platform to generate or distribute malicious content."
    },
    {
      title: "4. Intellectual Property",
      content: "The AI Interview platform, including all original software, design, and content, is the exclusive property of AI Interview. You retain ownership of your resumes, but you grant us a limited license to process this data for your interview simulation."
    },
    {
      title: "5. Limitation of Liability",
      content: "AI Interview and its founders shall not be liable for any indirect, incidental, or consequential damages resulting from your use of the platform. The AI feedback is generated based on language models and should be taken as one perspective on your performance."
    },
    {
      title: "6. Modifications to Service",
      content: "We reserve the right to modify or discontinue any part of the service at any time without prior notice. We encourage users to review these terms periodically for any changes."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors overflow-hidden">
      {/* Navigation */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 w-full flex justify-center px-8 py-4 ${
          isScrolled ? 'backdrop-blur-md bg-white/70 dark:bg-black/70 py-3 shadow-md' : 'bg-transparent'
        }`}
      >
        <nav className={`w-full max-w-[1300px] px-8 md:px-12 py-3 rounded-full flex items-center justify-between border transition-all duration-500 ${
          isScrolled 
            ? 'bg-transparent border-transparent shadow-none' 
            : 'bg-card shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-slate-100 dark:border-[#444444]'
        }`}>
          <Link to="/" className="text-xl font-bold tracking-tight flex items-center gap-2">
            <span className="w-6 h-6 border-2 border-slate-900 bg-slate-900 dark:border-[#E0E0E0] dark:bg-[#E0E0E0] dark:text-[#121212] text-white rounded flex items-center justify-center text-[10px] tracking-tighter">AI</span>
            AI Interview
          </Link>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-slate-100 dark:bg-[#27272a] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#333] transition-colors"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link to="/auth" className="bg-[#111] dark:bg-[#E0E0E0] dark:text-[#121212] text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-black dark:hover:bg-white transition-all shadow-md">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Content Header */}
      <section className="pt-40 pb-16 px-8 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-3xl mx-auto relative z-10 text-center md:text-left">
          <Link to="/" className="inline-flex items-center gap-2 text-primary font-bold mb-8 hover:gap-3 transition-all">
            <ArrowLeft size={18} /> Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Terms of Service</h1>
          <p className="text-lg text-muted-foreground font-medium leading-relaxed">
            Please read these terms carefully before using our platform. Your use of the service constitutes your agreement to all such terms.
          </p>
          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-white/5 text-sm text-muted-foreground italic font-medium">
            Last Updated: April 21, 2026
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-32 px-8">
        <div className="max-w-3xl mx-auto space-y-16">
          {sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-3">
                {i === 0 && <FileCheck className="text-primary" size={24} />}
                {i === 1 && <Scale className="text-primary" size={24} />}
                {i === 4 && <AlertCircle className="text-primary" size={24} />}
                {i === 2 && <Ban className="text-primary" size={24} />}
                {section.title}
              </h2>
              <div className="text-lg text-muted-foreground leading-relaxed font-medium space-y-4">
                <p>{section.content}</p>
              </div>
            </motion.div>
          ))}

          <div className="p-10 rounded-3xl bg-slate-50 dark:bg-card border border-slate-200 dark:border-white/5 mt-20">
            <h3 className="text-xl font-bold mb-4">Questions about our Terms?</h3>
            <p className="text-muted-foreground font-medium leading-relaxed mb-6">
              If you have any questions regarding these terms or your usage of the platform, please contact us.
            </p>
            <a href="mailto:support@ai-interview.com" className="text-primary font-bold hover:underline">
              support@ai-interview.com
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
