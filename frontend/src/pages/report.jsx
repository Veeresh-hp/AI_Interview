import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = 'http://localhost:8000'

// verdict color mapping — each verdict gets a different color badge
const VERDICT_COLORS = {
  'EXCELLENT FIT': '#22c55e',   // green
  'GOOD FIT': '#3b82f6',        // blue
  'AVERAGE FIT': '#f59e0b',     // amber
  'NOT A FIT': '#ef4444'        // red
}

export default function Report() {
  const location = useLocation()
  const navigate = useNavigate()
  const { sessionId } = location.state || {}

  // ── state ──────────────────────────────────────────────────────────────────
  const [report, setReport] = useState(null)
  // null until API returns data

  const [loading, setLoading] = useState(true)
  // true while fetching report

  const [error, setError] = useState('')

  // ── fetch report on page load ──────────────────────────────────────────────
  useEffect(() => {
    // useEffect with [] runs once when component mounts
    // perfect for fetching data on page load

    async function fetchReport() {
      try {
        const res = await axios.get(`${API}/report?session_id=${sessionId}`)
        setReport(res.data)   // store report data in state
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load report')
      } finally {
        setLoading(false)
      }
    }

    if (sessionId) {
      fetchReport()
    } else {
      // if no sessionId, user navigated here directly — redirect to home
      navigate('/')
    }
  }, )   // empty array = run once on mount

  // ── loading state ──────────────────────────────────────────────────────────
  if (loading) return (
    <div style={styles.page}>
      <div style={styles.loadingCard}>
        <p style={styles.loadingText}>Generating your report...</p>
        <p style={styles.loadingSubtext}>The AI is analyzing all your answers</p>
      </div>
    </div>
  )

  if (error) return (
    <div style={styles.page}>
      <div style={styles.loadingCard}>
        <p style={{ color: '#f87171' }}>{error}</p>
        <button onClick={() => navigate('/')} style={styles.retryBtn}>
          Go Home
        </button>
      </div>
    </div>
  )

  // verdict badge color — defaults to gray if verdict not recognized
  const verdictColor = VERDICT_COLORS[report.verdict] || '#94a3b8'

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* ── header ── */}
        <div style={styles.header}>
          <h1 style={styles.title}>Interview Report</h1>

          {/* overall score — big number like EmployAbility */}
          <div style={styles.scoreCircle}>
            <span style={styles.scoreNumber}>{report.overall_score}</span>
            <span style={styles.scoreDenom}>/10</span>
          </div>

          {/* verdict badge */}
          <div style={{ ...styles.verdictBadge, background: verdictColor + '22', border: `1px solid ${verdictColor}` }}>
            <span style={{ color: verdictColor, fontWeight: '700', fontSize: '14px' }}>
              {report.verdict}
            </span>
          </div>
        </div>

        {/* ── summary ── */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Recruiter Summary</h2>
          <p style={styles.summaryText}>{report.summary}</p>
        </div>

        {/* ── pros and cons side by side ── */}
        <div style={styles.prosConsRow}>

          {/* pros */}
          <div style={{ ...styles.card, flex: 1 }}>
            <h2 style={{ ...styles.sectionTitle, color: '#22c55e' }}>Strengths</h2>
            {report.pros.map((pro, i) => (
              <div key={i} style={styles.bulletRow}>
                <span style={{ color: '#22c55e', marginRight: '8px' }}>✓</span>
                <span style={styles.bulletText}>{pro}</span>
              </div>
            ))}
          </div>

          {/* cons */}
          <div style={{ ...styles.card, flex: 1 }}>
            <h2 style={{ ...styles.sectionTitle, color: '#ef4444' }}>Weaknesses</h2>
            {report.cons.map((con, i) => (
              <div key={i} style={styles.bulletRow}>
                <span style={{ color: '#ef4444', marginRight: '8px' }}>✗</span>
                <span style={styles.bulletText}>{con}</span>
              </div>
            ))}
          </div>

        </div>

        {/* ── per question breakdown ── */}
        <h2 style={{ ...styles.sectionTitle, color: '#94a3b8', marginBottom: '16px' }}>
          Question Breakdown
        </h2>

        {report.breakdown.map((item, i) => (
          <div key={i} style={styles.card}>

            {/* question header row */}
            <div style={styles.breakdownHeader}>
              <span style={styles.qNumber}>Q{i + 1}</span>
              {/* score badge — color changes based on score */}
              <span style={{
                ...styles.scoreBadge,
                background: item.score >= 7 ? '#14532d' : item.score >= 5 ? '#1e3a5f' : '#450a0a',
                color: item.score >= 7 ? '#22c55e' : item.score >= 5 ? '#3b82f6' : '#f87171'
              }}>
                {item.score}/10
              </span>
            </div>

            <p style={styles.breakdownQuestion}>{item.question}</p>

            {/* candidate's answer */}
            <div style={styles.answerBox}>
              <p style={styles.answerLabel}>Your Answer</p>
              <p style={styles.answerText}>{item.answer}</p>
            </div>

            {/* AI feedback */}
            <p style={styles.feedbackText}>{item.feedback}</p>

            {/* what was missing */}
            {item.missing && (
              <div style={styles.missingBox}>
                <span style={styles.missingLabel}>Missing: </span>
                <span style={styles.missingText}>{item.missing}</span>
              </div>
            )}

          </div>
        ))}

        {/* try again button */}
        <button onClick={() => navigate('/')} style={styles.retryBtn}>
          Take Another Interview
        </button>

      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0f172a',
    fontFamily: 'sans-serif',
    padding: '40px 20px'
  },
  container: {
    maxWidth: '700px',
    margin: '0 auto'
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px'
  },
  title: {
    color: '#f1f5f9',
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '20px'
  },
  scoreCircle: {
    display: 'inline-flex',
    alignItems: 'baseline',
    gap: '4px',
    marginBottom: '16px'
  },
  scoreNumber: {
    color: '#f1f5f9',
    fontSize: '72px',
    fontWeight: '800',
    lineHeight: 1
  },
  scoreDenom: {
    color: '#64748b',
    fontSize: '28px',
    fontWeight: '600'
  },
  verdictBadge: {
    display: 'inline-block',
    padding: '8px 20px',
    borderRadius: '999px',   // pill shape
  },
  card: {
    background: '#1e293b',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '16px'
  },
  sectionTitle: {
    color: '#f1f5f9',
    fontSize: '16px',
    fontWeight: '700',
    marginBottom: '16px',
    marginTop: 0
  },
  summaryText: {
    color: '#94a3b8',
    lineHeight: '1.7',
    margin: 0
  },
  prosConsRow: {
    display: 'flex',
    gap: '16px',
    marginBottom: '0'
  },
  bulletRow: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '10px'
  },
  bulletText: {
    color: '#94a3b8',
    fontSize: '14px',
    lineHeight: '1.5'
  },
  breakdownHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  qNumber: {
    color: '#3b82f6',
    fontWeight: '700',
    fontSize: '14px'
  },
  scoreBadge: {
    padding: '4px 12px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: '700'
  },
  breakdownQuestion: {
    color: '#f1f5f9',
    fontSize: '15px',
    lineHeight: '1.5',
    marginBottom: '16px'
  },
  answerBox: {
    background: '#0f172a',
    borderRadius: '8px',
    padding: '12px 16px',
    marginBottom: '12px'
  },
  answerLabel: {
    color: '#475569',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: '6px'
  },
  answerText: {
    color: '#94a3b8',
    fontSize: '14px',
    lineHeight: '1.5',
    margin: 0
  },
  feedbackText: {
    color: '#94a3b8',
    fontSize: '14px',
    lineHeight: '1.6',
    marginBottom: '12px'
  },
  missingBox: {
    borderTop: '1px solid #334155',
    paddingTop: '12px'
  },
  missingLabel: {
    color: '#f59e0b',
    fontSize: '13px',
    fontWeight: '700'
  },
  missingText: {
    color: '#78716c',
    fontSize: '13px'
  },
  loadingCard: {
    background: '#1e293b',
    borderRadius: '16px',
    padding: '60px 40px',
    textAlign: 'center',
    maxWidth: '400px',
    margin: '0 auto',
    marginTop: '20vh'
  },
  loadingText: {
    color: '#f1f5f9',
    fontSize: '20px',
    fontWeight: '700',
    marginBottom: '8px'
  },
  loadingSubtext: {
    color: '#64748b',
    fontSize: '14px'
  },
  retryBtn: {
    display: 'block',
    width: '100%',
    padding: '14px',
    background: '#1e293b',
    color: '#94a3b8',
    border: '1px solid #334155',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px'
  }
}