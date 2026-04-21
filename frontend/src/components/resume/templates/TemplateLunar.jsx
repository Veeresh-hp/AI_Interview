import React from 'react';

const TemplateLunar = ({ data, showGitHub }) => {
  return (
    <div className="bg-white min-h-screen text-slate-800 p-16" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Centered Boxed Header */}
      <header className="flex flex-col items-center mb-16 px-10 py-8 border-[3px] border-slate-900 bg-[#fcfcfc] shadow-[8px_8px_0px_#111]">
        <h1 className="text-3xl font-black uppercase tracking-[0.2em] mb-2">{data.name}</h1>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{data.title}</p>
      </header>

      <div className="flex gap-16">
        {/* Left Column - Details */}
        <div className="w-[30%] flex flex-col gap-10">
          <section>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 mb-6 pb-2 border-b-2 border-slate-900">Details</h3>
            <div className="space-y-6 text-[13px] font-medium text-slate-500">
               <div className="space-y-1">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Location</p>
                 <p className="text-slate-900">{data.location}</p>
               </div>
               <div className="space-y-1">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone</p>
                 <p className="text-slate-900">{data.phone}</p>
               </div>
               <div className="space-y-1">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email</p>
                 <p className="text-slate-900 truncate">{data.email}</p>
               </div>
               <div className="space-y-1">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">LinkedIn</p>
                 <p className="text-slate-900 truncate">{data.linkedin}</p>
               </div>
               {showGitHub && data.github && (
                 <div className="space-y-1">
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">GitHub</p>
                   <p className="text-slate-900 truncate">{data.github}</p>
                 </div>
               )}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 mb-6 pb-2 border-b-2 border-slate-900">Skills</h3>
            <div className="whitespace-pre-line text-[13px] leading-relaxed text-slate-600 font-medium tracking-tight">
              {data.skills}
            </div>
          </section>

          {data.certifications && (
            <section>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 mb-6 pb-2 border-b-2 border-slate-900">Certifications</h3>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-5">
                {data.certifications}
              </div>
            </section>
          )}
        </div>

        {/* Right Column - Content */}
        <div className="flex-1 space-y-12">
          <section>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 mb-6 pb-2 border-b-2 border-slate-900 flex justify-between items-center">
              Summary
              <span className="w-2 h-2 bg-slate-900 rounded-full"></span>
            </h3>
            <p className="text-[14px] leading-relaxed text-slate-700 font-medium">
              {data.summary}
            </p>
          </section>

          <section>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 mb-6 pb-2 border-b-2 border-slate-900 flex justify-between items-center">
              Experience
              <span className="w-2 h-2 bg-slate-900 rounded-full"></span>
            </h3>
            <div className="space-y-8">
              {data.experience.split('\n\n').map((block, i) => (
                <div key={i} className="text-[14px] leading-relaxed">
                  {block.split('\n').map((line, j) => {
                    if (line.includes('|')) {
                      const [left, right] = line.split('|');
                      return (
                        <div key={j} className="flex justify-between items-baseline mb-2 font-black text-slate-900 uppercase tracking-tight">
                          <span className="text-[15px]">{left.trim()}</span>
                          <span className="text-[11px] text-slate-400 font-bold">{right.trim()}</span>
                        </div>
                      );
                    }
                    const isBullet = line.startsWith('•');
                    return (
                      <div key={j} className="flex items-start gap-3 mb-1.5 min-h-[1.5em]">
                         {isBullet && <div className="shrink-0 w-1.5 h-[1.5px] bg-slate-200 mt-[0.6em]"></div>}
                         <p className={isBullet ? "text-slate-600 font-medium" : "mb-2 font-bold text-slate-400 uppercase text-[10px] tracking-widest"}>
                           {isBullet ? line.replace(/^•\s*/, '') : line}
                         </p>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </section>

          {data.projects && (
            <section>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 mb-6 pb-2 border-b-2 border-slate-900 flex justify-between items-center">
                Projects
                <span className="w-2 h-2 bg-slate-900 rounded-full"></span>
              </h3>
              <div className="space-y-6">
                {data.projects.split('\n\n').map((block, i) => (
                  <div key={i} className="text-[14px]">
                    {block.split('\n').map((line, j) => {
                      if (line.includes('|')) {
                        const [left] = line.split('|');
                        return (
                          <div key={j} className="flex justify-between items-baseline mb-1 font-black uppercase tracking-tight text-slate-900">
                             <span className="text-[15px]">{left.trim()}</span>
                          </div>
                        );
                      }
                      const isBullet = line.startsWith('•');
                      return (
                        <div key={j} className="flex items-start gap-3 mb-1">
                          {isBullet && <div className="shrink-0 w-1.5 h-[1.5px] bg-slate-200 mt-[0.6em]"></div>}
                          <p className={isBullet ? "text-slate-600" : "font-bold text-slate-400 uppercase text-[10px] tracking-widest mb-1"}>
                            {isBullet ? line.replace(/^•\s*/, '') : line}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 mb-6 pb-2 border-b-2 border-slate-900 flex justify-between items-center">
              Education
              <span className="w-2 h-2 bg-slate-900 rounded-full"></span>
            </h3>
            <div className="whitespace-pre-line text-[14px] font-bold text-slate-900 uppercase">
              {data.education}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TemplateLunar;
