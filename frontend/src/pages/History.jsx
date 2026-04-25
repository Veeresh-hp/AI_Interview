import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/Sidebar';

export default function History() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.email) return;
    fetch(`http://localhost:8000/history?userEmail=${user.email}`)
      .then(res => res.json())
      .then(data => {
        setInterviews(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [user?.email]);

  const viewReport = (id) => {
    navigate('/interview/results', { state: { sessionId: id } });
  };

  return (
    <div className="h-screen flex overflow-hidden text-foreground bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <div className="w-full px-8 md:px-12 lg:px-16 pb-16 max-w-7xl">
          <div className="h-24 flex items-center mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Interview History</h1>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-[#0ea5e9] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid gap-6">
              {interviews.length === 0 ? (
                <div className="p-12 text-center bg-card rounded-2xl border border-slate-200 dark:border-[#444444]">
                  <p className="text-slate-500 font-medium">No interview history found yet. Start your first practice session!</p>
                </div>
              ) : (
                interviews.map((interview) => (
                  <div key={interview._id} className="p-6 rounded-2xl border border-slate-200 dark:border-[#444444] bg-card shadow-sm group hover:scale-[1.01] transition-all hover:bg-slate-100 dark:hover:bg-[#2a2a2a]">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold">Technical Interview - {interview.difficulty}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                          {new Date(interview.createdAt).toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })} • {new Date(interview.createdAt).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: true 
                          })}
                        </p>
                      </div>
                      <div className={`px-4 py-2 rounded-xl text-lg font-bold ${
                        interview.score >= 70 ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 
                        interview.score >= 50 ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' : 
                        'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                      }`}>
                        {interview.score}%
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-foreground/70 line-clamp-2 italic">
                        "{interview.generalFeedback}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-zinc-800">
                      <div className="flex gap-4">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{interview.qna.length} Questions</span>
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{interview.mode || 'Standard'}</span>
                      </div>
                      <button 
                        onClick={() => viewReport(interview._id)}
                        className="text-sm font-bold text-[#0ea5e9] hover:underline flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                      >
                        View Report
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

