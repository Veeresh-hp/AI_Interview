import { BrowserRouter, Routes, Route } from 'react-router-dom'
// BrowserRouter — enables URL-based navigation
// Routes       — container for all route definitions
// Route        — maps a URL path to a component

import Upload from './pages/upload'
import Interview from './pages/interview'
import Report from './pages/report'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* / → Upload page (start here) */}
        <Route path="/" element={<Upload />} />

        {/* /interview → Interview page (after upload) */}
        <Route path="/interview" element={<Interview />} />

        {/* /report → Report page (after all questions answered) */}
        <Route path="/report" element={<Report />} />
      </Routes>
    </BrowserRouter>
  )
}