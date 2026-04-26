import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Mic, MicOff, Volume2 } from 'lucide-react';

export default function InterviewExperience() {
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answer, setAnswer] = useState('');
  const [voiceAnswer, setVoiceAnswer] = useState(''); 
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(90);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const API = '/api';

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event) => {
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        
        // Append to voice answer HIDDENLY
        setVoiceAnswer(prev => prev + (prev ? ' ' : '') + finalTranscript);
      };

      rec.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      setRecognition(rec);
    }
  }, []);

  const toggleListening = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in this browser. Please try Chrome or Edge.");
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const speakQuestion = (text) => {
    if (!window.speechSynthesis) return;

    // Stop any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to find a female voice
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(v => 
        (v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Google US English') || v.name.includes('Samantha')) && 
        v.lang.startsWith('en')
    ) || voices.find(v => v.lang.startsWith('en'));

    if (femaleVoice) utterance.voice = femaleVoice;
    
    utterance.rate = 0.95; // Slightly slower for clarity
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

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
    // Stop listening and speaking when moving to next question
    if (recognition) recognition.stop();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsListening(false);
    setIsSpeaking(false);
    
    setLoading(true);
    const { sessionId } = location.state || {};

    try {
      // 1. Submit answer (combined manual + voice) and get next step
      const combinedAnswer = (answer.trim() + " " + voiceAnswer.trim()).trim();
      
      const res = await axios.post(`${API}/answer`, {
        session_id: sessionId,
        answer: combinedAnswer
      });

      if (res.data.status === 'completed') {
        // 2. If finished, go to results
        navigate(`/interview/results/${sessionId}`, { 
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
        setVoiceAnswer(''); // Reset hidden voice answer
        setTimeLeft(location.state?.timeLimit || 90);
      }
    } catch (error) {
      console.error("Submit Answer Error:", error);
      alert(`Failed to submit answer: ${error.response?.data?.detail || error.message}`);
    } finally {
      setLoading(false);
    }
  }, [answer, location.state, navigate, recognition, voiceAnswer]);
  
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
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (recognition) recognition.stop();
      navigate('/dashboard');
    }
  };

  // Final cleanup on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (recognition) recognition.stop();
    };
  }, [recognition]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 flex flex-col pt-16 md:pt-20 overflow-hidden transition-colors">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col relative z-20">
          <div className="mb-6 md:mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-sm font-bold uppercase tracking-widest">
            <div className="flex items-center justify-between w-full md:w-auto gap-4">
              <button 
                onClick={handleLeave}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 transition-colors text-[10px] font-bold"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                LEAVE
              </button>
              <span className="text-slate-400 dark:text-slate-500 font-bold text-[10px] md:text-xs">Q {currentIdx + 1} of {location.state?.totalQuestions || Math.max(questions.length, 1)}</span>
            </div>
            
            <div className="flex items-center justify-between w-full md:w-auto gap-6">
              {/* Timer Display */}
              {!loading && (
                <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border-2 transition-colors ${timeLeft < 15 ? 'bg-red-50 dark:bg-[#2a2a2a] border-red-200 dark:border-[#444444] text-red-500 animate-pulse' : 'bg-background-alt border-slate-100 dark:border-[#444444] text-muted-foreground'}`}>
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   <span className="tabular-nums text-xs md:text-sm">{formatTime(timeLeft)}</span>
                </div>
              )}
              
              <span className="text-[#0ea5e9] flex items-center gap-2 font-bold text-[10px] md:text-xs">
                   <span className="w-2 h-2 rounded-full bg-[#0ea5e9] animate-pulse inline-block"></span> Recording
              </span>
            </div>
          </div>

          <div className="flex-1">
            <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div key="loader" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="space-y-4">
                     <div className="h-6 bg-slate-200 dark:bg-[#2a2a2a] rounded w-1/4 animate-pulse"></div>
                     <div className="h-8 bg-slate-200 dark:bg-[#2a2a2a] rounded w-3/4 animate-pulse"></div>
                     <div className="h-40 mt-10 bg-card border border-slate-200 dark:border-[#444444] rounded-2xl animate-pulse shadow-sm"></div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key={currentIdx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onAnimationComplete={() => speakQuestion(questions[currentIdx])}
                    className="flex flex-col h-full text-foreground"
                  >
                    <div className="flex items-start gap-6 mb-10">
                      <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-relaxed flex-1">
                        {questions[currentIdx]}
                      </h2>
                      
                      <button 
                        onClick={() => speakQuestion(questions[currentIdx])}
                        className={`mt-2 p-4 rounded-2xl border transition-all shadow-sm ${
                          isSpeaking 
                            ? 'bg-[#0ea5e9]/10 border-[#0ea5e9] text-[#0ea5e9] shadow-[0_0_15px_rgba(14,165,233,0.2)]' 
                            : 'bg-card border-slate-200 dark:border-[#444444] text-slate-400 hover:text-[#0ea5e9] hover:border-[#0ea5e9] hover:bg-slate-50 dark:hover:bg-[#2a2a2a]'
                        }`}
                        title="Read Question Aloud"
                      >
                        <Volume2 size={24} className={isSpeaking ? 'animate-bounce' : ''} />
                      </button>
                    </div>

                    <div className="relative flex-1 flex flex-col">
                      <textarea
                        value={answer}
                        onChange={e => setAnswer(e.target.value)}
                        placeholder="Type your answer here, or use the floating mic below to speak naturally..."
                        className="w-full flex-1 min-h-[300px] p-8 text-lg bg-card border border-slate-200 dark:border-[#444444] rounded-2xl outline-none focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 transition-all resize-none shadow-sm text-foreground font-medium"
                        autoFocus
                      />
                    </div>
                  </motion.div>
                )}
            </AnimatePresence>
          </div>

          <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0 relative min-h-[140px] md:h-32 pb-10 md:pb-0">
             <div className="flex-1 flex justify-center w-full order-1 md:order-none">
                {/* Modern Floating Mic Assistant */}
                <div className="relative">
                  <AnimatePresence>
                    {isListening && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1.2, opacity: 0.5 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="absolute inset-0 rounded-full bg-[#0ea5e9] blur-xl"
                        transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
                      />
                    )}
                  </AnimatePresence>

                  <button
                    onClick={toggleListening}
                    className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${
                      isListening 
                        ? 'bg-[#0ea5e9] text-white scale-110 rotate-0' 
                        : 'bg-card border-4 border-slate-100 dark:border-[#333] text-slate-400 hover:text-[#0ea5e9] hover:border-[#0ea5e9] hover:scale-105'
                    }`}
                  >
                    {isListening ? (
                      <div className="flex items-center gap-1">
                        <motion.div animate={{ height: [10, 25, 10] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-white rounded-full" />
                        <motion.div animate={{ height: [15, 35, 15] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1 bg-white rounded-full" />
                        <motion.div animate={{ height: [10, 25, 10] }} transition={{ repeat: Infinity, duration: 0.4 }} className="w-1 bg-white rounded-full" />
                        <Mic size={28} className="mx-1" />
                        <motion.div animate={{ height: [10, 25, 10] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }} className="w-1 bg-white rounded-full" />
                        <motion.div animate={{ height: [15, 35, 15] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1 bg-white rounded-full" />
                        <motion.div animate={{ height: [10, 25, 10] }} transition={{ repeat: Infinity, duration: 0.4, delay: 0.1 }} className="w-1 bg-white rounded-full" />
                      </div>
                    ) : (
                      <div className="relative">
                        <MicOff size={28} />
                        <span className="absolute -top-4 -right-4 bg-slate-100 dark:bg-slate-800 text-[8px] px-1.5 py-0.5 rounded-md font-black border border-slate-200 dark:border-slate-700">EN</span>
                      </div>
                    )}
                  </button>
                  
                  {isListening && (
                    <motion.span 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#0ea5e9] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg"
                    >
                      AI is listening...
                    </motion.span>
                  )}
                </div>
             </div>

             <button
               onClick={handleNext}
               disabled={loading || (answer.length < 5 && voiceAnswer.length < 5)}
               className="w-full md:w-auto bg-[#111] dark:bg-slate-100 dark:text-slate-950 text-white px-10 py-5 rounded-2xl text-base md:text-lg font-bold hover:bg-black dark:hover:bg-white transition-all disabled:opacity-50 shadow-md relative z-20 order-2 md:order-none"
             >
               {currentIdx === (location.state?.totalQuestions || 1) - 1 ? 'Finish Interview' : 'Next Question'}
             </button>
          </div>
      </div>
    </div>
  );
}

