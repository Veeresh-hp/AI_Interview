import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/Sidebar';

// Static loading messages moved outside to satisfy linting and optimize performance
const loadingMessages = [
  "Analyzing your resume...",
  "Parsing job requirements...",
  "Generating interview questions...",
  "Setting up AI environment...",
  "Calibrating difficulty level...",
  "Optimizing experience...",
  "Almost ready..."
];

export default function InterviewSetup() {
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState('');
  const [mode, setMode] = useState('Resume + JD');
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionsCount, setQuestionsCount] = useState(3);
  const [isUploading, setIsUploading] = useState(false);
  const [loadingText, setLoadingText] = useState('Processing...');
  
  useEffect(() => {
    let interval;
    if (isUploading) {
      let index = 0;
      setLoadingText(loadingMessages[0]);
      interval = setInterval(() => {
        index = (index + 1) % loadingMessages.length;
        setLoadingText(loadingMessages[index]);
      }, 1500); // Change every 1.5 seconds for readability
    }
    return () => clearInterval(interval);
  }, [isUploading]); // Removed loadingMessages as it is static and would cause unnecessary re-renders

  const { user } = useAuth();
  const navigate = useNavigate();
  const API = '/api';

  const handleStart = async () => {
    setIsUploading(true);

    try {
      // 1. Prepare FormData
      const formData = new FormData();
      const backendMode = mode === 'Resume Only' ? 'resume' : mode === 'JD Only' ? 'jd' : 'both';
      formData.append('mode', backendMode);
      formData.append('difficulty', difficulty.toLowerCase());
      formData.append('max_questions', questionsCount);
      if (user?.email) formData.append('userEmail', user.email);
      
      if (file) formData.append('resume', file);
      if (jd) {
        // Create a temporary blob if it's text, or if it's already a file object
        if (typeof jd === 'string') {
          const blob = new Blob([jd], { type: 'text/plain' });
          formData.append('jd', blob, 'jd.txt');
        } else {
          formData.append('jd', jd);
        }
      }

      // 2. Upload and Ingest
      const uploadRes = await axios.post(`${API}/upload`, formData);
      const sessionId = uploadRes.data.session_id;

      // 3. Start Interview
      const startRes = await axios.post(`${API}/start?session_id=${sessionId}&difficulty=${difficulty.toLowerCase()}`);
      
      const { question, total_questions, time_limit } = startRes.data;

      // 4. Navigate to Experience page with all data
      navigate('/interview/start', { 
        state: { 
          sessionId,
          firstQuestion: question,
          totalQuestions: total_questions,
          timeLimit: time_limit,
          mode, 
          difficulty
        } 
      });
    } catch (error) {
      console.error("Setup Error:", error);
      alert(`Failed to process interview setup: ${error.response?.data?.detail || error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const isReady = (mode === 'Resume Only' && file) || 
                  (mode === 'JD Only' && jd) || 
                  (mode === 'Resume + JD' && file && jd);

  return (
    <div className="h-screen flex overflow-hidden text-foreground bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <div className="w-full px-8 md:px-12 lg:px-16 pb-16 max-w-7xl mx-auto">
          <div className="h-24 flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Configure Interview</h1>
            
            <div className="flex items-center gap-4 bg-card p-2 px-4 rounded-2xl border border-slate-200 dark:border-[#444444] shadow-sm">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">No. of Questions:</span>
                <select 
                  value={questionsCount}
                  onChange={(e) => setQuestionsCount(parseInt(e.target.value))}
                  className="bg-background-alt border border-slate-200 dark:border-[#444444] rounded-lg px-2 py-1 text-sm font-bold outline-none focus:border-[#0ea5e9] text-foreground"
                >
                  {[3,4,5,6,7,8,9,10].map(n => (
                    <option key={n} value={n} className="bg-card">{n}</option>
                  ))}
                </select>
            </div>
          </div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <section className="p-6 bg-card border border-slate-200 dark:border-zinc-800 shadow-sm rounded-2xl">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><span className="bg-[#e0f2fe] dark:bg-slate-800 text-[#0284c7] w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs">1</span> Interview Mode</h2>
                <div className="flex gap-2">
                    {['Resume', 'JD', 'Both'].map(m => {
                      const label = m === 'Both' ? 'Resume + JD' : m + ' Only';
                      return (
                        <button 
                          key={m} 
                          onClick={() => setMode(label)}
                          className={`flex-1 py-3 rounded-xl border-2 transition-all font-bold text-xs ${mode === label ? 'border-[#0ea5e9] bg-[var(--active-pill-bg)] text-[var(--active-pill-text)]' : 'border-slate-100 dark:border-[#444444] text-muted-foreground hover:border-slate-200 dark:hover:border-[#555555]'}`}
                        >
                          {m}
                        </button>
                      )
                    })}
                </div>
              </section>

              <section className="p-6 bg-card border border-slate-200 dark:border-zinc-800 shadow-sm rounded-2xl">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><span className="bg-[#e0f2fe] dark:bg-slate-800 text-[#0284c7] w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs">2</span> Select Difficulty</h2>
                <div className="flex gap-2">
                    {['Easy', 'Medium', 'Hard'].map(d => (
                      <button 
                        key={d} 
                        onClick={() => setDifficulty(d)}
                        className={`flex-1 py-3 rounded-xl border-2 transition-all font-bold text-xs ${difficulty === d ? 'border-[#0ea5e9] bg-[var(--active-pill-bg)] text-[var(--active-pill-text)]' : 'border-slate-100 dark:border-[#444444] text-muted-foreground hover:border-slate-200 dark:hover:border-[#555555]'}`}
                      >
                        {d}
                      </button>
                    ))}
                </div>
              </section>
            </div>

            <section className="grid md:grid-cols-2 gap-6">
              <div className={`p-6 bg-card border border-slate-200 dark:border-[#444444] shadow-sm rounded-2xl transition-all duration-300 ${mode.includes('Resume') ? 'opacity-100 transform-none' : 'opacity-40 scale-95 pointer-events-none'}`}>
                <h2 className="text-lg font-bold mb-4">Upload Resume (PDF)</h2>
                <label className="border-2 border-dashed border-slate-200 dark:border-slate-800 bg-background-alt rounded-xl flex flex-col items-center justify-center p-8 cursor-pointer hover:border-[#0ea5e9] transition-colors group">
                  <input type="file" className="hidden" accept=".pdf,.txt" onChange={(e) => setFile(e.target.files[0])} />
                  <div className="w-12 h-12 bg-card shadow-sm rounded-full flex items-center justify-center mb-3 group-hover:bg-[#e0f2fe] dark:group-hover:bg-slate-800 transition-colors">📄</div>
                  {file ? <span className="text-xs font-semibold text-[#0ea5e9] max-w-full truncate">{file.name}</span> : <span className="text-xs text-slate-400 font-semibold text-center italic">Click to upload <br/> Resume PDF</span>}
                </label>
              </div>

              <div className={`p-6 bg-card border border-slate-200 dark:border-[#444444] shadow-sm rounded-2xl transition-all duration-300 ${mode.includes('JD') ? 'opacity-100 transform-none' : 'opacity-40 scale-95 pointer-events-none'}`}>
                <h2 className="text-lg font-bold mb-4">Job Description</h2>
                <textarea 
                  value={jd} 
                  onChange={(e) => setJd(e.target.value)}
                  className="w-full h-36 bg-background-alt border border-slate-200 dark:border-[#444444] rounded-xl outline-none focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9] transition-all p-4 resize-none text-[13px] placeholder:text-slate-400 text-foreground"
                  placeholder="Paste the target job description here..." 
                />
              </div>
            </section>

            <div className="pt-2">
                <button 
                  disabled={!isReady || isUploading}
                  onClick={handleStart}
                  className="w-full py-4 text-center bg-[var(--primary)] text-[var(--primary-foreground)] text-lg font-bold rounded-2xl hover:opacity-90 transition-all disabled:opacity-50 shadow-lg flex items-center justify-center gap-3"
                >
                  {isUploading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      {loadingText}
                    </>
                  ) : 'Start AI Mock Interview'}
                </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

