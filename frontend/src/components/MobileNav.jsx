import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Home, Play, History, User, PenTool } from 'lucide-react';

export default function MobileNav() {
  const location = useLocation();
  useAuth();
  
  const navItems = [
    { name: 'Home', path: '/dashboard', icon: Home },
    { name: 'Interview', path: '/interview', icon: Play },
    { name: 'History', path: '/history', icon: History },
    { name: 'Builder', path: '/resume-builder', icon: PenTool },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-slate-200 dark:border-[#444444] z-50 px-2 py-3 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] flex justify-around items-center backdrop-blur-lg bg-card/80">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;
        return (
          <Link 
            key={item.path}
            to={item.path} 
            className={`flex flex-col items-center gap-1 min-w-[64px] transition-all duration-200 ${
              isActive 
                ? 'text-[#0ea5e9]' 
                : 'text-slate-400 dark:text-[#888888]'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-[#0ea5e9]/10' : ''}`}>
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-tighter ${isActive ? 'opacity-100' : 'opacity-60'}`}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
