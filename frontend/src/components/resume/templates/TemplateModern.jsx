import React from 'react';

const TemplateModern = ({ data, showGitHub }) => {
  return (
    <div className="flex min-h-screen bg-white font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar */}
      <div className="w-[280px] bg-[#f2f4f7] p-10 flex flex-col gap-10">
        <header>
          <h1 className="text-3xl font-bold text-slate-900 leading-tight mb-2 uppercase tracking-wide">{data.name}</h1>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">{data.title}</p>
        </header>

        <section>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 mb-6 pb-2 border-b-2 border-slate-300">Details</h3>
          <div className="space-y-4 text-[13px] text-slate-600 font-medium">
            <p className="flex flex-col gap-0.5">
              <span className="text-[10px] font-black uppercase text-slate-400">Email</span>
              {data.email}
            </p>
            <p className="flex flex-col gap-0.5">
              <span className="text-[10px] font-black uppercase text-slate-400">Phone</span>
              {data.phone}
            </p>
            <p className="flex flex-col gap-0.5">
              <span className="text-[10px] font-black uppercase text-slate-400">Location</span>
              {data.location}
            </p>
            <p className="flex flex-col gap-0.5">
              <span className="text-[10px] font-black uppercase text-slate-400">LinkedIn</span>
              <a href={`https://linkedin.com/in/${data.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-slate-900 underline hover:text-[#0ea5e9]">
                {data.linkedin}
              </a>
            </p>
            {showGitHub && data.github && (
              <p className="flex flex-col gap-0.5">
                <span className="text-[10px] font-black uppercase text-slate-400">GitHub</span>
                <a href={`https://github.com/${data.github}`} target="_blank" rel="noopener noreferrer" className="text-slate-900 underline hover:text-[#0ea5e9]">
                  {data.github}
                </a>
              </p>
            )}
          </div>
        </section>

        <section>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 mb-6 pb-2 border-b-2 border-slate-300">Skills</h3>
          <div className="whitespace-pre-line text-[13px] leading-relaxed text-slate-600 font-medium">
            {data.skills}
          </div>
        </section>

        {data.certifications && (
          <section>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 mb-6 pb-2 border-b-2 border-slate-300">Certifications</h3>
            <div className="whitespace-pre-line text-[12px] leading-relaxed text-slate-500 font-bold uppercase tracking-wider">
              {data.certifications}
            </div>
          </section>
        )}
      </div>

      {/* Main Body */}
      <div className="flex-1 p-12 py-16 space-y-12">
        <section>
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-4 italic">Summary</h3>
          <p className="text-[15px] leading-7 text-slate-700 font-medium max-w-2xl border-l-2 border-slate-100 pl-6 italic">
            {data.summary}
          </p>
        </section>

        <section>
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-8 border-b-2 border-slate-50 pb-2">Experience</h3>
          <div className="space-y-10">
            {data.experience.split('\n\n').map((block, i) => (
              <div key={i} className="relative">
                <div className="whitespace-pre-line text-[14px] leading-relaxed text-slate-800 font-medium">
                   {block.split('\n').map((line, j) => {
                      if (line.includes('|')) {
                         const [left, right] = line.split('|');
                         return (
                            <div key={j} className="flex justify-between items-baseline mb-2">
                               <span className="font-black text-slate-900 text-[15px]">{left.trim()}</span>
                               <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{right.trim()}</span>
                            </div>
                         );
                      }
                      const isBullet = line.startsWith('•');
                      return (
                        <div key={j} className="flex items-start gap-2 mb-1">
                           {isBullet && <span className="shrink-0 text-slate-300">•</span>}
                           <p className={isBullet ? "text-slate-600" : "mb-3 font-bold text-slate-500 uppercase text-[11px] tracking-widest"}>
                             {isBullet ? line.replace(/^•\s*/, '') : line}
                           </p>
                        </div>
                      );
                   })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {data.projects && (
          <section>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-8 border-b-2 border-slate-50 pb-2">Projects</h3>
            <div className="space-y-8">
              {data.projects.split('\n\n').map((block, i) => (
                <div key={i}>
                  <div className="whitespace-pre-line text-[14px] leading-relaxed text-slate-800 font-medium">
                    {block.split('\n').map((line, j) => {
                      if (line.includes('|')) {
                        const [left] = line.split('|');
                        return (
                          <div key={j} className="flex justify-between items-baseline mb-2">
                             <span className="font-black text-slate-900 text-[15px]">{left.trim()}</span>
                             <span className="text-[10px] font-bold uppercase tracking-widest text-[#0ea5e9]">View Project</span>
                          </div>
                        );
                      }
                      const isBullet = line.startsWith('•');
                      return (
                        <div key={j} className="flex items-start gap-2 mb-1">
                           {isBullet && <span className="shrink-0 text-slate-300">•</span>}
                           <p className={isBullet ? "text-slate-600" : "font-bold text-slate-500 uppercase text-[11px] tracking-widest mb-1"}>
                             {isBullet ? line.replace(/^•\s*/, '') : line}
                           </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-8 border-b-2 border-slate-50 pb-2">Education</h3>
          <div className="whitespace-pre-line text-[14px] leading-relaxed text-slate-800 font-medium">
            {data.education}
          </div>
        </section>
      </div>
    </div>
  );
};

export default TemplateModern;
