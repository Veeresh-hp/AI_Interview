import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function InterviewResults() {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const API = 'http://localhost:8000';

  useEffect(() => {
    const { sessionId } = location.state || {};

    const fetchResult = async () => {
      try {
        if (sessionId) {
          const res = await axios.get(`${API}/report?session_id=${sessionId}`);
          const data = res.data;
          
          setResults({
            totalScore: data.overall_score * 10, // Convert 10-scale to 100-scale
            generalFeedback: data.summary,
            evaluations: data.breakdown.map(item => ({ feedback: item.feedback, score: item.score })),
            qna: data.breakdown.map(item => ({ 
              question: item.question, 
              answer: item.answer 
            })),
            pros: data.pros,
            cons: data.cons,
            verdict: data.verdict
          });
        } else {
          console.error("No sessionId found");
          navigate('/interview');
        }
      } catch (error) {
        console.error("Report Fetch Error:", error);
        alert("Failed to load interview results. Please ensure the backend is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [location.state, navigate]);


  return (
    <div className="min-h-screen bg-background text-foreground p-8 flex items-center justify-center transition-colors">
      {loading ? (
         <div className="flex flex-col items-center justify-center space-y-6">
            <div className="w-16 h-16 border-4 border-slate-200 dark:border-[#444444] border-t-[#0ea5e9] rounded-full animate-spin"></div>
            <p className="text-xl font-bold animate-pulse text-muted-foreground text-center">AI is evaluating your interview... <br/><span className="text-sm font-medium opacity-60">This may take a moment</span></p>
         </div>
      ) : results ? (
         <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full max-w-4xl space-y-8 pb-20 pt-10">
            <div className="text-center mb-12">
               <h1 className="text-4xl font-bold mb-4 tracking-tight">Interview Results</h1>
               <p className="text-slate-500 dark:text-[#B0B0B0] text-lg font-medium">Detailed feedback mapped to your performance.</p>
            </div>

            <div className="bg-card border border-slate-200 dark:border-[#444444] shadow-md p-10 rounded-3xl flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-8 relative overflow-hidden">
                <div className="relative z-10 text-foreground">
                   <h2 className="text-sm font-bold text-[#0ea5e9] uppercase tracking-widest mb-2">Overall Score</h2>
                   <div className="text-7xl font-extrabold font-serif tracking-tight">{results.totalScore}<span className="text-3xl text-slate-400 dark:text-[#888888]">/100</span></div>
                </div>
                <div className="flex-1 max-w-lg relative z-10 text-foreground">
                   <p className="text-lg leading-relaxed font-semibold italic opacity-90">"{results.generalFeedback}"</p>
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <svg className="w-32 h-32 text-[#0ea5e9]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                </div>
            </div>

            <div className="space-y-6 mt-12">
               <h3 className="text-2xl font-bold border-b border-slate-200 dark:border-[#444444] pb-4">Detailed Question Feedback</h3>
               
               {results.qna?.map((item, idx) => (
                 <div key={idx} className="p-8 bg-card border border-slate-200 dark:border-[#444444] rounded-2xl transition-all shadow-sm hover:shadow-md hover:bg-slate-100 dark:hover:bg-[#2a2a2a]">
                    <div className="flex justify-between items-start mb-4 gap-4 text-foreground">
                      <h4 className="text-lg font-bold tracking-tight leading-snug">Q{idx + 1}: {item.question}</h4>
                      <span className="bg-[#e0f2fe] dark:bg-[#444444] text-[#0369a1] dark:text-[#0ea5e9] px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">Score: {results.evaluations[idx]?.score}/10</span>
                    </div>
                    
                    <div className="mb-6">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">Your Answer</span>
                      <p className="text-foreground/80 font-medium leading-relaxed bg-background-alt p-4 rounded-xl border-l-[3px] border-slate-300 dark:border-[#555555] italic">"{item.answer}"</p>
                    </div>
                    
                    <div className="bg-[#f0f9ff] dark:bg-[#1e1e1e] p-6 rounded-xl border border-[#bae6fd] dark:border-[#444444] relative overflow-hidden">
                       <div className="absolute top-0 bottom-0 left-0 w-1 bg-[#0ea5e9]"></div>
                       <h5 className="font-bold text-[#0284c7] dark:text-[#0ea5e9] mb-2 text-sm uppercase tracking-wide flex items-center gap-2">AI Critique</h5>
                       <p className="text-sm text-foreground/90 font-semibold leading-relaxed mt-3">{results.evaluations[idx]?.feedback}</p>
                    </div>
                 </div>
               ))}
            </div>

            <div className="mt-12 flex justify-center gap-4">
              <Link to="/interview" className="px-8 py-4 bg-[#111] dark:bg-slate-100 dark:text-slate-950 text-white font-bold rounded-2xl hover:bg-black dark:hover:bg-white transition-all shadow-md">Retry Interview</Link>
              <Link to="/dashboard" className="px-8 py-4 bg-card border border-slate-200 dark:border-slate-800 font-bold rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all text-foreground shadow-sm">Back to Dashboard</Link>
            </div>
         </motion.div>
      ) : (
        <div className="text-center text-foreground">
          <h2 className="text-2xl font-bold mb-4">No results found</h2>
          <Link to="/dashboard" className="text-[#0ea5e9] font-bold">Return to Dashboard</Link>
        </div>
      )}
    </div>
  );
}
