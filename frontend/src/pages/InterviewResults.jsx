import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import { Download } from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer 
} from 'recharts';

export default function InterviewResults() {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState(null);
  const [chat, setChat] = useState([]);
  const [userQuery, setUserQuery] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const API = '/api';

  const handleCoachQuery = async (e) => {
    e.preventDefault();
    if (!userQuery.trim() || chatLoading) return;

    const { sessionId } = location.state || {};
    const newUserMsg = { role: 'user', content: userQuery };
    setChat(prev => [...prev, newUserMsg]);
    setUserQuery('');
    setChatLoading(true);

    try {
      const res = await axios.post(`${API}/coach?session_id=${sessionId}&query=${encodeURIComponent(userQuery)}`);
      setChat(prev => [...prev, { role: 'coach', content: res.data.response }]);
    } catch (error) {
      console.error("Coach Error:", error);
      setChat(prev => [...prev, { role: 'coach', content: "Sorry, I'm having trouble connecting. Please try again." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const downloadPDF = () => {
    const element = document.getElementById('report-content');
    const opt = {
      margin:       10,
      filename:     `Interview_Report_${new Date().toLocaleDateString()}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Temporarily hide buttons for the PDF
    const buttons = document.getElementById('action-buttons');
    if (buttons) buttons.style.display = 'none';

    html2pdf().set(opt).from(element).save().then(() => {
      if (buttons) buttons.style.display = 'flex';
    });
  };

  useEffect(() => {
    const { sessionId } = location.state || {};

    const fetchResult = async () => {
      try {
        if (sessionId) {
          const res = await axios.get(`${API}/report?session_id=${sessionId}`);
          const data = res.data;
          
          // Format skills data for Recharts
          const chartData = data.skills ? Object.keys(data.skills).map(key => ({
            subject: key,
            A: data.skills[key],
            fullMark: 100,
          })) : [];

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
            verdict: data.verdict,
            chartData: chartData
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
          <motion.div 
            initial={{ y: 30, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            id="report-content" 
            className="w-full max-w-4xl space-y-8 pb-32 pt-10 px-2 md:px-0"
          >
            <div className="text-center mb-8 md:mb-12">
               <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight px-2">Interview Results</h1>
               <p className="text-slate-500 dark:text-[#B0B0B0] text-sm md:text-lg font-medium px-4">Detailed feedback mapped to your performance.</p>
            </div>

            <div className="bg-card border border-slate-200 dark:border-[#444444] shadow-md p-6 md:p-10 rounded-3xl flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-8 relative overflow-hidden mx-2">
                <div className="relative z-10 text-foreground">
                   <h2 className="text-[10px] md:text-sm font-bold text-[#0ea5e9] uppercase tracking-widest mb-1 md:mb-2">Overall Score</h2>
                   <div className="text-5xl md:text-7xl font-extrabold font-serif tracking-tight">{results.totalScore}<span className="text-2xl md:text-3xl text-slate-400 dark:text-[#888888]">/100</span></div>
                </div>
                <div className="flex-1 max-w-lg relative z-10 text-foreground">
                   <p className="text-base md:text-lg leading-relaxed font-semibold italic opacity-90">"{results.generalFeedback}"</p>
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none hidden md:block">
                  <svg className="w-32 h-32 text-[#0ea5e9]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                </div>
            </div>

            {/* Performance Analysis: Radar Chart & Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start px-2">
               {/* Left: Radar Chart (3/5 width on desktop, full on mobile) */}
               <div className="md:col-span-3 p-4 md:p-8 bg-card border border-slate-200 dark:border-[#444444] rounded-3xl shadow-sm flex flex-col items-center justify-center min-h-[350px] md:min-h-[450px]">
                  <h3 className="text-sm md:text-lg font-bold mb-6 text-center uppercase tracking-widest text-muted-foreground">Skills Analysis</h3>
                  <div className="w-full h-[250px] md:h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={results.chartData}>
                        <PolarGrid stroke="#444" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 10, fontWeight: 'bold' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar
                          name="Skills"
                          dataKey="A"
                          stroke="#0ea5e9"
                          fill="#0ea5e9"
                          fillOpacity={0.4}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
               </div>

               {/* Right: Strengths & Weaknesses (2/5 width) */}
               <div className="md:col-span-2 space-y-6">
                  <div className="p-6 bg-card border border-slate-200 dark:border-[#444444] rounded-2xl shadow-sm relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">🏆</div>
                     <h4 className="text-emerald-500 font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                        Key Strengths
                     </h4>
                     <ul className="space-y-4">
                        {results.pros?.map((pro, i) => (
                           <li key={i} className="flex items-start gap-3 text-sm font-bold text-foreground/90 leading-tight">
                              <span className="text-emerald-500 mt-0.5">✦</span> {pro}
                           </li>
                        ))}
                     </ul>
                  </div>

                  <div className="p-6 bg-card border border-slate-200 dark:border-[#444444] rounded-2xl shadow-sm relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">💡</div>
                     <h4 className="text-red-500 font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                        Areas for Growth
                     </h4>
                     <ul className="space-y-4">
                        {results.cons?.map((con, i) => (
                           <li key={i} className="flex items-start gap-3 text-sm font-bold text-foreground/90 leading-tight">
                              <span className="text-red-500 mt-0.5">○</span> {con}
                           </li>
                        ))}
                     </ul>
                  </div>
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

            {/* AI Coach Chat Section */}
            <div className="mt-16 bg-[#f8fafc] dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#333] rounded-3xl p-8 shadow-inner">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-[#0ea5e9] rounded-2xl flex items-center justify-center text-white text-xl shadow-lg">👨‍🏫</div>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight">Ask the AI Interview Coach</h3>
                    <p className="text-sm text-slate-500 font-medium italic">"How can I improve? Ask me anything about your performance."</p>
                  </div>
               </div>

               <div className="space-y-4 max-h-[400px] overflow-y-auto mb-6 pr-4 custom-scrollbar">
                  {chat.length === 0 && (
                    <div className="text-center py-10 opacity-40">
                      <p className="text-sm font-bold uppercase tracking-widest">No messages yet. Start the coaching session below!</p>
                    </div>
                  )}
                  {chat.map((msg, i) => (
                    <motion.div 
                      initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={i} 
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] p-4 rounded-2xl font-medium text-sm leading-relaxed shadow-sm ${
                        msg.role === 'user' 
                          ? 'bg-[#0ea5e9] text-white rounded-tr-none' 
                          : 'bg-card border border-slate-200 dark:border-[#444444] text-foreground rounded-tl-none'
                      }`}>
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-card border border-slate-200 dark:border-[#444444] p-4 rounded-2xl rounded-tl-none flex gap-1">
                        <span className="w-1.5 h-1.5 bg-[#0ea5e9] rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-[#0ea5e9] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-1.5 h-1.5 bg-[#0ea5e9] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                      </div>
                    </div>
                  )}
               </div>

               <form onSubmit={handleCoachQuery} className="relative">
                  <input
                    type="text"
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    placeholder="Ask a follow-up question (e.g., 'Give me a better answer for Q1')"
                    className="w-full bg-white dark:bg-[#111] border border-slate-200 dark:border-[#444] rounded-2xl p-5 pr-32 outline-none focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/10 transition-all font-semibold text-sm shadow-sm"
                  />
                  <button 
                    type="submit"
                    disabled={chatLoading || !userQuery.trim()}
                    className="absolute right-2 top-2 bottom-2 px-6 bg-[#111] dark:bg-slate-100 dark:text-slate-950 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    Ask Coach
                  </button>
               </form>
            </div>

            <div id="action-buttons" className="mt-12 flex justify-center gap-4">
              <button onClick={downloadPDF} className="px-8 py-4 bg-[#0ea5e9] text-white font-bold rounded-2xl hover:bg-[#0284c7] transition-all shadow-lg flex items-center gap-2">
                 <Download size={20} /> Download Report
              </button>
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
