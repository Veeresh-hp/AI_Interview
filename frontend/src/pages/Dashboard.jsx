import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import DashboardPreview from '../components/resume/DashboardPreview';
import { useResume } from '../context/ResumeContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { loadResume } = useResume();
  const [openMenuId, setOpenMenuId] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/resumes');
      const data = await response.json();
      setResumes(data);
    } catch (err) {
      console.error("Failed to fetch resumes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resume?")) return;
    try {
      await fetch(`http://127.0.0.1:5000/api/resumes/${id}`, { method: 'DELETE' });
      setResumes(resumes.filter(r => r._id !== id));
      setOpenMenuId(null);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="h-screen flex overflow-hidden text-slate-900 bg-[#fafafa]">
      <Sidebar />


      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="w-full px-8 md:px-12 lg:px-16 pb-16 max-w-7xl">
          <div className="h-24 flex items-center mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          </div>

          <section className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="p-8 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col h-full">
              <h2 className="text-xl font-bold mb-2">Build New Resume</h2>
              <p className="text-slate-500 mb-8 text-sm font-medium flex-1">Use our AI to craft a highly optimized resume targeting specific roles.</p>
              <div className="mt-auto">
                  <Link to="/resume-builder" className="bg-[#111] text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-black transition-colors inline-block shadow-md">Create Resume</Link>
              </div>
            </div>

            <div className="p-8 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col h-full">
              <h2 className="text-xl font-bold mb-2">Mock Interview</h2>
              <p className="text-slate-500 mb-8 text-sm font-medium flex-1">Practice answering dynamic questions based on your resume and JD.</p>
              <div className="mt-auto">
                  <Link to="/interview" className="bg-[#0ea5e9] text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-[#0284c7] transition-colors inline-block shadow-md">Start Interview</Link>
              </div>
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Recent Resumes</h3>
              <button 
                onClick={() => setShowAll(!showAll)}
                className="text-sm font-bold text-[#0ea5e9] hover:underline"
              >
                {showAll ? 'Show less' : 'View all'}
              </button>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
               {loading ? (
                 <div className="col-span-full py-20 text-center text-slate-400 font-medium">Loading your resumes...</div>
               ) : resumes.length === 0 ? (
                 <div className="col-span-full py-20 text-center text-slate-400 font-medium bg-white rounded-2xl border border-dashed border-slate-200">
                   No resumes found. Start by building one!
                 </div>
               ) : (
                 (showAll ? resumes : resumes.slice(0, 3)).map(resume => (
                   <div 
                     key={resume._id} 
                     className="group cursor-pointer"
                     onMouseLeave={() => setOpenMenuId(null)}
                     onClick={() => {
                        loadResume(resume);
                        navigate('/resume-builder');
                     }}
                   >
                     {/* Canvas Wrapper */}
                     <div className="aspect-[1/1.2] p-2.5 rounded-2xl border border-slate-200 bg-white group-hover:border-[#0ea5e9] group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all relative flex flex-col shadow-sm mb-4">
                       
                       {/* The Mini Document Graphic (Live Preview) */}
                       <div className="w-full h-full bg-[#f8fafc] relative overflow-hidden rounded-xl border border-slate-100 select-none">
                          <DashboardPreview 
                            data={resume.structuredData} 
                            template={resume.template} 
                          />
  
                          {/* Hover Tools Overlay */}
                          <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                             <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#0ea5e9] shadow-xl hover:scale-110 transition-transform font-bold" title="Edit Resume">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                             </button>
                          </div>
                       </div>
                     </div>
                     
                      {/* Document Metadata block */}
                      <div className="px-1 flex justify-between items-start mt-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                             <h4 className="text-[15px] font-bold text-slate-900 group-hover:text-[#0ea5e9] transition-colors line-clamp-1">
                               {resume.structuredData?.name || "Untitled Candidate"}
                             </h4>
                             <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${resume.status === 'saved' ? 'bg-[#f0f9ff] text-[#0ea5e9] border border-[#bae6fd]' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                               {resume.status || 'draft'}
                             </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider truncate max-w-[120px]">{resume.structuredData?.title}</p>
                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                            <span className="text-[10px] font-black text-[#0ea5e9] uppercase tracking-[0.1em]">{resume.template || 'Executive'}</span>
                          </div>
                          <p className="text-[10px] font-medium text-slate-400 mt-1">Edited {formatDate(resume.updatedAt)}</p>
                        </div>
                       <div className="relative">
                         <button 
                           onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === resume._id ? null : resume._id); }}
                           className={`p-1.5 transition-colors bg-white rounded-lg border hover:bg-slate-50 ${openMenuId === resume._id ? 'border-slate-300 text-slate-900 shadow-sm' : 'border-transparent text-slate-400 hover:text-slate-900'}`} 
                           title="Options"
                         >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                         </button>
  
                         {/* Dropdown Menu */}
                         {openMenuId === resume._id && (
                           <div className="absolute right-0 bottom-full mb-2 w-44 bg-white rounded-xl shadow-xl border border-slate-100 z-[60] overflow-hidden py-1" onClick={e => e.stopPropagation()}>
                             <button onClick={(e) => { e.stopPropagation(); loadResume(resume); navigate('/resume-builder'); }} className="w-full text-left px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#0ea5e9] transition-colors flex items-center gap-3">
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                               Edit Details
                             </button>
                             <hr className="border-slate-100 my-1" />
                             <button onClick={(e) => { e.stopPropagation(); handleDelete(resume._id); }} className="w-full text-left px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3">
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                               Delete forever
                             </button>
                           </div>
                         )}
                       </div>
                      </div>
                   </div>
                 ))
               )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
