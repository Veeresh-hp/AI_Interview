import React from 'react';

const TemplateHyperion = ({ data, showGitHub }) => {
  return (
    <div className="p-16 px-20 bg-white min-h-screen text-slate-900" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <header className="flex justify-between items-end mb-12 border-b-4 border-slate-900 pb-8">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-2">{data.name}</h1>
          <div className="text-sm font-bold text-slate-500 flex gap-4 uppercase tracking-widest">
            <span>{data.location}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-black uppercase tracking-widest text-[#111] mb-2">{data.title}</p>
          <div className="text-[12px] font-bold text-slate-500 space-y-1">
            <p>{data.email}</p>
            <p>{data.phone}</p>
            <p className="text-slate-400">linkedin.com/in/{data.linkedin}</p>
            {showGitHub && data.github && (
              <p className="font-black text-[#0ea5e9]">github.com/{data.github}</p>
            )}
          </div>
        </div>
      </header>

      <div className="space-y-12">
        {/* Summary Block */}
        <section className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 mb-4 px-3 bg-slate-200 inline-block py-1">Summary</h3>
          <p className="text-[15px] leading-relaxed text-slate-700 font-medium">
            {data.summary}
          </p>
        </section>

        {/* Experience Block */}
        <section>
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 mb-8 border-b-2 border-slate-900 pb-2">Experience</h3>
          <div className="space-y-10">
            {data.experience.split('\n\n').map((block, i) => (
              <div key={i} className="group">
                <div className="whitespace-pre-line text-[14px] leading-relaxed text-slate-800">
                  {block.split('\n').map((line, j) => {
                    if (line.includes('|')) {
                      const [left, right] = line.split('|');
                      return (
                        <div key={j} className="flex justify-between items-baseline mb-3">
                           <span className="font-black text-slate-900 text-lg tracking-tight">{left.trim()}</span>
                           <span className="text-xs font-black bg-slate-900 text-white px-3 py-1 rounded-md uppercase tracking-wider">{right.trim()}</span>
                        </div>
                      );
                    }
                    const isBullet = line.startsWith('•');
                    return (
                      <div key={j} className="flex items-start gap-2 mb-1">
                        {isBullet && <span className="shrink-0 text-slate-300">•</span>}
                        <p className={isBullet ? "text-slate-600 font-medium" : "mb-3 font-bold text-slate-400 uppercase text-[11px] tracking-[0.2em]"}>
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

        {/* Projects Block */}
        {data.projects && (
          <section>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 mb-8 border-b-2 border-slate-900 pb-2">Projects</h3>
            <div className="space-y-8">
              {data.projects.split('\n\n').map((block, i) => (
                <div key={i}>
                  <div className="whitespace-pre-line text-[14px] leading-relaxed text-slate-800">
                    {block.split('\n').map((line, j) => {
                      if (line.includes('|')) {
                        const [left] = line.split('|');
                        return (
                          <div key={j} className="flex justify-between items-baseline mb-2">
                             <span className="font-black text-slate-900 text-lg tracking-tight">{left.trim()}</span>
                             <span className="text-[10px] font-black uppercase text-[#0ea5e9]">View Link</span>
                          </div>
                        );
                      }
                      const isBullet = line.startsWith('•');
                      return (
                        <div key={j} className="flex items-start gap-2 mb-1">
                          {isBullet && <span className="shrink-0 text-slate-300">•</span>}
                          <p className={isBullet ? "text-slate-600" : "font-bold text-slate-500 mb-1"}>
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

        {/* Two Column Grid for Bottom */}
        <div className="grid grid-cols-2 gap-16">
          <section>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 mb-6 border-b-2 border-slate-900 pb-2">Education</h3>
            <div className="whitespace-pre-line text-[14px] leading-relaxed text-slate-800 font-bold uppercase tracking-tight">
              {data.education}
            </div>
          </section>

          <div className="space-y-12">
            <section>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 mb-6 border-b-2 border-slate-900 pb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {data.skills.split('\n').map((skill, i) => (
                  <span key={i} className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-black uppercase text-slate-600 tracking-wider">
                    {skill.replace(/:/g, '').trim()}
                  </span>
                ))}
              </div>
            </section>

            {data.certifications && (
              <section>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 mb-6 border-b-2 border-slate-900 pb-2">Certifications</h3>
                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-6">
                  {data.certifications}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateHyperion;
