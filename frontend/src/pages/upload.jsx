import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = 'http://localhost:8000'
// base URL of FastAPI backend — change this in production

// helper function — returns color based on difficulty
// used for button highlight and border color
function difficultyColor(d) {
  return { easy: '#22c55e', medium: '#f59e0b', hard: '#ef4444' }[d]
  // easy = green, medium = amber, hard = red
  // [d] picks the color for the given difficulty string
}

export default function Upload() {

  // ── state variables ────────────────────────────────────────────────────────

  const [mode, setMode] = useState('both')
  // mode: "resume", "jd", or "both" — controls which files are required

  const [difficulty, setDifficulty] = useState('medium')
  // difficulty: "easy", "medium", or "hard"
  // controls question count, time limit, and question style

  const [resume, setResume] = useState(null)
  // resume: the selected PDF File object (null until user picks a file)

  const [jd, setJd] = useState(null)
  // jd: the selected JD text File object

  const [loading, setLoading] = useState(false)
  // loading: true while waiting for backend — disables button, shows spinner

  const [error, setError] = useState('')
  // error: stores error message to show to user

  const navigate = useNavigate()
  // navigate('/interview') will redirect user to interview page

  // ── handle form submission ─────────────────────────────────────────────────
  async function handleStart() {
    setError('')      // clear any previous error message
    setLoading(true)  // show loading state on button

    // FormData is used for file uploads — can't use regular JSON for files
    const formData = new FormData()
    formData.append('mode', mode)             // add mode field ("resume"/"jd"/"both")
    formData.append('difficulty', difficulty) // add difficulty field — backend needs this

    if (resume) formData.append('resume', resume) // only add if file was selected
    if (jd) formData.append('jd', jd)             // only add if file was selected

    try {
      // Step 1 — upload files to backend, get session_id back
      const uploadRes = await axios.post(`${API}/upload`, formData)
      const sessionId = uploadRes.data.session_id
      // session_id is a unique ID for this interview session
      // we pass it to every subsequent API call

      // Step 2 — start interview, passing difficulty as query param
      // backend uses difficulty to decide question count + time limit
      const startRes = await axios.post(
        `${API}/start?session_id=${sessionId}&difficulty=${difficulty}`
      )

      const firstQuestion = startRes.data.question
      // first question to show immediately on interview page

      const totalQuestions = startRes.data.total_questions
      // total count: easy=5, medium=7, hard=10
      // used to show "Q1 of 5" progress indicator

      const timeLimit = startRes.data.time_limit
      // time limit per question in seconds: easy=120, medium=90, hard=60
      // passed to Interview page so the timer knows how long to count

      // Step 3 — navigate to interview page with all data
      // we pass data via router state so Interview page can access it
      // without making another API call
      navigate('/interview', {
        state: {
          sessionId,      // needed to submit answers and get report
          firstQuestion,  // show Q1 immediately without extra API call
          totalQuestions, // for progress bar "Q1 of 7"
          difficulty,     // passed for reference (not used directly in Interview)
          timeLimit       // countdown timer starting value
        }
      })

    } catch (err) {
      // show error from backend, or generic message if no detail available
      setError(err.response?.data?.detail || 'Something went wrong. Try again.')
    } finally {
      setLoading(false) // always turn off loading, even if there was an error
    }
  }

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* title */}
        <h1 style={styles.title}>AI Interviewer</h1>
        <p style={styles.subtitle}>Upload your documents and start your interview</p>

        {/* ── mode selector ── */}
        <div style={styles.section}>
          <label style={styles.label}>Interview Mode</label>
          <div style={styles.modeRow}>

            {/* render one button per mode */}
            {['resume', 'jd', 'both'].map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                // clicking sets this mode as active
                style={{
                  ...styles.modeBtn,
                  // highlight the selected mode with blue
                  background: mode === m ? '#3b82f6' : '#1e293b',
                  color: mode === m ? '#fff' : '#94a3b8',
                  border: mode === m ? '1px solid #3b82f6' : '1px solid #334155'
                }}
              >
                {m === 'resume' && 'Resume Only'}
                {m === 'jd' && 'JD Only'}
                {m === 'both' && 'Resume + JD'}
              </button>
            ))}
          </div>

          {/* hint text explaining what each mode does */}
          <p style={styles.modeHint}>
            {mode === 'resume' && 'Questions based on your projects and experience'}
            {mode === 'jd' && 'Questions based on job requirements only'}
            {mode === 'both' && 'Questions tailored to match your profile with the role'}
          </p>
        </div>

        {/* ── difficulty selector ── */}
        <div style={styles.section}>
          <label style={styles.label}>Difficulty Level</label>
          <div style={styles.modeRow}>

            {/* render one button per difficulty level */}
            {['easy', 'medium', 'hard'].map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                // clicking sets this difficulty as active
                style={{
                  ...styles.modeBtn,
                  // each difficulty has its own color when selected
                  // difficultyColor(d) returns green/amber/red
                  background: difficulty === d ? difficultyColor(d) : '#1e293b',
                  color: difficulty === d ? '#fff' : '#94a3b8',
                  border: difficulty === d
                    ? `1px solid ${difficultyColor(d)}`
                    : '1px solid #334155'
                }}
              >
                {/* capitalize first letter: "easy" → "Easy" */}
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>

          {/* hint text explaining what each difficulty means */}
          <p style={styles.modeHint}>
            {difficulty === 'easy' &&
              '10 questions · includes intro · 2 min per question'}
            {difficulty === 'medium' &&
              '10 questions · includes intro · 1.5 min per question'}
            {difficulty === 'hard' &&
              '10 questions · no intro · 1 min per question'}
          </p>
        </div>

        {/* ── resume upload — only show if mode needs it ── */}
        {(mode === 'resume' || mode === 'both') && (
          <div style={styles.section}>
            <label style={styles.label}>Resume (PDF)</label>
            <input
              type="file"
              accept=".pdf"
              // accept=".pdf" restricts file picker to PDF files only
              onChange={e => setResume(e.target.files[0])}
              // e.target.files[0] is the first (only) selected file
              style={styles.fileInput}
            />
            {/* show filename after file is selected */}
            {resume && <p style={styles.fileName}>{resume.name}</p>}
          </div>
        )}

        {/* ── JD upload — only show if mode needs it ── */}
        {(mode === 'jd' || mode === 'both') && (
          <div style={styles.section}>
            <label style={styles.label}>Job Description (.txt)</label>
            <input
              type="file"
              accept=".txt"
              // accept=".txt" restricts file picker to text files only
              onChange={e => setJd(e.target.files[0])}
              style={styles.fileInput}
            />
            {/* show filename after file is selected */}
            {jd && <p style={styles.fileName}>{jd.name}</p>}
          </div>
        )}

        {/* error message — only shown when error state is not empty */}
        {error && <p style={styles.error}>{error}</p>}

        {/* start button — disabled while loading to prevent double submit */}
        <button
          onClick={handleStart}
          disabled={loading}
          style={{ ...styles.startBtn, opacity: loading ? 0.6 : 1 }}
          // opacity 0.6 gives visual feedback that button is disabled
        >
          {loading ? 'Preparing Interview...' : 'Start Interview'}
          {/* text changes while loading so user knows something is happening */}
        </button>

      </div>
    </div>
  )
}

// ── styles ─────────────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: '100vh',
    background: '#0f172a',      // dark navy background
    display: 'flex',
    alignItems: 'center',       // vertically center the card
    justifyContent: 'center',   // horizontally center the card
    fontFamily: 'sans-serif',
    padding: '20px'             // padding so card doesn't touch screen edges on mobile
  },
  card: {
    background: '#1e293b',      // slightly lighter than page background
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '480px',          // card never gets too wide on large screens
    boxShadow: '0 25px 50px rgba(0,0,0,0.5)'  // deep shadow for depth
  },
  title: {
    color: '#f1f5f9',
    fontSize: '28px',
    fontWeight: '700',
    margin: '0 0 8px 0',
    textAlign: 'center'
  },
  subtitle: {
    color: '#64748b',
    textAlign: 'center',
    marginBottom: '32px',
    fontSize: '14px'
  },
  section: { marginBottom: '24px' },  // consistent spacing between sections
  label: {
    display: 'block',           // block so it takes full width above input
    color: '#94a3b8',
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '8px',
    textTransform: 'uppercase', // ALL CAPS label style
    letterSpacing: '0.05em'     // slight spacing between letters
  },
  modeRow: {
    display: 'flex',
    gap: '8px'                  // space between mode/difficulty buttons
  },
  modeBtn: {
    flex: 1,                    // each button takes equal width
    padding: '10px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'all 0.2s'     // smooth color transition on click
  },
  modeHint: {
    color: '#475569',
    fontSize: '12px',
    marginTop: '8px'
  },
  fileInput: {
    width: '100%',
    padding: '10px',
    background: '#0f172a',
    border: '1px dashed #334155',   // dashed border = upload area convention
    borderRadius: '8px',
    color: '#94a3b8',
    cursor: 'pointer',
    fontSize: '13px',
    boxSizing: 'border-box'         // padding included in width calculation
  },
  fileName: {
    color: '#3b82f6',       // blue — matches the brand color
    fontSize: '12px',
    marginTop: '6px'
  },
  error: {
    color: '#f87171',
    fontSize: '13px',
    marginBottom: '16px',
    padding: '10px',
    background: '#450a0a',  // dark red background for error box
    borderRadius: '8px'
  },
  startBtn: {
    width: '100%',
    padding: '14px',
    background: '#3b82f6',  // blue — primary action color
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer'
  }
}