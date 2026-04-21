import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Search, Mic, BarChart3, Rocket, 
  Brain, Star, CheckCircle2, Quote, 
  Zap, Shield, Globe, Users,
  ArrowRight, Upload, Sparkles, Trophy,
  Sun, Moon
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import FeatureCard from '../components/landing/FeatureCard';
import StepItem from '../components/landing/StepItem';
import TestimonialCard from '../components/landing/TestimonialCard';
import FAQAccordion from '../components/landing/FAQAccordion';
import Footer from '../components/landing/Footer';
import { useAuth } from '../hooks/useAuth';

// Standardized casing path normalization
export default function Landing() {
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

  return (
    <div className="min-h-screen flex flex-col items-center relative overflow-hidden bg-background text-foreground transition-colors">
      
      {/* Navigation Pill */}
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
          <div className="text-xl font-bold tracking-tight flex items-center gap-2">
            <span className="w-6 h-6 border-2 border-slate-900 bg-slate-900 dark:border-[#E0E0E0] dark:bg-[#E0E0E0] dark:text-[#121212] text-white rounded flex items-center justify-center text-[10px] tracking-tighter">AI</span>
            AI Interview
          </div>
          <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-slate-600 dark:text-slate-400">
            {/* Products Dropdown */}
            <div className="relative group py-2">
              <button className="flex items-center gap-1 hover:text-[#0ea5e9] transition-colors focus:outline-none">
                Products 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:rotate-180 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-card border border-slate-100 dark:border-[#444444] shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col overflow-hidden z-50">
                <Link to="/resume-builder" className="px-5 py-4 hover:bg-[#f0f9ff] dark:hover:bg-[#1e1e1e] text-foreground font-semibold transition-colors flex items-center gap-3">
                   <span className="text-xl">📄</span> Resume Builder
                </Link>
                <Link to="/interview" className="px-5 py-4 hover:bg-[#f0f9ff] dark:hover:bg-[#1e1e1e] text-foreground font-semibold transition-colors border-t border-slate-50 dark:border-[#444444] flex items-center gap-3">
                   <span className="text-xl">🎙️</span> Mock Interviews
                </Link>
              </div>
            </div>

            {/* Dashboard & Pricing */}
            {isAuthenticated && (
              <Link to="/dashboard" className="hover:text-[#0ea5e9] transition-colors py-2">Dashboard</Link>
            )}
            <Link to="/pricing" className="hover:text-[#0ea5e9] transition-colors py-2">Pricing</Link>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-slate-100 dark:bg-[#27272a] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#333] transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {isAuthenticated ? (
              <Link to="/dashboard" className="bg-[#0ea5e9] text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-[#0284c7] transition-colors shadow-md flex items-center gap-2">
                Dashboard <ArrowRight size={16} />
              </Link>
            ) : (
              <Link to="/auth" className="bg-[#111] dark:bg-[#E0E0E0] dark:text-[#121212] text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-black dark:hover:bg-white transition-colors shadow-md">
                Get Started
              </Link>
            )}
          </div>
        </nav>
      </header>

      {/* Background soft glow */ }
      <div className="absolute top-0 w-full h-[500px] bg-gradient-to-b from-[#0ea5e9]/10 to-transparent pointer-events-none" />

      <main className="z-10 text-left px-4 md:px-8 max-w-[1400px] w-full mt-24 md:mt-32 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 xl:gap-20">
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
            className="text-4xl lg:text-[48px] xl:text-[52px] font-extrabold tracking-tight mb-4 text-foreground leading-[1.05]"
          >
            An AI mock interviewer<br />
            driven by your resume<br />
            and job description.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base text-slate-700 dark:text-slate-300 mb-5 max-w-[480px] leading-relaxed font-medium"
          >
            Built for GenZ. AI Interview automates your entire job hunt with AI from job matching to interview prep.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col xl:flex-row items-start xl:items-center gap-4 mt-2"
          >
            <Link to="/interview" className="px-6 py-3 bg-[#111] dark:bg-slate-100 dark:text-slate-900 text-white rounded-full font-bold hover:bg-black dark:hover:bg-white transition-all shadow-xl shadow-black/10 hover:-translate-y-0.5 text-sm">
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
            <span className="text-xl font-bold font-serif hover:grayscale-0 hover:opacity-100 transition-all cursor-default text-foreground">Meta</span>
            <span className="text-xl font-bold hover:grayscale-0 hover:opacity-100 transition-all cursor-default text-foreground">Google</span>
            <span className="text-xl font-bold hover:grayscale-0 hover:opacity-100 transition-all cursor-default text-foreground">Amazon</span>
            <span className="text-xl font-bold italic hover:grayscale-0 hover:opacity-100 transition-all cursor-default text-foreground">Nike</span>
            <span className="text-xl font-bold uppercase tracking-widest hover:grayscale-0 hover:opacity-100 transition-all cursor-default text-foreground">T E S L A</span>
            <span className="text-xl font-bold hover:grayscale-0 hover:opacity-100 transition-all cursor-default text-foreground">BCG</span>
         </div>
      </motion.div>

      {/* 3-Column Feature Section */}
      <section className="w-full bg-background-alt dark:bg-[#050505] py-24 px-8 mt-20 relative overflow-hidden transition-colors">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/5 blur-[120px] rounded-full" />
        
        <div className="max-w-[1300px] mx-auto relative z-10">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-extrabold text-foreground dark:text-white mb-6"
            >
              Everything you need to <span className="text-primary italic">crack interviews</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground dark:text-slate-400 text-lg max-w-2xl mx-auto font-medium"
            >
              Our AI-powered platform provides comprehensive preparation tailored to your unique profile and target roles.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Search}
              title="AI Resume Matching"
              description="Analyze your resume against job descriptions to identify gaps and optimize for ATS algorithms."
            />
            <FeatureCard 
              icon={Mic}
              title="Mock Interviews"
              description="Practice with realistic, AI-driven interviewers that adapt to your responses and industry."
            />
            <FeatureCard 
              icon={BarChart3}
              title="Performance Feedback"
              description="Receive detailed insights on your communication, technical accuracy, and body language."
            />
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="w-full py-24 px-8 bg-background relative">
        <div className="max-w-[1300px] mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold mb-4">Get interview-ready in 3 simple steps</h2>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-16 relative">
            <StepItem 
              number="1"
              icon={Upload}
              text="Upload your resume and the job description you're targeting."
            />
            <StepItem 
              number="2"
              icon={Sparkles}
              text="Our AI analyzes your profile and generates tailored mock questions."
            />
            <StepItem 
              number="3"
              icon={Rocket}
              text="Practice the interview and get real-time feedback until you're ready."
              isLast={true}
            />
          </div>
        </div>
      </section>

      {/* Split Layout: AI Personalization */}
      <section className="w-full py-24 px-8 bg-background-alt overflow-hidden">
        <div className="max-w-[1300px] mx-auto flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <h2 className="text-4xl font-extrabold mb-8 leading-tight">
              AI that actually <br />
              <span className="text-primary italic">understands your profile</span>
            </h2>
            <div className="space-y-6">
              {[
                "Adapts questions based on your specific work history",
                "Deep industry-specific knowledge and latest trends",
                "Personalized growth path based on your performance"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <CheckCircle2 size={20} />
                  </div>
                  <span className="text-lg font-semibold text-slate-700 dark:text-slate-300">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 relative"
          >
            {/* Dashboard Mockup */}
            <div className="bg-card rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden p-6 aspect-[4/3] flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="h-6 w-32 bg-slate-100 dark:bg-white/5 rounded-full" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="h-24 bg-primary/5 rounded-2xl border border-primary/20 p-4">
                  <div className="h-3 w-16 bg-primary/20 rounded-full mb-3" />
                  <div className="h-6 w-full bg-primary/10 rounded-lg" />
                </div>
                <div className="h-24 bg-yellow-400/5 rounded-2xl border border-yellow-400/20 p-4">
                  <div className="h-3 w-16 bg-yellow-400/20 rounded-full mb-3" />
                  <div className="h-6 w-full bg-yellow-400/10 rounded-lg" />
                </div>
              </div>

              <div className="grow bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-100 dark:border-white/5 p-6">
                <div className="h-4 w-48 bg-slate-200 dark:bg-white/10 rounded-full mb-6" />
                <div className="space-y-4">
                  <div className="h-3 w-full bg-slate-100 dark:bg-white/5 rounded-full" />
                  <div className="h-3 w-[90%] bg-slate-100 dark:bg-white/5 rounded-full" />
                  <div className="h-3 w-[95%] bg-slate-100 dark:bg-white/5 rounded-full" />
                  <div className="h-3 w-[40%] bg-slate-100 dark:bg-white/5 rounded-full" />
                </div>
              </div>
              
              {/* Floating Element */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -right-4 w-40 h-28 bg-white dark:bg-[#18181b] border border-slate-200 dark:border-white/10 shadow-xl rounded-2xl p-4 z-20"
              >
                 <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 mb-2">
                   <Trophy size={20} />
                 </div>
                 <div className="h-3 w-20 bg-slate-100 dark:bg-white/5 rounded-full mb-2" />
                 <div className="h-4 w-28 bg-primary/10 rounded-full" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full py-24 px-8 bg-background relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full -mr-64 -mb-64" />
        
        <div className="max-w-[1300px] mx-auto text-center relative z-10">
          <h2 className="text-4xl font-extrabold mb-16">Why students love this</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Zap, title: "Instant Feedback", text: "Get scores and tips right after each question." },
              { icon: Shield, title: "Confidence Booster", text: "Practice in a low-pressure environment." },
              { icon: Globe, title: "Industry Standard", text: "Questions vetted by top hiring managers." },
              { icon: Users, title: "Networking Tips", text: "Learn how to follow up and stand out." }
            ].map((benefit, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-card border border-slate-200 dark:border-white/5 hover:border-primary/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 mx-auto group-hover:scale-110 shadow-[0_0_20px_rgba(14,165,233,0.1)] group-hover:shadow-[0_0_30px_rgba(14,165,233,0.2)] transition-all">
                  <benefit.icon size={24} />
                </div>
                <h4 className="font-bold mb-3">{benefit.title}</h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">{benefit.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-24 px-8 bg-background-alt">
        <div className="max-w-[1300px] mx-auto text-center mb-16">
          <h2 className="text-4xl font-extrabold mb-4">Loved by students</h2>
        </div>
        <div className="max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <TestimonialCard 
            quote="The feedback on my body language was a game changer. I didn't realize how much I was fidgeting till the AI pointed it out."
            name="Alex Chen"
            role="CS Student @ Stanford"
          />
          <TestimonialCard 
            quote="I landed my dream job at Google! The technical questions the AI asked were almost identical to the real ones."
            name="Sarah Johnson"
            role="Fresher @ IIT Bombay"
          />
          <TestimonialCard 
            quote="Being able to practice anytime, anywhere reduced my anxiety so much. It's like having a mentor in your pocket."
            name="Rohan Gupta"
            role="Final Year Student"
          />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-24 px-8 bg-background">
        <div className="max-w-[1300px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="flex-1 w-full">
              <h2 className="text-4xl font-extrabold mb-4">Frequently Asked Questions</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-12 font-medium text-lg">
                Have questions? We've got answers. If you can't find what you're looking for, feel free to reach out.
              </p>
              
              <div className="space-y-2">
                {[
                  {
                    q: "How accurate is the AI's feedback?",
                    a: "Our AI uses advanced RAG (Retrieval-Augmented Generation) to compare your answers with thousands of industry-standard benchmarks, achieving 95%+ relevance in technical and behavioral evaluation."
                  },
                  {
                    q: "Is my resume data and privacy protected?",
                    a: "Absolutely. We use enterprise-grade encryption and strictly adhere to privacy standards. Your data is used exclusively to personalize your interview experience."
                  },
                  {
                    q: "Can I use AI Interview for free?",
                    a: "Yes! We offer a generous free tier that includes 3 fully-featured mock interviews per month. No credit card required to start."
                  },
                  {
                    q: "Does it support specific roles like PM or Design?",
                    a: "Yes. Our AI adapts dynamically to any job description you upload, whether it's for Software Engineering, Product Management, or Creative Design roles."
                  },
                  {
                    q: "Can I practice on mobile?",
                    a: "Our platform is fully responsive and works great on mobile browsers, though we recommend a desktop for the best mock interview experience."
                  }
                ].map((item, i) => (
                  <FAQAccordion key={i} question={item.q} answer={item.a} />
                ))}
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex-1 w-full max-w-[500px]"
            >
              <img 
                src="/faq_illustration.png" 
                alt="FAQ Illustration" 
                className="w-full h-auto object-contain drop-shadow-2xl" 
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-32 px-8 bg-slate-50 dark:bg-[#050505] border-t border-slate-100 dark:border-none relative overflow-hidden transition-colors">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10 opacity-50 dark:opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[150px] rounded-full animate-pulse" />
        
        <div className="max-w-[800px] mx-auto text-center relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-extrabold text-foreground dark:text-white mb-8 leading-tight"
          >
            Start your interview <br />
            <span className="text-primary italic">journey today</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground dark:text-slate-400 text-xl mb-12 font-medium"
          >
            Join 10,000+ students who are already using AI to land their dream roles.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link to="/interview" className="px-10 py-5 bg-primary text-white rounded-full font-bold text-lg hover:bg-sky-400 transition-all shadow-[0_0_40px_rgba(14,165,233,0.3)] hover:shadow-[0_0_60px_rgba(14,165,233,0.5)] hover:-translate-y-1">
              Start Free Interview
            </Link>
            <Link to="/resume-builder" className="px-10 py-5 bg-white/5 dark:bg-white/5 text-slate-700 dark:text-white border border-slate-200 dark:border-white/10 rounded-full font-bold text-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-all backdrop-blur-xl">
              Upload Resume
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
