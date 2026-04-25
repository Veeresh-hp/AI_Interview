import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, History, User, PlayCircle, PlusCircle } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;

  // Hide navbar on static/marketing/auth pages or during the actual interview
  const hiddenPaths = ['/', '/about', '/privacy', '/terms', '/auth', '/interview/start'];
  if (hiddenPaths.includes(currentPath)) return null;

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'History', path: '/history', icon: History },
    { name: 'Start', path: '/interview', icon: PlayCircle, primary: true },
    { name: 'Builder', path: '/resume-builder', icon: PlusCircle },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <>
      {/* Desktop Top Navbar */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 h-20 bg-background/80 backdrop-blur-md border-b border-slate-200 dark:border-[#333] z-50 items-center justify-between px-12 transition-all">
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-[#0ea5e9] rounded-xl flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform">🤖</div>
          <span className="text-xl font-black tracking-tighter text-foreground uppercase">Interview<span className="text-[#0ea5e9]">AI</span></span>
        </Link>

        <div className="flex items-center gap-8">
          {navItems.filter(item => !item.primary).map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`text-sm font-bold uppercase tracking-widest transition-all hover:text-[#0ea5e9] ${
                currentPath === item.path ? 'text-[#0ea5e9]' : 'text-slate-500'
              }`}
            >
              {item.name}
            </Link>
          ))}
          <Link 
            to="/interview"
            className="px-6 py-2.5 bg-[#0ea5e9] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#0284c7] transition-all shadow-md shadow-[#0ea5e9]/20"
          >
            Start Interview
          </Link>
        </div>
      </nav>

      {/* Mobile Bottom Navbar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-card/95 backdrop-blur-xl border-t border-slate-200 dark:border-[#333] z-50 flex items-center justify-around px-2 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.1)] transition-all">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className="relative flex flex-col items-center justify-center w-16 h-16 group"
            >
              {item.primary ? (
                <div className="absolute -top-10 bg-[#0ea5e9] w-16 h-16 rounded-full flex items-center justify-center text-white shadow-[0_10px_20px_rgba(14,165,233,0.4)] border-4 border-background transform active:scale-90 transition-all">
                  <item.icon size={28} />
                </div>
              ) : (
                <div className={`flex flex-col items-center gap-1 transition-all ${
                  isActive ? 'text-[#0ea5e9]' : 'text-slate-400 group-hover:text-foreground'
                }`}>
                  <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] font-black uppercase tracking-tighter">{item.name}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="nav-pill"
                      className="absolute -bottom-1 w-1 h-1 bg-[#0ea5e9] rounded-full"
                    />
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Spacer to prevent content from being hidden under Navbar */}
      <div className="hidden md:block h-20 w-full" />
      <div className="md:hidden h-20 w-full" />
    </>
  );
}
