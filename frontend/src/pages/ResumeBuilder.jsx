import { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useResume } from '../hooks/useResume';
import { useAuth } from '../hooks/useAuth';
import TemplateSelector from '../components/resume/TemplateSelector';
import TemplateLaTeX from '../components/resume/templates/TemplateLaTeX';
import TemplateModern from '../components/resume/templates/TemplateModern';
import TemplateMinimalist from '../components/resume/templates/TemplateMinimalist';
import TemplateAurora from '../components/resume/templates/TemplateAurora';
import TemplateHyperion from '../components/resume/templates/TemplateHyperion';
import TemplateLunar from '../components/resume/templates/TemplateLunar';
import TemplateExecutive from '../components/resume/templates/TemplateExecutive';

const templates = {
  executive: TemplateExecutive,
  latex: TemplateLaTeX,
  modern: TemplateModern,
  minimalist: TemplateMinimalist,
  aurora: TemplateAurora,
  hyperion: TemplateHyperion,
  lunar: TemplateLunar
};

export default function ResumeBuilder() {
    setFormData
  } = useResume();
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' or 'preview'

  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const resumeRef = useRef(null);

  if (!template) {
    return <TemplateSelector />;
  }

  const SelectedTemplate = templates[template];

  const handleDownloadPDF = async () => {
    const element = resumeRef.current;
    if (!element) return;
    
    saveResumeData('saved');

    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const originalShadow = element.style.boxShadow;
      element.style.boxShadow = 'none';
      
      html2pdf()
        .set({
          margin: 10,
          filename: `${formData.name ? formData.name.replace(/\s+/g, '_') : 'My'}_Resume.pdf`,
          image: { type: 'jpeg', quality: 1.0 },
          html2canvas: { scale: 2, useCORS: true, logging: false },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        })
        .from(element)
        .save()
        .then(() => {
           element.style.boxShadow = originalShadow;
        });
    } catch(err) {
      console.log(err);
      alert("PDF engine is initializing...");
    }
  };

  return (
    <div className="h-screen flex flex-col md:flex-row bg-background text-foreground overflow-hidden font-sans transition-colors relative">
      
      {/* Mobile Tab Switcher */}
      <div className="md:hidden flex bg-card border-b border-slate-200 dark:border-[#333] sticky top-0 z-50">
        <button 
          onClick={() => setActiveTab('editor')}
          className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all ${
            activeTab === 'editor' ? 'text-[#0ea5e9] border-b-2 border-[#0ea5e9]' : 'text-slate-400'
          }`}
        >
          Edit Details
        </button>
        <button 
          onClick={() => setActiveTab('preview')}
          className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all ${
            activeTab === 'preview' ? 'text-[#0ea5e9] border-b-2 border-[#0ea5e9]' : 'text-slate-400'
          }`}
        >
          Live Preview
        </button>
      </div>

      {/* 1. Navigation Sidebar - Only on Desktop */}
      <div className="hidden md:flex w-20 bg-background-alt border-r border-slate-200 dark:border-[#444444] flex-col items-center py-6 gap-8 z-20 shrink-0 transition-colors">
        <Link to="/dashboard" className="w-12 h-12 rounded-2xl bg-card flex items-center justify-center text-slate-600 dark:text-[#B0B0B0] hover:text-foreground hover:bg-slate-100 dark:hover:bg-[#2a2a2a] transition-all border border-slate-200 dark:border-[#444444] shadow-sm" title="Back to Dashboard">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </Link>
        <div className="flex-1 flex flex-col items-center gap-4">
           <button 
             onClick={resetLayout}
             className="w-12 h-12 rounded-2xl bg-card border border-slate-200 dark:border-[#444444] text-slate-400 dark:text-[#888888] hover:text-[#0ea5e9] hover:bg-slate-100 dark:hover:bg-[#2a2a2a] flex items-center justify-center transition-all shadow-sm"
             title="Change Template"
           >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
           </button>
        </div>
      </div>

      {/* 2. Editor Pane */}
      <div className={`w-full md:w-[450px] xl:w-[500px] bg-card md:border-r border-slate-200 dark:border-[#444444] flex flex-col h-full overflow-y-auto shrink-0 z-10 shadow-sm transition-colors ${
        activeTab === 'editor' ? 'flex' : 'hidden md:flex'
      }`}>
        <div className="p-8 border-b border-slate-100 dark:border-[#2a2a2a] sticky top-0 bg-card/95 backdrop-blur-sm z-10">
           <h1 className="text-2xl font-bold tracking-tight text-foreground">Content Editor</h1>
           <p className="text-sm text-slate-500 dark:text-[#B0B0B0] font-medium mt-1">Refine your professional details here.</p>
        </div>

        <div className="p-8 space-y-10">
          {/* Personal Info */}
          <section>
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-[#888888] mb-6 flex items-center gap-3">
              Personal Information
              <div className="h-px bg-slate-100 dark:bg-[#2a2a2a] flex-1"></div>
            </h3>
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2">
                <label className="text-[10px] font-bold text-slate-400 dark:text-[#888888] uppercase tracking-widest mb-2 block">Full Name</label>
                <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-background border border-slate-200 dark:border-[#444444] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/5 transition-all text-foreground placeholder:text-muted-foreground" />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-bold text-slate-400 dark:text-[#888888] uppercase tracking-widest mb-2 block">Professional Title</label>
                <input name="title" value={formData.title} onChange={handleChange} className="w-full bg-background border border-slate-200 dark:border-[#444444] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/5 transition-all text-foreground placeholder:text-muted-foreground" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-[#888888] uppercase tracking-widest mb-2 block">Email</label>
                <input name="email" value={formData.email} onChange={handleChange} className="w-full bg-background border border-slate-200 dark:border-[#444444] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/5 transition-all text-foreground placeholder:text-muted-foreground" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-[#888888] uppercase tracking-widest mb-2 block">Phone</label>
                <input name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-background border border-slate-200 dark:border-[#444444] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/5 transition-all text-foreground placeholder:text-muted-foreground" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-[#888888] uppercase tracking-widest mb-2 block">Location</label>
                <input name="location" value={formData.location} onChange={handleChange} className="w-full bg-background border border-slate-200 dark:border-[#444444] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/5 transition-all text-foreground placeholder:text-muted-foreground" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                   <label className="text-[10px] font-bold text-slate-400 dark:text-[#888888] uppercase tracking-widest block">LinkedIn</label>
                   {!showGitHub && (
                     <button onClick={() => setShowGitHub(true)} className="text-[10px] font-bold text-[#0ea5e9] hover:underline">+ Add GitHub</button>
                   )}
                </div>
                <input name="linkedin" value={formData.linkedin} onChange={handleChange} className="w-full bg-background border border-slate-200 dark:border-[#444444] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/5 transition-all text-foreground placeholder:text-muted-foreground" />
              </div>
              {showGitHub && (
                <div className="col-span-2">
                  <div className="flex justify-between items-center mb-2">
                     <label className="text-[10px] font-bold text-slate-400 dark:text-[#888888] uppercase tracking-widest block">GitHub</label>
                     <button onClick={() => setShowGitHub(false)} className="text-[10px] font-bold text-red-400 hover:underline">Remove</button>
                  </div>
                  <input name="github" value={formData.github} onChange={handleChange} className="w-full bg-background border border-slate-200 dark:border-[#444444] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/5 transition-all text-foreground placeholder:text-muted-foreground" />
                </div>
              )}

              {/* Profile Image Upload - Specific to Minimalist Template per User Request */}
              {template === 'minimalist' && (
                <div className="col-span-2 mt-4 p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm">
                    {formData.profileImage ? (
                      <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-10 h-10 text-slate-200" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                    )}
                  </div>
                  <div className="flex flex-col items-center">
                    <label className="bg-[#111] text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer hover:bg-black transition-all">
                      Upload Profile Photo
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setFormData(prev => ({ ...prev, profileImage: reader.result }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    {formData.profileImage && (
                      <button 
                        onClick={() => setFormData(prev => ({ ...prev, profileImage: null }))}
                        className="mt-2 text-[10px] font-bold text-red-400 hover:underline uppercase tracking-widest"
                      >
                        Remove Photo
                      </button>
                    )}
                    <p className="mt-3 text-[10px] text-slate-400 font-medium">Recommended: Square format (JPG/PNG)</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Dynamic Sections */}
          {[
            { id: 'summary', label: 'Professional Summary', height: 'h-28' },
            { id: 'experience', label: 'Work Experience', height: 'h-48' },
            { id: 'education', label: 'Education', height: 'h-32' },
            { id: 'skills', label: 'Technical Skills', height: 'h-32' },
            { id: 'projects', label: 'Projects', height: 'h-40' },
            { id: 'certifications', label: 'Certifications', height: 'h-24' }
          ].map((s) => (
            <section key={s.id}>
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-[#888888] mb-4 flex items-center gap-3">
                {s.label}
                <div className="h-px bg-slate-100 dark:bg-[#2a2a2a] flex-1"></div>
              </h3>
              <textarea 
                name={s.id} 
                value={formData[s.id]} 
                onChange={handleChange} 
                className={`w-full ${s.height} bg-background border border-slate-200 dark:border-[#444444] rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:border-[#0ea5e9] focus:ring-4 focus:ring-[#0ea5e9]/5 transition-all resize-none leading-relaxed text-foreground placeholder:text-muted-foreground`} 
              />
            </section>
          ))}
        </div>
      </div>

      {/* 3. Preview Pane */}
      <div className={`flex-1 h-full overflow-y-auto bg-background-alt flex flex-col items-center p-4 md:p-12 transition-colors ${
        activeTab === 'preview' ? 'flex' : 'hidden md:flex'
      }`}>
        {/* Toolbar */}
        <div className="w-full max-w-[850px] flex flex-col sm:flex-row justify-between items-center mb-10 shrink-0 gap-6 sm:gap-0">
           <div className="flex items-center gap-3">
              <button 
                onClick={resetLayout}
                className="group flex items-center gap-2 px-4 py-2.5 bg-card border border-slate-200 dark:border-[#444444] text-slate-600 dark:text-[#B0B0B0] rounded-xl text-xs font-bold hover:bg-slate-50 dark:hover:bg-[#2a2a2a] transition-all shadow-sm"
              >
                <svg className="w-4 h-4 text-slate-400 group-hover:text-[#0ea5e9]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Change Template
              </button>
              {saveStatus !== 'Idle' && (
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${saveStatus === 'Saving...' ? 'bg-amber-50 text-amber-600 animate-pulse' : saveStatus === 'Saved' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${saveStatus === 'Saving...' ? 'bg-amber-500' : saveStatus === 'Saved' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                  {saveStatus}
                </div>
              )}
           </div>
           <div className="flex items-center gap-3">
              <button 
                onClick={() => saveResumeData('draft')} 
                className="bg-card border text-xs font-bold border-slate-200 dark:border-[#444444] px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-[#2a2a2a] text-slate-600 dark:text-[#B0B0B0] hover:text-foreground"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                Save
              </button>
              <button 
                onClick={handleDownloadPDF} 
                className="bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-bold px-6 py-2.5 rounded-xl shadow-xl hover:opacity-90 transition-all flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Export PDF
              </button>
           </div>
        </div>

        {/* Live Preview Canvas */}
        <div className="w-full flex-1 flex justify-center">
          <div 
             ref={resumeRef} 
             className="w-full max-w-[794px] bg-white min-h-[1123px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-[#444444] origin-top mb-32 md:mb-24 transition-all duration-500 overflow-hidden scale-[0.9] sm:scale-100"
          >
             <SelectedTemplate data={formData} showGitHub={showGitHub} />
          </div>
        </div>
      </div>
    </div>
  );
}
