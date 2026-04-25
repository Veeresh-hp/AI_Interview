import React from 'react';

const TemplateExecutive = ({ data, showGitHub }) => {
  if (!data) return <div className="p-8 text-center text-slate-400">No data available</div>;

  return (
    <div className="p-[1.2cm] text-slate-900 leading-[1.4] bg-white min-h-full font-serif" style={{ fontFamily: "'Lora', serif" }}>
      {/* Centered Header */}
      <header className="text-center mb-8">
        <h1 className="text-[26px] font-bold mb-2 uppercase tracking-wide text-slate-900">{data.name || 'Your Name'}</h1>
        <div className="flex justify-center flex-wrap gap-x-3 gap-y-1 text-[11px] font-medium text-slate-700">
          <span>{data.phone || 'Phone'}</span>
          <span className="text-slate-300">|</span>
          <a href={`mailto:${data.email}`} className="text-slate-900 underline underline-offset-2 decoration-slate-200 hover:decoration-slate-900 transition-all">{data.email || 'Email'}</a>
          <span className="text-slate-300">|</span>
          <span>{data.location || 'Location'}</span>
          <span className="text-slate-300">|</span>
          <a href={`https://linkedin.com/in/${data.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-slate-900 underline underline-offset-2 decoration-slate-200">LinkedIn</a>
          {showGitHub && data.github && (
            <>
              <span className="text-slate-300">|</span>
              <a href={`https://github.com/${data.github}`} target="_blank" rel="noopener noreferrer" className="text-slate-900 underline underline-offset-2 decoration-slate-200">GitHub</a>
            </>
          )}
        </div>
      </header>

      {/* Summary */}
      {data.summary && (
        <section className="mb-6">
          <p className="text-[11.5px] leading-relaxed text-justify text-slate-800">
            {data.summary}
          </p>
        </section>
      )}

      {/* Education */}
      {data.education && (
        <section className="mb-6">
          <h2 className="text-[14px] font-bold border-b-[1.5px] border-slate-900 pb-0.5 mb-3 uppercase tracking-tight">Education</h2>
          <div className="space-y-3">
            {data.education.split('\n\n').map((block, i) => (
              <div key={i} className="text-[11.5px]">
                 {block.split('\n').map((line, j) => {
                    if (line.includes('|')) {
                      const [left, right] = line.split('|');
                      return (
                        <div key={j} className="flex justify-between items-baseline mb-0.5">
                          <span className="font-bold text-slate-900">{left.trim()}</span>
                          <span className="font-bold text-slate-900">{right.trim()}</span>
                        </div>
                      );
                    }
                    return <p key={j} className="text-slate-700">{line}</p>;
                 })}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {data.skills && (
        <section className="mb-6">
          <h2 className="text-[14px] font-bold border-b-[1.5px] border-slate-900 pb-0.5 mb-3 uppercase tracking-tight">Skills</h2>
          <div className="space-y-1 text-[11.5px]">
            {data.skills.split('\n').map((line, i) => {
              if (line.includes(':')) {
                const [label, desc] = line.split(':');
                return (
                  <p key={i} className="leading-relaxed">
                    <span className="font-bold text-slate-900">{label.trim()}:</span> <span className="text-slate-800">{desc.trim()}</span>
                  </p>
                );
              }
              return <p key={i} className="text-slate-800">{line}</p>;
            })}
          </div>
        </section>
      )}

      {/* Experience */}
      {data.experience && (
        <section className="mb-6">
          <h2 className="text-[14px] font-bold border-b-[1.5px] border-slate-900 pb-0.5 mb-3 uppercase tracking-tight">Internship Experience</h2>
          <div className="space-y-4">
            {data.experience.split('\n\n').map((block, i) => (
              <div key={i} className="text-[11.5px]">
                {block.split('\n').map((line, j) => {
                  if (line.includes('|')) {
                    const [left, right] = line.split('|');
                    return (
                      <div key={j} className="flex justify-between items-baseline mb-1">
                        <span className="font-bold text-slate-900">{left.trim()}</span>
                        <span className="font-bold text-slate-900">{right.trim()}</span>
                      </div>
                    );
                  }
                  const isBullet = line.startsWith('•');
                  return (
                    <div key={j} className="flex items-start gap-2 mb-1">
                      {isBullet && <span className="shrink-0">•</span>}
                      <p className={isBullet ? "text-justify text-slate-800" : "font-semibold text-slate-700 italic"}>
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

      {/* Projects */}
      {data.projects && (
        <section className="mb-6">
          <h2 className="text-[14px] font-bold border-b-[1.5px] border-slate-900 pb-0.5 mb-3 uppercase tracking-tight">Projects</h2>
          <div className="space-y-4">
            {data.projects.split('\n\n').map((block, i) => (
              <div key={i} className="text-[11.5px]">
                {block.split('\n').map((line, j) => {
                  if (line.includes('|')) {
                    const [left] = line.split('|');
                    return (
                      <div key={j} className="flex justify-between items-baseline mb-1">
                        <span className="font-bold text-slate-900">{left.trim()}</span>
                        <span className="font-bold text-slate-800 italic underline decoration-slate-200">Github</span>
                      </div>
                    );
                  }
                  const isBullet = line.startsWith('•');
                  return (
                    <div key={j} className="flex items-start gap-2 mb-1">
                      {isBullet && <span className="shrink-0">•</span>}
                      <p className={isBullet ? "text-justify text-slate-800" : "font-semibold text-slate-700"}>
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

      {/* Certifications */}
      {data.certifications && (
        <section>
          <h2 className="text-[14px] font-bold border-b-[1.5px] border-slate-900 pb-0.5 mb-3 uppercase tracking-tight">Certifications</h2>
          <div className="space-y-1 text-[11.5px]">
            {data.certifications.split('\n').map((line, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="shrink-0">•</span>
                <p className="text-slate-800">
                  {line.replace(/^•\s*/, '')}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default TemplateExecutive;
