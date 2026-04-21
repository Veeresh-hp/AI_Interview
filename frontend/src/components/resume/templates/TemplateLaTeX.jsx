import React from 'react';

const TemplateLaTeX = ({ data, showGitHub }) => {
  return (
    <div className="p-[1.5cm] text-slate-900 leading-tight bg-white min-h-full font-serif" style={{ fontFamily: "'Lora', serif" }}>
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-[28px] font-bold mb-1 uppercase tracking-[0.1em]">{data.name}</h1>
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4 italic">{data.title}</p>
        <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 text-[13px] font-medium text-slate-700">
          <span>{data.location}</span>
          <span>•</span>
          <span>{data.phone}</span>
          <span>•</span>
          <a href={`mailto:${data.email}`} className="underline hover:text-[#0ea5e9] transition-colors">{data.email}</a>
          <span>•</span>
          <a href={`https://linkedin.com/in/${data.linkedin}`} target="_blank" rel="noopener noreferrer" className="underline hover:text-[#0ea5e9] transition-colors">LinkedIn</a>
          {showGitHub && data.github && (
            <>
              <span>•</span>
              <a href={`https://github.com/${data.github}`} target="_blank" rel="noopener noreferrer" className="underline hover:text-[#0ea5e9] transition-colors">GitHub</a>
            </>
          )}
        </div>
      </header>

      {/* Summary */}
      <section className="mb-10 text-center px-12">
        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 mb-4 pb-1 border-b border-slate-200 inline-block px-10">Summary</h2>
        <p className="text-[14px] leading-relaxed text-slate-700 italic">
          {data.summary}
        </p>
      </section>

      {/* Experience */}
      <section className="mb-10">
        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 mb-6 pb-1 border-b border-slate-400 block text-center">Experience</h2>
        <div className="space-y-8">
          {data.experience.split('\n\n').map((block, i) => (
            <div key={i}>
              <div className="whitespace-pre-line text-[14px] leading-relaxed text-slate-800">
                {block.split('\n').map((line, j) => {
                  if (line.includes('|')) {
                    const [left, right] = line.split('|');
                    return (
                      <div key={j} className="flex justify-between items-baseline mb-1 font-bold">
                        <span className="text-[15px]">{left.trim()}</span>
                        <span className="text-xs font-normal italic text-slate-500">{right.trim()}</span>
                      </div>
                    );
                  }
                  const isBullet = line.startsWith('•');
                  return (
                    <div key={j} className="flex items-start gap-2 mb-1">
                      {isBullet && <span className="shrink-0 text-slate-400">•</span>}
                      <p className={isBullet ? "text-slate-700" : "font-semibold text-slate-600 mb-2"}>
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

      {/* Projects */}
      {data.projects && (
        <section className="mb-10">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 mb-6 pb-1 border-b border-slate-400 block text-center">Projects</h2>
          <div className="space-y-6">
            {data.projects.split('\n\n').map((block, i) => (
              <div key={i}>
                <div className="whitespace-pre-line text-[14px] leading-relaxed text-slate-800">
                  {block.split('\n').map((line, j) => {
                    if (line.includes('|')) {
                      const [left] = line.split('|');
                      return (
                        <div key={j} className="flex justify-between items-baseline mb-1 font-bold">
                          <span className="text-[15px]">{left.trim()}</span>
                          <span className="text-[10px] font-normal uppercase tracking-widest text-[#0ea5e9]">Project Link</span>
                        </div>
                      );
                    }
                    const isBullet = line.startsWith('•');
                    return (
                      <div key={j} className="flex items-start gap-2 mb-1">
                        {isBullet && <span className="shrink-0 text-slate-400">•</span>}
                        <p className={isBullet ? "text-slate-700" : "font-semibold text-slate-600 mb-1"}>
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

      {/* Education */}
      <section className="mb-10">
        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 mb-6 pb-1 border-b border-slate-400 block text-center">Education</h2>
        <div className="whitespace-pre-line text-[14px] leading-relaxed text-slate-800">
           {data.education.split('\n').map((line, i) => {
              if (line.includes('|')) {
                const [left, right] = line.split('|');
                return (
                  <div key={i} className="flex justify-between items-baseline mb-1 font-bold">
                    <span>{left.trim()}</span>
                    <span className="text-xs font-normal italic text-slate-500">{right.trim()}</span>
                  </div>
                );
              }
              return <p key={i}>{line}</p>;
           })}
        </div>
      </section>

      {/* Skills */}
      <section className="mb-10">
        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 mb-6 pb-1 border-b border-slate-400 block text-center">Skills</h2>
        <div className="whitespace-pre-line text-[14px] leading-7 text-slate-700 text-center px-10 font-medium">
          {data.skills}
        </div>
      </section>

      {/* Certifications */}
      {data.certifications && (
        <section>
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 mb-6 pb-1 border-b border-slate-400 block text-center">Certifications</h2>
          <div className="whitespace-pre-line text-[14px] leading-relaxed text-slate-700 text-center italic">
            {data.certifications}
          </div>
        </section>
      )}
    </div>
  );
};

export default TemplateLaTeX;
