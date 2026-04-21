import React from 'react';

const TemplateAurora = ({ data, showGitHub }) => {
  return (
    <div className="bg-white min-h-screen text-slate-800 flex font-serif" style={{ fontFamily: "'Lora', serif" }}>
      {/* Left Column - Main Details */}
      <div className="w-[60%] p-12 border-r border-pink-100 flex flex-col">
        <header className="mb-14">
          <h1 className="text-5xl font-black text-[#f472b6] leading-none mb-3 italic tracking-tighter">{data.name}</h1>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-[0.3em] font-sans ml-1">{data.title}</p>
        </header>

        <div className="space-y-12">
          {/* Experience */}
          <section>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#f472b6] mb-6 flex items-center gap-4 after:h-px after:flex-1 after:bg-pink-100 font-sans">Experience</h3>
            <div className="space-y-8">
              {data.experience.split('\n\n').map((block, i) => (
                <div key={i} className="text-[14px] leading-relaxed">
                  {block.split('\n').map((line, j) => {
                    if (line.includes('|')) {
                      const [left, right] = line.split('|');
                      return (
                        <div key={j} className="flex justify-between items-baseline mb-1 font-bold text-slate-900">
                          <span className="text-[16px]">{left.trim()}</span>
                          {right && <span className="text-[10px] font-sans text-slate-400 uppercase tracking-widest">{right.trim()}</span>}
                        </div>
                      );
                    }
                    const isBullet = line.startsWith('•');
                    return (
                      <div key={j} className="flex items-start gap-2 mb-1">
                        {isBullet && <span className="shrink-0 text-pink-300">•</span>}
                        <p className={isBullet ? "text-slate-700" : "text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 font-sans"}>
                          {isBullet ? line.replace(/^•\s*/, '') : line}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </section>

          {/* Projects */}
          {data.projects && (
            <section>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#f472b6] mb-6 flex items-center gap-4 after:h-px after:flex-1 after:bg-pink-100 font-sans">Projects</h3>
              <div className="space-y-6">
                {data.projects.split('\n\n').map((block, i) => (
                  <div key={i} className="text-[14px] leading-relaxed">
                    {block.split('\n').map((line, j) => {
                      if (line.includes('|')) {
                        const [left] = line.split('|');
                        return (
                          <div key={j} className="flex justify-between items-baseline mb-1 font-bold text-slate-900">
                            <span className="text-[16px] italic">{left.trim()}</span>
                          </div>
                        );
                      }
                      const isBullet = line.startsWith('•');
                      return (
                        <div key={j} className="flex items-start gap-2 mb-1">
                          {isBullet && <span className="shrink-0 text-pink-300">•</span>}
                          <p className={isBullet ? "text-slate-700" : "font-bold text-slate-500 mb-1"}>
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

          {/* Education */}
          <section>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#f472b6] mb-6 flex items-center gap-4 after:h-px after:flex-1 after:bg-pink-100 font-sans">Education</h3>
            <div className="text-[14px] leading-relaxed text-slate-700 whitespace-pre-line">
              {data.education}
            </div>
          </section>
        </div>
      </div>

      {/* Right Column - Brief & Skills */}
      <div className="flex-1 bg-pink-50/30 p-12 flex flex-col gap-12">
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-pink-100">
          <div className="space-y-4 text-[13px] font-medium text-slate-600 font-sans">
            <p className="flex flex-col"><span className="text-[10px] font-black uppercase text-pink-300 mb-1">Email</span>{data.email}</p>
            <p className="flex flex-col"><span className="text-[10px] font-black uppercase text-pink-300 mb-1">Phone</span>{data.phone}</p>
            <p className="flex flex-col"><span className="text-[10px] font-black uppercase text-pink-300 mb-1">Location</span>{data.location}</p>
            <p className="flex flex-col"><span className="text-[10px] font-black uppercase text-pink-300 mb-1">LinkedIn</span>{data.linkedin}</p>
            {showGitHub && data.github && (
              <p className="flex flex-col"><span className="text-[10px] font-black uppercase text-pink-300 mb-1">GitHub</span>{data.github}</p>
            )}
          </div>
        </section>

        <section>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#f472b6] mb-6 flex items-center gap-4 after:h-px after:flex-1 after:bg-pink-100 font-sans">Summary</h3>
          <p className="text-[14px] leading-relaxed text-slate-600 font-medium italic pl-4 border-l-2 border-pink-200">
            {data.summary}
          </p>
        </section>

        <section>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#f472b6] mb-6 flex items-center gap-4 after:h-px after:flex-1 after:bg-pink-100 font-sans">Skills</h3>
          <div className="whitespace-pre-line text-[14px] leading-relaxed text-slate-700 font-medium">
            {data.skills}
          </div>
        </section>

        {data.certifications && (
          <section>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#f472b6] mb-6 flex items-center gap-4 after:h-px after:flex-1 after:bg-pink-100 font-sans">Certifications</h3>
            <div className="whitespace-pre-line text-[13px] leading-relaxed text-slate-600 italic">
              {data.certifications}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default TemplateAurora;
