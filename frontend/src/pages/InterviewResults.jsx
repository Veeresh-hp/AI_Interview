import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function InterviewResults() {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const hasRequested = useRef(false);

  useEffect(() => {
    const { qna, difficulty, mode, interviewId } = location.state || {};

    const fetchResult = async () => {
      try {
        if (interviewId) {
          // View Report Mode - Fetch existing result
          const res = await axios.get(`http://127.0.0.1:5000/api/interviews/${interviewId}`);
          const data = res.data;
          setResults({
            totalScore: data.score,
            generalFeedback: data.generalFeedback,
            evaluations: data.qna.map(item => ({ feedback: item.feedback, score: item.score })),
            qna: data.qna // Pass qna for display
          });
        } else if (qna && qna.length > 0) {
          // New Interview Mode - Evaluate
          if (hasRequested.current) return;
          hasRequested.current = true;
          
          const res = await axios.post('http://127.0.0.1:5000/api/ai/evaluate-answers', {
            qna,
            difficulty: difficulty || "Medium",
            mode: mode || "Resume + JD"
          });
          setResults({ ...res.data, qna });
        } else {
          console.error("No interview data found");
          navigate('/interview');
        }
      } catch (error) {
        console.error("Evaluation/Fetch Error:", error);
        alert("Failed to load interview results.");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [location.state, navigate]);


  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 p-8 flex items-center justify-center">
      {loading ? (
         <div className="flex flex-col items-center justify-center space-y-6">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-[#0ea5e9] rounded-full animate-spin"></div>
            <p className="text-xl font-bold animate-pulse text-slate-500 text-center">AI is evaluating your interview... <br/><span className="text-sm font-medium opacity-60">This may take a moment</span></p>
         </div>
      ) : results ? (
         <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full max-w-4xl space-y-8 pb-20 pt-10">
            <div className="text-center mb-12">
               <h1 className="text-4xl font-bold mb-4 tracking-tight">Interview Results</h1>
               <p className="text-slate-500 text-lg font-medium">Detailed feedback mapped to your performance.</p>
            </div>

            <div className="bg-white border border-slate-200 shadow-md p-10 rounded-3xl flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-8 relative overflow-hidden">
                <div className="relative z-10">
                   <h2 className="text-sm font-bold text-[#0ea5e9] uppercase tracking-widest mb-2">Overall Score</h2>
                   <div className="text-7xl font-extrabold font-serif text-slate-900 tracking-tight">{results.totalScore}<span className="text-3xl text-slate-400">/100</span></div>
                </div>
                <div className="flex-1 max-w-lg relative z-10">
                   <p className="text-lg text-slate-700 leading-relaxed font-semibold italic">"{results.generalFeedback}"</p>
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <svg className="w-32 h-32 text-[#0ea5e9]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                </div>
            </div>

            <div className="space-y-6 mt-12">
               <h3 className="text-2xl font-bold border-b border-slate-200 pb-4 text-slate-800">Detailed Question Feedback</h3>
               
               {results.qna?.map((item, idx) => (
                 <div key={idx} className="p-8 bg-white border border-slate-200 rounded-2xl transition-all shadow-sm hover:shadow-md">
                    <div className="flex justify-between items-start mb-4 gap-4">
                      <h4 className="text-lg font-bold text-slate-900 tracking-tight leading-snug">Q{idx + 1}: {item.question}</h4>
                      <span className="bg-[#e0f2fe] text-[#0369a1] px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">Score: {results.evaluations[idx]?.score}/10</span>
                    </div>
                    
                    <div className="mb-6">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Your Answer</span>
                      <p className="text-slate-600 font-medium leading-relaxed bg-slate-50 p-4 rounded-xl border-l-[3px] border-slate-300 italic">"{item.answer}"</p>
                    </div>
                    
                    <div className="bg-[#f0f9ff] p-6 rounded-xl border border-[#bae6fd] relative overflow-hidden">
                       <div className="absolute top-0 bottom-0 left-0 w-1 bg-[#0ea5e9]"></div>
                       <h5 className="font-bold text-[#0284c7] mb-2 text-sm uppercase tracking-wide flex items-center gap-2">AI Critique</h5>
                       <p className="text-sm text-slate-700 font-semibold leading-relaxed mt-3">{results.evaluations[idx]?.feedback}</p>
                    </div>
                 </div>
               ))}
            </div>

            <div className="mt-12 flex justify-center gap-4">
              <Link to="/interview" className="px-8 py-4 bg-[#111] text-white font-bold rounded-2xl hover:bg-black transition-all shadow-md">Retry Interview</Link>
              <Link to="/dashboard" className="px-8 py-4 bg-white border border-slate-200 font-bold rounded-2xl hover:bg-slate-50 transition-all text-slate-700 shadow-sm">Back to Dashboard</Link>
            </div>
         </motion.div>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No results found</h2>
          <Link to="/dashboard" className="text-[#0ea5e9] font-bold">Return to Dashboard</Link>
        </div>
      )}
    </div>
  );
}
