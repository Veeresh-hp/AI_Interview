import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Check, X } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const passwordRules = useMemo(() => [
    { label: 'At least 8 characters', test: (p) => p.length >= 8 },
    { label: 'Includes a number', test: (p) => /\d/.test(p) },
    { label: 'Includes a special character', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
    { label: 'Includes an uppercase letter', test: (p) => /[A-Z]/.test(p) },
  ], []);

  const validationResults = useMemo(() => {
    return passwordRules.map(rule => ({
      ...rule,
      met: rule.test(formData.password)
    }));
  }, [formData.password, passwordRules]);

  const allRulesMet = useMemo(() => {
    return validationResults.every(r => r.met);
  }, [validationResults]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLogin && !allRulesMet) {
      toast.error('Please meet all password requirements');
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast.success('Welcome back!');
      } else {
        await register(formData.name, formData.email, formData.password);
        toast.success('Account created successfully!');
      }
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background transition-colors">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card p-8 sm:p-10 rounded-3xl w-full max-w-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-[#2D2D2D]"
      >
        <div className="text-center mb-8">
          <Link to="/" className="text-xl font-bold text-foreground mb-2 flex flex-col items-center justify-center gap-2 block hover:opacity-80 transition-opacity">
             <div className="flex items-center gap-2">
               <span className="w-6 h-6 border-2 border-slate-900 dark:border-[#E0E0E0] dark:bg-[#E0E0E0] dark:text-[#121212] rounded flex items-center justify-center text-xs tracking-tighter">AI</span> 
               AI Interview
             </div>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-foreground mt-4">{isLogin ? 'Welcome back' : 'Create an account'}</h2>
          <p className="text-slate-500 text-sm mt-2 font-medium font-semibold">
            {isLogin ? 'Enter your details to login.' : 'Get started with building resumes.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-[#B0B0B0]">Name</label>
              <input 
                name="name"
                required 
                type="text" 
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-background-alt border border-slate-200 dark:border-[#444444] text-foreground rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#0ea5e9] focus:outline-none transition-all placeholder:text-muted-foreground" 
                placeholder="John Doe" 
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-[#B0B0B0]">Email</label>
            <input 
              name="email"
              required 
              type="email" 
              value={formData.email}
              onChange={handleInputChange}
              className="w-full bg-background-alt border border-slate-200 dark:border-[#444444] text-foreground rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#0ea5e9] focus:outline-none transition-all placeholder:text-muted-foreground" 
              placeholder="you@example.com" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-[#B0B0B0]">Password</label>
            <div className="relative">
              <input 
                name="password"
                required 
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-background-alt border border-slate-200 dark:border-[#444444] text-foreground rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-[#0ea5e9] focus:outline-none transition-all placeholder:text-muted-foreground font-medium" 
                placeholder="••••••••" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-foreground transition-colors"
                title={showPassword ? "Hide Password" : "Show Password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            {/* Password Rules UI */}
            <AnimatePresence>
              {!isLogin && formData.password.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-2 overflow-hidden"
                >
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 px-1">Security Requirements</p>
                  <div className="grid grid-cols-1 gap-1.5 px-1 pb-1">
                    {validationResults.map((result, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${result.met ? 'bg-green-500/10 text-green-500' : 'bg-slate-100 dark:bg-[#2A2A2A] text-slate-300'}`}>
                          {result.met ? <Check size={10} strokeWidth={4} /> : <X size={10} strokeWidth={4} />}
                        </div>
                        <span className={`text-xs font-semibold transition-colors ${result.met ? 'text-foreground' : 'text-slate-500'}`}>{result.label}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting || (!isLogin && !allRulesMet)}
            className="w-full bg-[#111] dark:bg-[#E0E0E0] dark:text-[#121212] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all mt-8 shadow-md shadow-black/5"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              isLogin ? 'Sign In' : 'Sign Up'
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500 font-semibold font-semibold">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)} 
            className="text-[#0ea5e9] hover:underline font-bold ml-1"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
