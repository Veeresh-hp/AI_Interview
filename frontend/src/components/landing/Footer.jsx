import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Share2, Briefcase, Code2, Mail, Globe, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Product: [
      { name: 'Resume Builder', href: '/resume-builder' },
      { name: 'Mock Interviews', href: '/interview' },
      { name: 'Dashboard', href: '/dashboard' },
      { name: 'Pricing', href: '/pricing' },
    ],
    Company: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
    ],
    Resources: [
      { name: 'Interview Tips', href: '/tips' },
      { name: 'Career Blog', href: '/blog' },
      { name: 'ATS Hacks', href: '/ats-hacks' },
      { name: 'Success Stories', href: '/stories' },
    ],
  };

  const activeRoutes = ['/', '/about', '/privacy', '/terms', '/auth', '/pricing', '/profile', '/history', '/dashboard', '/resume-builder', '/interview', '/interview/start', '/interview/results'];

  const handleLinkClick = (e, href, name) => {
    if (!activeRoutes.includes(href)) {
      e.preventDefault();
      toast.info(`${name} is coming soon! Stay tuned.`, {
        icon: "🚀",
        style: { borderRadius: '1rem' }
      });
    }
  };

  return (
    <footer className="w-full bg-white dark:bg-[#050505] pt-24 pb-12 px-8 border-t border-slate-200 dark:border-white/10 transition-colors">
      <div className="max-w-[1300px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Logo & Tagline */}
          <div className="lg:col-span-2">
            <div className="text-2xl font-bold tracking-tight flex items-center gap-2 mb-6">
              <span className="w-8 h-8 border-2 border-slate-900 bg-slate-900 dark:border-[#E0E0E0] dark:bg-[#E0E0E0] dark:text-[#121212] text-white rounded flex items-center justify-center text-xs tracking-tighter">AI</span>
              AI Interview
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-lg mb-8 max-w-sm font-medium leading-relaxed">
              Empowering GenZ to crack interviews with AI-driven preparation and real-time personalized feedback.
            </p>
            <div className="flex gap-4">
              {[Share2, Briefcase, Code2, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-bold text-foreground mb-6 uppercase text-sm tracking-widest">{title}</h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      onClick={(e) => handleLinkClick(e, link.href, link.name)}
                      className="text-slate-500 dark:text-slate-400 font-medium hover:text-primary dark:hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-500 dark:text-slate-400 text-sm font-medium">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-8">
            <p>© {currentYear} AI Interview. All rights reserved.</p>
            <div className="flex items-center gap-2">
              Built with <Heart size={14} className="text-red-500 fill-red-500" /> for the future of work.
            </div>
          </div>
          <div className="flex gap-8">
            <span className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer"><Globe size={14} /> English (US)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
