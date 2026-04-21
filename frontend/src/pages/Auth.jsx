import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#fafafa]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 sm:p-10 rounded-3xl w-full max-w-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100"
      >
        <div className="text-center mb-8">
          <Link to="/" className="text-xl font-bold text-slate-900 mb-2 flex flex-col items-center justify-center gap-2 block hover:opacity-80 transition-opacity">
             <div className="flex items-center gap-2">
               <span className="w-6 h-6 border-2 border-slate-900 rounded flex items-center justify-center text-xs tracking-tighter">AI</span> 
               AI Interview
             </div>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mt-4">{isLogin ? 'Welcome back' : 'Create an account'}</h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">
            {isLogin ? 'Enter your details to login.' : 'Get started with building resumes.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold mb-1.5 text-slate-700">Name</label>
              <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#0ea5e9] focus:outline-none transition-all" placeholder="John Doe" />
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold mb-1.5 text-slate-700">Email</label>
            <input required type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#0ea5e9] focus:outline-none transition-all" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5 text-slate-700">Password</label>
            <input required type="password" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#0ea5e9] focus:outline-none transition-all" placeholder="••••••••" />
          </div>

          <button type="submit" className="w-full bg-[#111] hover:bg-black text-white font-semibold py-3.5 rounded-xl transition-all mt-8 shadow-md shadow-black/5">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500 font-medium">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-[#0ea5e9] hover:underline font-semibold ml-1">
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
