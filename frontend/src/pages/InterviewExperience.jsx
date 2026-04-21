import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function InterviewExperience() {
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(90);
  const navigate = useNavigate();
  const location = useLocation();
  const API = 'http://localhost:8000';

  useEffect(() => {
    const { firstQuestion, timeLimit } = location.state || {};
    
    if (firstQuestion) {
      setQuestions([firstQuestion]);
      setTimeLeft(timeLimit || 90);
      setLoading(false);
    } else {
      alert("No question data found. Please restart the interview.");
      navigate('/interview');
    }
  }, [location.state, navigate]);

  // Timer logic
  useEffect(() => {
    if (loading || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, timeLeft]);

  const handleNext = useCallback(async () => {
    setLoading(true);
    const { sessionId } = location.state || {};

    try {
      // 1. Submit answer and get next step
      const res = await axios.post(`${API}/answer`, {
        session_id: sessionId,
        answer: answer
      });

      if (res.data.status === 'completed') {
        // 2. If finished, go to results
        navigate('/interview/results', { 
          state: { 
            sessionId,
            difficulty: location.state?.difficulty || "Medium",
            mode: location.state?.mode || "Resume + JD"
          } 
        });
      } else {
        // 3. Otherwise, append next question
        const nextQ = res.data.question;
        setQuestions(prev => [...prev, nextQ]);
        setCurrentIdx(prev => prev + 1);
        setAnswer('');
        setTimeLeft(location.state?.timeLimit || 90);
      }
    } catch (error) {
      console.error("Submit Answer Error:", error);
      alert(`Failed to submit answer: ${error.response?.data?.detail || error.message}`);
    } finally {
      setLoading(false);
    }
  }, [answer, location.state, navigate]);
  
  // Auto-advance when time hits zero
  useEffect(() => {
    if (timeLeft === 0 && !loading) {
      const timeout = setTimeout(() => {
        handleNext();
      }, 500); 
      return () => clearTimeout(timeout);
    }
  }, [timeLeft, loading, handleNext]);

  const handleLeave = () => {
    if (window.confirm('Are you sure you want to leave the interview? Your progress will not be saved.')) {
      navigate('/dashboard');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 p-8 flex flex-col pt-20 overflow-hidden">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col relative z-20">
          <div className="mb-8 flex justify-between items-center text-sm font-bold uppercase tracking-widest">
            <div className="flex items-center gap-4">
              <button 
                onClick={handleLeave}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-100 bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-[10px] font-bold"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                LEAVE INTERVIEW
              </button>
              <span className="text-slate-400">Question {currentIdx + 1} of {location.state?.totalQuestions || Math.max(questions.length, 1)}</span>
            </div>
            
            <div className="flex items-center gap-6">
              {/* Timer Display */}
              {!loading && (
                <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border-2 transition-colors ${timeLeft < 15 ? 'bg-red-50 border-red-200 text-red-500 animate-pulse' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   <span className="tabular-nums">{formatTime(timeLeft)}</span>
                </div>
              )}
              
              <span className="text-[#0ea5e9] flex items-center gap-2">
                   <span className="w-2.5 h-2.5 rounded-full bg-[#0ea5e9] animate-pulse inline-block"></span> Recording
              </span>
            </div>
          </div>

          <div className="flex-1">
            <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div key="loader" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="space-y-4">
                     <div className="h-6 bg-slate-200 rounded w-1/4 animate-pulse"></div>
                     <div className="h-8 bg-slate-200 rounded w-3/4 animate-pulse"></div>
                     <div className="h-40 mt-10 bg-white border border-slate-200 rounded-2xl animate-pulse shadow-sm"></div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key={currentIdx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col h-full"
                  >
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-relaxed mb-10 max-w-3xl text-slate-800">
                      {questions[currentIdx]}
                    </h2>

                    <textarea
                      value={answer}
                      onChange={e => setAnswer(e.target.value)}
                      placeholder="Start typing your answer here..."
                      className="w-full flex-1 min-h-[300px] p-8 text-lg bg-white border border-slate-200 rounded-2xl outline-none focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 transition-all resize-none shadow-sm text-slate-800 font-medium"
                      autoFocus
                    />
                  </motion.div>
                )}
            </AnimatePresence>
          </div>

          <div className="mt-8 flex justify-end">
             <button
               onClick={handleNext}
               disabled={loading || answer.length < 5}
               className="bg-[#111] text-white px-10 py-5 rounded-2xl text-lg font-bold hover:bg-black transition-all disabled:opacity-50 shadow-md"
             >
               {currentIdx === (location.state?.totalQuestions || 1) - 1 ? 'Finish Interview' : 'Next Question'}
             </button>
          </div>
      </div>
    </div>
  );
}

