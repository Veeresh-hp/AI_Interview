import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();
  
  const navItems = [
    { name: 'My Resumes', path: '/dashboard', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { name: 'Practice Interview', path: '/interview', icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { name: 'Interview History', path: '/history', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { name: 'Resume Builder', path: '/resume-builder', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
  ];

  return (
    <aside className="w-72 border-r border-slate-200 bg-white hidden md:flex flex-col h-screen overflow-y-auto shrink-0 z-20">
      <div className="px-8 h-24 flex items-center">
        <Link to="/" className="text-xl font-bold flex items-center gap-2 text-slate-900">
          <span className="w-6 h-6 border-2 border-slate-900 bg-slate-900 text-white rounded flex items-center justify-center text-[10px] tracking-tighter">AI</span>
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
                  ? 'bg-slate-100 border border-slate-200 text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
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
      
      <div className="p-6 border-t border-slate-100 mt-auto">
        <Link to="/profile" className="flex items-center gap-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer -mx-3 px-3 py-2">
          <div className="w-10 h-10 rounded-full bg-[#f0f9ff] border border-[#bae6fd] text-[#0ea5e9] flex items-center justify-center font-bold text-sm shrink-0">JD</div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold text-slate-900 truncate">John Doe</span>
            <span className="text-xs font-medium text-slate-500 truncate">john@student.edu</span>
          </div>
        </Link>
      </div>
    </aside>
  );
}
