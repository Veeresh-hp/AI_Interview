import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../hooks/useAuth';

export default function Sidebar() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  
    const navItems = [
    { name: 'My Resumes', path: '/dashboard', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { name: 'Practice Interview', path: '/interview', icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { name: 'Interview History', path: '/history', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { name: 'Resume Builder', path: '/resume-builder', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
  ];
  return (
    <aside className="w-72 border-r border-slate-200 dark:border-[#444444] bg-sidebar hidden md:flex flex-col h-screen overflow-y-auto shrink-0 z-20">
      <div className="px-8 h-24 flex items-center">
        <Link to="/" className="text-xl font-bold flex items-center gap-2 text-foreground">
          <span className="w-6 h-6 border-2 border-slate-900 bg-slate-900 dark:border-[#E0E0E0] dark:bg-[#E0E0E0] dark:text-[#121212] text-white rounded flex items-center justify-center text-[10px] tracking-tighter">AI</span>
          AI Interview
        </Link>
      </div>
      
      <nav className="px-4 py-2 space-y-1.5 flex-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path}
              to={item.path} 
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 font-medium ${
                isActive 
                  ? 'bg-[var(--active-pill-bg)] border border-[var(--active-pill-border)] text-[var(--active-pill-text)] shadow-sm' 
                  : 'text-slate-500 dark:text-[#B0B0B0] hover:bg-slate-100 dark:hover:bg-[#2a2a2a] hover:text-foreground transition-colors'
              }`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 ${isActive ? 'text-[#0ea5e9]' : 'opacity-50'}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 2.5 : 2} d={item.icon} />
              </svg>
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-6 border-t border-slate-100 dark:border-[#444444] mt-auto space-y-4">
        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-theme bg-[var(--active-pill-bg)] text-foreground hover:bg-slate-100 dark:hover:bg-[#1e293b] transition-all font-bold text-xs"
        >
          <div className="flex items-center gap-2">
            {theme === 'light' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
            <span>{theme === 'light' ? 'Light Theme' : 'Dark Theme'}</span>
          </div>
          <div className={`w-8 h-4 rounded-full relative transition-colors shadow-inner ${theme === 'light' ? 'bg-slate-300 border border-slate-300' : 'bg-[#0ea5e9] border border-[#0ea5e9]'}`}>
            <div className={`absolute top-[1px] w-3 h-3 bg-white rounded-full transition-all shadow-sm ${theme === 'light' ? 'left-[1px]' : 'left-[17px]'}`}></div>
          </div>
        </button>

        <div className="flex items-center justify-between gap-3 group">
          <Link to="/profile" state={{ from: '/dashboard' }} className="flex items-center gap-3 rounded-xl hover:bg-slate-100 dark:hover:bg-[#2a2a2a] transition-colors cursor-pointer -mx-3 px-3 py-2 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full bg-[#f0f9ff] dark:bg-[#242424] border border-[#bae6fd] dark:border-[#444444] text-[#0ea5e9] flex items-center justify-center font-bold text-sm shrink-0 uppercase">
              {user?.name?.substring(0, 2) || 'JD'}
            </div>
            <div className="flex flex-col overflow-hidden text-foreground">
              <span className="text-sm font-bold truncate">{user?.name || 'John Doe'}</span>
              <span className="text-xs font-medium text-slate-500 dark:text-[#B0B0B0] truncate">{user?.email || 'john@student.edu'}</span>
            </div>
          </Link>
          <button 
            onClick={logout}
            className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100"
            title="Logout"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
