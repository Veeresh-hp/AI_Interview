import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ResumeProvider } from './context/ResumeContext';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import ResumeBuilder from './pages/ResumeBuilder';
import InterviewSetup from './pages/InterviewSetup';
import InterviewExperience from './pages/InterviewExperience';
import InterviewResults from './pages/InterviewResults';
import Pricing from './pages/Pricing';
import Profile from './pages/Profile';
import History from './pages/History';

export default function App() {
  return (
    <ResumeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/history" element={<History />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/resume-builder" element={<ResumeBuilder />} />
          <Route path="/interview" element={<InterviewSetup />} />
          <Route path="/interview/start" element={<InterviewExperience />} />
          <Route path="/interview/results" element={<InterviewResults />} />
        </Routes>
      </BrowserRouter>
    </ResumeProvider>
  )
}