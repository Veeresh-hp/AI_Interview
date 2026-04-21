import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Sun, Moon, Users, Target, Rocket, 
  Heart, Globe, Shield, Sparkles, Code2, 
  Briefcase, ArrowRight, Share2, Mail
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import Footer from '../components/landing/Footer';

export default function About() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const foundations = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To level the playing field by providing every student with access to high-quality, personalized interview coaching powered by state-of-the-art AI."
    },
    {
      icon: Eye,
      title: "Our Vision",
      description: "A world where career opportunities are determined by potential and preparation, not by access to expensive coaching or networks."
    },
    {
      icon: Heart,
      title: "Our Values",
      description: "We believe in transparency, honesty, and relentless improvement. Our AI doesn't just score; it mentors."
    }
  ];

  const founders = [
    {
      name: "T J Shashank",
      role: "Co-founder & AI Architect",
      bio: "An AI enthusiast dedicated to building systems that solve real-world problems. Lead architect behind the RAG-based interview engine.",
      icon: Code2
    },
    {
      name: "Veeresh H P",
      role: "Co-founder & Product Lead",
      bio: "Strategic product lead focused on creating seamless user experiences. Driving the vision for accessible career development tools.",
      icon: Briefcase
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
            {isAuthenticated ? (
              <Link to="/dashboard" className="bg-[#0ea5e9] text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-[#0284c7] transition-all shadow-md flex items-center gap-2">
                Dashboard <ArrowRight size={16} />
              </Link>
            ) : (
              <Link to="/auth" className="bg-[#111] dark:bg-[#E0E0E0] dark:text-[#121212] text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-black dark:hover:bg-white transition-all shadow-md">
                Get Started
              </Link>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-8 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="max-w-[1000px] mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary font-bold tracking-wider mb-4 uppercase text-sm"
          >
            Behind the AI
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight tracking-tight"
          >
            Empowering the next <br />
            generation of <span className="text-primary italic">talent.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            We built AI Interview to bridge the gap between academic learning and industry expectations. 
            Our tool delivers brutal honesty, tailored feedback, and the confidence to succeed.
          </motion.p>
        </div>
      </section>

      {/* Mission Grid */}
      <section className="py-24 px-8 bg-background-alt/50">
        <div className="max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {foundations.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 rounded-3xl bg-card border border-slate-200 dark:border-white/5 shadow-xl hover:border-primary/30 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(14,165,233,0.15)]">
                {item.icon && <item.icon size={28} />}
                {!item.icon && <Target size={28} />}
              </div>
              <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed font-medium">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Founders Section */}
      <section className="py-32 px-8">
        <div className="max-w-[1300px] mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6">Meet the <span className="text-primary">Founders</span></h2>
              <p className="text-lg text-muted-foreground font-medium">
                Driven by a shared passion for technology and education, our founders set out to build a platform that humanizes the AI-student interaction.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {founders.map((founder, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="group p-1 bg-gradient-to-br from-slate-200 to-transparent dark:from-white/10 dark:to-transparent rounded-[40px] shadow-2xl"
              >
                <div className="bg-card rounded-[38px] p-12 h-full relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full group-hover:bg-primary/10 transition-colors" />
                  
                  <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-8 shadow-inner">
                    <founder.icon size={36} />
                  </div>
                  
                  <h3 className="text-3xl font-extrabold mb-2 text-foreground">{founder.name}</h3>
                  <div className="text-primary font-bold mb-6 text-lg tracking-wide">{founder.role}</div>
                  
                  <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                    {founder.bio}
                  </p>

                  <div className="flex gap-4">
                    <a href="#" className="w-10 h-10 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 hover:bg-primary hover:text-white transition-all">
                      <Share2 size={18} />
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 hover:bg-primary hover:text-white transition-all">
                      <Mail size={18} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 px-8 bg-slate-50 dark:bg-transparent relative overflow-hidden">
        <div className="absolute -bottom-24 -left-24 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-[1300px] mx-auto text-center">
          <h2 className="text-4xl font-extrabold mb-16">Why we built this</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: Shield, title: "Authenticity", text: "Honest feedback that matters." },
              { icon: Sparkles, title: "Excellence", text: "State-of-the-art AI precision." },
              { icon: Globe, title: "Accessibility", text: "Career tools for everyone." },
              { icon: Rocket, title: "Growth", text: "Continuous learning and iteration." }
            ].map((value, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-12 h-12 text-primary mb-6">
                  <value.icon size={48} strokeWidth={1.5} />
                </div>
                <h4 className="font-bold mb-2 text-lg">{value.title}</h4>
                <p className="text-muted-foreground text-sm font-medium">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

// Missing icon from lucide-react standard set in my research
function Eye(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
