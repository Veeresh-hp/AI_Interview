import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sun, Moon, Shield, Lock, Eye, FileText, ArrowLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Footer from '../components/landing/Footer';

export default function Privacy() {
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
      title: "1. Information We Collect",
      content: "We collect information you provide directly to us, including your resume (PDF), job descriptions you input, and your responses to interview questions. We also collect basic account information like your name and email address when you register."
    },
    {
      title: "2. How We Use Your Information",
      content: "Your data is primarily used to generate personalized interview questions and provide evaluation reports. We use Large Language Models (LLMs) to process your resume and answers. Your data is not used to train global AI models without your explicit consent."
    },
    {
      title: "3. Data Security",
      content: "We implement industry-standard security measures to protect your personal information. This includes encryption of data in transit and at rest. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security."
    },
    {
      title: "4. Third-Party Services",
      content: "We use third-party AI providers (like Groq) to process interview data. These providers are bound by strict confidentiality agreements and are prohibited from using your data for their own purposes."
    },
    {
      title: "5. Your Rights",
      content: "You have the right to access, update, or delete your personal information at any time through your dashboard. If you wish to permanently delete your account and all associated data, please contact our support team."
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
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Privacy Policy</h1>
          <p className="text-lg text-muted-foreground font-medium leading-relaxed">
            Your privacy is of paramount importance to us. This policy outlines how AI Interview collects, uses, and protects your information.
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
                {i === 0 && <FileText className="text-primary" size={24} />}
                {i === 1 && <Eye className="text-primary" size={24} />}
                {i === 2 && <Shield className="text-primary" size={24} />}
                {i === 3 && <Lock className="text-primary" size={24} />}
                {section.title}
              </h2>
              <div className="text-lg text-muted-foreground leading-relaxed font-medium space-y-4">
                <p>{section.content}</p>
              </div>
            </motion.div>
          ))}

          <div className="p-10 rounded-3xl bg-slate-50 dark:bg-card border border-slate-200 dark:border-white/5 mt-20">
            <h3 className="text-xl font-bold mb-4">Contact Our Privacy Team</h3>
            <p className="text-muted-foreground font-medium leading-relaxed mb-6">
              If you have any questions about this Privacy Policy or our data practices, please reach out to us.
            </p>
            <a href="mailto:privacy@ai-interview.com" className="text-primary font-bold hover:underline">
              privacy@ai-interview.com
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
