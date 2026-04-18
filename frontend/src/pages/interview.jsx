import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'

const API = 'http://localhost:8000'

export default function Interview() {
  const navigate = useNavigate()
  const location = useLocation()
  const { sessionId, firstQuestion, totalQuestions,  timeLimit } = location.state || {}

  const [question, setQuestion] = useState(firstQuestion)
  const [answer, setAnswer] = useState('')
  const [questionNumber, setQuestionNumber] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // ── timer state ────────────────────────────────────────────────────────────
  const [timeLeft, setTimeLeft] = useState(timeLimit || 90)
  // timeLeft counts down from timeLimit to 0

  const timerRef = useRef(null)
  // useRef stores the interval ID so we can clear it later
  // WHY useRef not useState: changing a ref doesn't re-render the component

  // ── start timer on mount and reset on each new question ───────────────────
  useEffect(() => {
    setTimeLeft(timeLimit || 90)  // reset timer for each question

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)  // stop timer at 0
          handleAutoSubmit()               // auto submit when time runs out
          return 0
        }
        return prev - 1   // count down by 1 each second
      })
    }, 1000)  // runs every 1000ms = 1 second

    // cleanup: clear interval when component unmounts or question changes
    return () => clearInterval(timerRef.current)
  }, [questionNumber])  // re-run when question number changes = reset timer


  // auto submit when timer hits 0
  async function handleAutoSubmit() {
    await submitAnswer(answer || "No answer provided — time ran out.")
    // if candidate didn't type anything, submit a default message
  }

  async function handleSubmit() {
    if (!answer.trim()) {
      setError('Please type an answer before submitting')
      return
    }
    clearInterval(timerRef.current)  // stop timer when manually submitted
    await submitAnswer(answer)
  }

  // ── core submit logic extracted so both manual + auto can call it ──────────
  async function submitAnswer(answerText) {
    setLoading(true)
    setError('')

    try {
      const res = await axios.post(`${API}/answer`, {
        session_id: sessionId,
        answer: answerText
      })

      if (res.data.status === 'completed') {
        navigate('/report', { state: { sessionId } })
      } else {
        setQuestion(res.data.question)
        setQuestionNumber(res.data.question_number)
        setAnswer('')
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // timer color changes as time runs out
  function timerColor() {
    if (timeLeft > 60) return '#22c55e'   // green — plenty of time
    if (timeLeft > 30) return '#f59e0b'   // amber — getting low
    return '#ef4444'                       // red — almost out
  }

  // format seconds as MM:SS e.g. 90 → "1:30"
  function formatTime(seconds) {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
    // padStart(2, '0') ensures "1:05" not "1:5"
  }

  const progress = (questionNumber / totalQuestions) * 100

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* progress + timer row */}
        <div style={styles.topRow}>
          <span style={styles.progressText}>
            Question {questionNumber} of {totalQuestions}
          </span>

          {/* timer — color changes based on time left */}
          <span style={{ ...styles.timer, color: timerColor() }}>
            {formatTime(timeLeft)}
          </span>
        </div>

        {/* progress bar */}
        <div style={styles.progressTrack}>
          <div style={{ ...styles.progressFill, width: `${progress}%` }} />
        </div>

        {/* question box */}
        <div style={styles.questionBox}>
          <p style={styles.questionLabel}>Question</p>
          <p style={styles.questionText}>{question}</p>
        </div>

        {/* answer textarea */}
        <textarea
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          rows={6}
          style={styles.textarea}
        />

        <p style={styles.charCount}>{answer.length} characters</p>

        {error && <p style={styles.error}>{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ ...styles.submitBtn, opacity: loading ? 0.6 : 1 }}
        >
          {loading
            ? 'Submitting...'
            : questionNumber === totalQuestions
              ? 'Finish Interview'
              : 'Next Question'
          }
        </button>

      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0f172a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'sans-serif',
    padding: '20px'
  },
  card: {
    background: '#1e293b',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '600px'
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  progressText: {
    color: '#64748b',
    fontSize: '13px'
  },
  timer: {
    fontSize: '22px',
    fontWeight: '800',
    fontVariantNumeric: 'tabular-nums',
    // tabular-nums keeps digits same width so timer doesn't jump around
    transition: 'color 0.5s'
  },
  progressTrack: {
    height: '4px',
    background: '#334155',
    borderRadius: '2px',
    marginBottom: '32px'
  },
  progressFill: {
    height: '100%',
    background: '#3b82f6',
    borderRadius: '2px',
    transition: 'width 0.4s ease'
  },
  questionBox: {
    background: '#0f172a',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    borderLeft: '4px solid #3b82f6'
  },
  questionLabel: {
    color: '#3b82f6',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: '10px'
  },
  questionText: {
    color: '#f1f5f9',
    fontSize: '17px',
    lineHeight: '1.6',
    margin: 0
  },
  textarea: {
    width: '100%',
    padding: '16px',
    background: '#0f172a',
    border: '1px solid #334155',
    borderRadius: '10px',
    color: '#f1f5f9',
    fontSize: '15px',
    lineHeight: '1.6',
    resize: 'vertical',
    boxSizing: 'border-box',
    fontFamily: 'sans-serif',
    outline: 'none'
  },
  charCount: {
    color: '#475569',
    fontSize: '12px',
    textAlign: 'right',
    margin: '6px 0 16px'
  },
  error: {
    color: '#f87171',
    fontSize: '13px',
    marginBottom: '16px'
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    background: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer'
  }
}