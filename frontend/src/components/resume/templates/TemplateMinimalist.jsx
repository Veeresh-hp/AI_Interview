import React from 'react';

const TemplateMinimalist = ({ data, showGitHub }) => {
  return (
    <div className="bg-white min-h-screen text-slate-800" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Banner Header */}
      <header className="bg-[#f2e7da] p-12 px-16 flex items-center gap-12">
        {/* Profile Image */}
        <div className="w-32 h-32 rounded-3xl bg-white border-4 border-white shadow-xl flex items-center justify-center text-slate-300 shrink-0 overflow-hidden">
          {data.profileImage ? (
            <img src={data.profileImage} alt={data.name} className="w-full h-full object-cover" />
          ) : (
            <svg className="w-20 h-20 text-slate-200" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          )}
        </div>
        
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">{data.name}</h1>
          <p className="text-lg font-bold text-slate-600 uppercase tracking-[0.1em] mb-6">{data.title}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold text-slate-700/80">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              {data.location}
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              {data.email}
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              {data.phone}
            </span>
          </div>
        </div>
      </header>

      {/* Body Content (2 Columns) */}
      <div className="flex p-16 gap-16">
        {/* Left Column (Narrow) */}
        <div className="w-[30%] space-y-12">
          <section>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-6 border-b-2 border-slate-100 pb-2">Summary</h3>
            <p className="text-[14px] leading-relaxed text-slate-600 font-medium italic">
              {data.summary}
            </p>
          </section>

          <section>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-6 border-b-2 border-slate-100 pb-2">Skills</h3>
            <div className="whitespace-pre-line text-[14px] leading-relaxed text-slate-600 font-medium">
              {data.skills}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-6 border-b-2 border-slate-100 pb-2">Contact</h3>
            <div className="space-y-4 text-[13px] font-bold text-slate-500 uppercase tracking-wider">
              <a href={`https://linkedin.com/in/${data.linkedin}`} target="_blank" rel="noopener noreferrer" className="block hover:text-[#0ea5e9]">LinkedIn</a>
              {showGitHub && data.github && (
                <a href={`https://github.com/${data.github}`} target="_blank" rel="noopener noreferrer" className="block hover:text-[#0ea5e9]">GitHub</a>
              )}
            </div>
          </section>
        </div>

        {/* Right Column (Wide) */}
        <div className="flex-1 space-y-12">
          <section>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 mb-8 pb-2 border-b-2 border-slate-900">Experience</h3>
            <div className="space-y-10">
              {data.experience.split('\n\n').map((block, i) => (
                <div key={i}>
                  <div className="whitespace-pre-line text-[14px] leading-relaxed text-slate-800 font-medium">
                    {block.split('\n').map((line, j) => {
                      if (line.includes('|')) {
                        const [left, right] = line.split('|');
                        return (
                          <div key={j} className="flex justify-between items-baseline mb-2">
                             <span className="font-black text-slate-900 text-[15px]">{left.trim()}</span>
                             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{right.trim()}</span>
                          </div>
                        );
                      }
                      const isBullet = line.startsWith('•');
                      return (
                        <div key={j} className="flex items-start gap-2 mb-1">
                           {isBullet && <span className="shrink-0 text-slate-300">•</span>}
                           <p className={isBullet ? "text-slate-600" : "mb-3"}>{isBullet ? line.replace(/^•\s*/, '') : line}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 mb-8 pb-2 border-b-2 border-slate-900">Education</h3>
            <div className="whitespace-pre-line text-[14px] leading-relaxed text-slate-800 font-medium">
              {data.education}
            </div>
          </section>

          {data.projects && (
            <section>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 mb-8 pb-2 border-b-2 border-slate-900">Projects</h3>
              <div className="whitespace-pre-line text-[14px] leading-relaxed text-slate-800 font-medium">
                {data.projects}
              </div>
            </section>
          )}

          {data.certifications && (
            <section>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 mb-8 pb-2 border-b-2 border-slate-900">Certifications</h3>
              <div className="whitespace-pre-line text-[14px] leading-relaxed text-slate-800 font-medium underline underline-offset-8 decoration-slate-100">
                {data.certifications}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateMinimalist;
