import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import DashboardPreview from '../components/resume/DashboardPreview';
import { useResume } from '../hooks/useResume';
import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { loadResume } = useResume();


  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [interviews, setInterviews] = useState([]);

  console.log("Dashboard Auth State:", { isAuthenticated, authLoading, user });

  const fetchResumes = useCallback(async () => {
    if (!user?.email) return;
    try {
      const response = await fetch(`/api/resumes?userEmail=${user.email}`);
      const data = await response.json();
      setResumes(data);
    } catch (err) {
      console.error("Failed to fetch resumes:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  const fetchInterviews = useCallback(async () => {
    if (!user?.email) return;
    try {
      const response = await fetch(`/api/history?userEmail=${user.email}`);
      const data = await response.json();
      setInterviews(data);
    } catch (err) {
      console.error("Failed to fetch interviews:", err);
    }
  }, [user?.email]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      console.log("Not authenticated, redirecting to /auth");
      navigate('/auth');
    } else if (isAuthenticated) {
      console.log("Authenticated, fetching data for:", user?.email);
      fetchResumes();
      fetchInterviews();
    }
  }, [isAuthenticated, authLoading, navigate, fetchResumes, fetchInterviews, user?.email]);

  if (authLoading || (loading && isAuthenticated)) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background text-foreground space-y-4">
        <div className="w-12 h-12 border-4 border-slate-200 dark:border-[#444444] border-t-[#0ea5e9] rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-muted-foreground animate-pulse tracking-widest uppercase">Preparing your workspace...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background text-foreground">
        <p className="text-sm font-bold text-red-500">Security Check Failed. Redirecting to login...</p>
      </div>
    );
  }

  const resumesToDisplay = showAll ? resumes : resumes.slice(0, 3);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resume?")) return;
    try {
      const response = await fetch(`/api/resumes/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setResumes(resumes.filter(r => r.id !== id));
      }
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  const handleEdit = (resume) => {
    loadResume(resume);
    navigate('/resume-builder');
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <main className="flex-1 overflow-y-auto relative pb-24 md:pb-8">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-sky-500/5 to-transparent pointer-events-none -z-10" />
        
        <div className="max-w-7xl mx-auto px-8 md:px-12 lg:px-16 py-12">
          {/* Header Section */}
          <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight mb-2">
                Welcome back, <span className="text-[#0ea5e9]">{user?.name?.split(' ')[0] || 'User'}</span>
              </h1>
              <p className="text-muted-foreground text-lg font-medium">Manage your professional resumes and AI mock interviews.</p>
            </div>
            
            <Link 
              to="/resume-builder" 
              className="px-6 py-3 bg-[#111] dark:bg-slate-100 dark:text-slate-900 text-white rounded-2xl font-bold hover:bg-black dark:hover:bg-white transition-all shadow-lg flex items-center gap-2 group whitespace-nowrap"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
              Create New Resume
            </Link>
          </header>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Main Content: Resume List */}
            <div className="lg:col-span-2 space-y-8">
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-3">
                    Recent Resumes
                    <span className="text-xs bg-slate-100 dark:bg-zinc-800 text-muted-foreground px-2.5 py-1 rounded-full font-bold">
                      {resumes.length}
                    </span>
                  </h2>
                  {resumes.length > 3 && (
                    <button 
                      onClick={() => setShowAll(!showAll)}
                      className="text-sm font-bold text-[#0ea5e9] hover:underline"
                    >
                      {showAll ? 'Show Less' : 'View All'}
                    </button>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {resumes.length > 0 ? (
                    resumesToDisplay.map((resume, index) => (
                      <div key={resume.id || index} className="relative group h-72 bg-card border border-slate-200 dark:border-[#444444] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                        <DashboardPreview data={resume} template={resume.template} />
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                          <button 
                            onClick={() => handleEdit(resume)}
                            className="p-2 bg-white dark:bg-[#121212] border border-slate-200 dark:border-[#444444] rounded-lg shadow-sm hover:text-[#0ea5e9] transition-colors"
                            title="Edit"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          </button>
                          <button 
                            onClick={() => handleDelete(resume.id)}
                            className="p-2 bg-white dark:bg-[#121212] border border-slate-200 dark:border-[#444444] rounded-lg shadow-sm hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-20 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-3xl flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-slate-50 dark:bg-zinc-900 rounded-full flex items-center justify-center text-2xl mb-4">📄</div>
                      <h3 className="text-lg font-bold mb-1">No resumes yet</h3>
                      <p className="text-muted-foreground mb-6 max-w-xs">Create your first professional resume with our AI builder.</p>
                      <Link to="/resume-builder" className="text-[#0ea5e9] font-bold hover:underline">Start building →</Link>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Sidebar: Stats & CTA */}
            <div className="space-y-8">
              <div className="p-8 bg-card border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#0ea5e9]/10 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-bold mb-4 relative z-10">AI Mock Interview</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 relative z-10">
                  Ready to test your skills? Start a mock interview based on your resumes or a job description.
                </p>
                <Link 
                  to="/interview" 
                  className="w-full py-3 bg-[#0ea5e9] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#0284c7] transition-all shadow-md shadow-sky-500/20"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  Start Practice
                </Link>
              </div>

              <div className="p-8 bg-slate-50 dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800 rounded-3xl">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Quick Stats</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Total Interviews</span>
                    <span className="text-lg font-bold">{interviews.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Avg. Score</span>
                    <span className="text-lg font-bold text-[#0ea5e9]">
                      {interviews.length > 0 
                        ? (interviews.reduce((acc, curr) => acc + (curr.score || 0), 0) / interviews.length / 10).toFixed(1)
                        : '0.0'
                      }/10
                    </span>
                  </div>
                  <div className="pt-4 border-t border-slate-200 dark:border-zinc-800">
                    <Link to="/history" className="text-xs font-bold text-[#0ea5e9] hover:underline uppercase tracking-wider">View Full History →</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
