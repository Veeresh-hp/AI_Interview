import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

export default function InterviewSetup() {
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState('');
  const [mode, setMode] = useState('Resume + JD');
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionsCount, setQuestionsCount] = useState(3);
  const [isUploading, setIsUploading] = useState(false);
  
  const navigate = useNavigate();

  const API = 'http://localhost:8000';

  const handleStart = async () => {
    setIsUploading(true);

    try {
      // 1. Prepare FormData
      const formData = new FormData();
      const backendMode = mode === 'Resume Only' ? 'resume' : mode === 'JD Only' ? 'jd' : 'both';
      formData.append('mode', backendMode);
      formData.append('difficulty', difficulty.toLowerCase());
      formData.append('max_questions', questionsCount);
      
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
    <div className="h-screen flex overflow-hidden text-slate-900 bg-[#fafafa]">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <div className="w-full px-8 md:px-12 lg:px-16 pb-16 max-w-7xl mx-auto">
          <div className="h-24 flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Configure Interview</h1>
            
            <div className="flex items-center gap-4 bg-white p-2 px-4 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">No. of Questions:</span>
                <select 
                  value={questionsCount}
                  onChange={(e) => setQuestionsCount(parseInt(e.target.value))}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-sm font-bold outline-none focus:border-[#0ea5e9]"
                >
                  {[3,4,5,6,7,8,9,10].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
            </div>
          </div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <section className="p-6 bg-white border border-slate-200 shadow-sm rounded-2xl">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><span className="bg-[#e0f2fe] text-[#0284c7] w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs">1</span> Interview Mode</h2>
                <div className="flex gap-2">
                    {['Resume', 'JD', 'Both'].map(m => {
                      const label = m === 'Both' ? 'Resume + JD' : m + ' Only';
                      return (
                        <button 
                          key={m} 
                          onClick={() => setMode(label)}
                          className={`flex-1 py-3 rounded-xl border-2 transition-all font-bold text-xs ${mode === label ? 'border-[#0ea5e9] bg-[#f0f9ff] text-[#0284c7]' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                        >
                          {m}
                        </button>
                      )
                    })}
                </div>
              </section>

              <section className="p-6 bg-white border border-slate-200 shadow-sm rounded-2xl">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><span className="bg-[#e0f2fe] text-[#0284c7] w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs">2</span> Select Difficulty</h2>
                <div className="flex gap-2">
                    {['Easy', 'Medium', 'Hard'].map(d => (
                      <button 
                        key={d} 
                        onClick={() => setDifficulty(d)}
                        className={`flex-1 py-3 rounded-xl border-2 transition-all font-bold text-xs ${difficulty === d ? 'border-[#0ea5e9] bg-[#f0f9ff] text-[#0284c7]' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                      >
                        {d}
                      </button>
                    ))}
                </div>
              </section>
            </div>

            <section className="grid md:grid-cols-2 gap-6">
              <div className={`p-6 bg-white border border-slate-200 shadow-sm rounded-2xl transition-all duration-300 ${mode.includes('Resume') ? 'opacity-100 transform-none' : 'opacity-40 scale-95 pointer-events-none'}`}>
                <h2 className="text-lg font-bold mb-4">Upload Resume (PDF)</h2>
                <label className="border-2 border-dashed border-slate-200 bg-slate-50 rounded-xl flex flex-col items-center justify-center p-8 cursor-pointer hover:border-[#0ea5e9] transition-colors group">
                  <input type="file" className="hidden" accept=".pdf,.txt" onChange={(e) => setFile(e.target.files[0])} />
                  <div className="w-12 h-12 bg-white shadow-sm rounded-full flex items-center justify-center mb-3 group-hover:bg-[#e0f2fe] transition-colors">📄</div>
                  {file ? <span className="text-xs font-semibold text-[#0ea5e9] max-w-full truncate">{file.name}</span> : <span className="text-xs text-slate-400 font-semibold text-center italic">Click to upload <br/> Resume PDF</span>}
                </label>
              </div>

              <div className={`p-6 bg-white border border-slate-200 shadow-sm rounded-2xl transition-all duration-300 ${mode.includes('JD') ? 'opacity-100 transform-none' : 'opacity-40 scale-95 pointer-events-none'}`}>
                <h2 className="text-lg font-bold mb-4">Job Description</h2>
                <textarea 
                  value={jd} 
                  onChange={(e) => setJd(e.target.value)}
                  className="w-full h-36 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9] transition-all p-4 resize-none text-[13px] placeholder:text-slate-400"
                  placeholder="Paste the target job description here..." 
                />
              </div>
            </section>

            <div className="pt-2">
                <button 
                  disabled={!isReady || isUploading}
                  onClick={handleStart}
                  className="w-full py-4 text-center bg-[#111] text-white text-lg font-bold rounded-2xl hover:bg-black transition-all disabled:opacity-50 disabled:hover:bg-[#111] shadow-lg flex items-center justify-center gap-3"
                >
                  {isUploading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Processing...
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

