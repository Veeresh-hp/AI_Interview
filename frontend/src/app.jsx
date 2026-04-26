import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ResumeProvider } from './context/ResumeContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Landing from './pages/Landing';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import ResumeBuilder from './pages/ResumeBuilder';
import InterviewSetup from './pages/InterviewSetup';
import InterviewExperience from './pages/InterviewExperience';
import InterviewResults from './pages/InterviewResults';
import Pricing from './pages/Pricing';
import Profile from './pages/Profile';
import History from './pages/History';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ResumeProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/history" element={<History />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/resume-builder" element={<ResumeBuilder />} />
              <Route path="/interview" element={<InterviewSetup />} />
              <Route path="/interview/start" element={<InterviewExperience />} />
              <Route path="/interview/results/:sessionId" element={<InterviewResults />} />
              <Route path="/interview/results" element={<InterviewResults />} />
            </Routes>
            <ToastContainer position="bottom-right" theme="colored" />
          </BrowserRouter>
        </ResumeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}