import { ArrowLeft, ChevronLeft, ChevronRight, KeyRound, ListChecks, Loader2, RefreshCw } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { SCENES } from '../data/scenes'
import { getVisits, InvalidCodeError, type Visit } from '../lib/visitLog'
import { Logo } from './Logo'
import { SceneArt } from './SceneArt'

const PAGE = 6

function duration(sec: number) {
  if (sec < 60) return `${sec}s`
  const m = Math.floor(sec / 60)
  return m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${m % 60} min`
}

function when(iso: string) {
  return new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function device(ua: string | null) {
  if (!ua) return 'Unknown'
  if (/iPhone|Android.+Mobile/.test(ua)) return 'Phone'
  if (/iPad|Android/.test(ua)) return 'Tablet'
  return 'Computer'
}

export function AccessLog({ onBack }: { onBack: () => void }) {
  const [code, setCode] = useState('')
  const [visits, setVisits] = useState<Visit[] | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [filter, setFilter] = useState<'all' | 'teacher'>('teacher')

  const load = async (e?: FormEvent) => {
    e?.preventDefault()
    setBusy(true)
    setError(null)
    try {
      setVisits(await getVisits(code.trim()))
      setPage(0)
    } catch (err) {
      setError(err instanceof InvalidCodeError ? 'This log code is not valid.' : 'The visit log could not be reached. Try again.')
    } finally {
      setBusy(false)
    }
  }

  const shown = (visits ?? []).filter((v) => filter === 'all' || v.role === 'teacher')
  const pages = Math.max(1, Math.ceil(shown.length / PAGE))
  const rows = shown.slice(page * PAGE, page * PAGE + PAGE)
  const teacherVisits = (visits ?? []).filter((v) => v.role === 'teacher')

  return (
    <div className="login">
      <SceneArt scene="quiz" className="login-art" />
      <div className="log-wrap">
        <header className="log-head">
          <Logo />
          <button className="btn btn-ghost btn-small" onClick={onBack}>
            <ArrowLeft size={16} aria-hidden="true" /> Back to sign in
          </button>
        </header>
        {!visits ? (
          <form className="login-card glass log-gate" onSubmit={load}>
            <h1 className="panel-title">
              <ListChecks size={22} aria-hidden="true" /> Access log
            </h1>
            <p className="muted">See who opened the project, when, which chapters they viewed and their quiz score.</p>
            <label className="field">
              <span>Log code</span>
              <span className="input-icon">
                <KeyRound size={18} aria-hidden="true" />
                <input value={code} onChange={(e) => setCode(e.target.value)} autoComplete="off" autoCapitalize="characters" required />
              </span>
            </label>
            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="btn btn-primary btn-block" disabled={busy || !code.trim()}>
              {busy && <Loader2 size={18} className="spinner" aria-hidden="true" />} Open the log
            </button>
          </form>
        ) : (
          <section className="log-panel glass">
            <div className="log-summary">
              <div>
                <h1 className="panel-title">
                  <ListChecks size={22} aria-hidden="true" /> Access log
                </h1>
                <p className="muted">
                  {teacherVisits.length
                    ? `The teacher signed in ${teacherVisits.length} time${teacherVisits.length > 1 ? 's' : ''}. Last visit: ${when(teacherVisits[0].started_at)}.`
                    : 'No teacher visit has been recorded yet.'}
                </p>
              </div>
              <div className="log-tools">
                <div className="segmented small" role="radiogroup" aria-label="Filter">
                  <button role="radio" aria-checked={filter === 'teacher'} className={filter === 'teacher' ? 'is-on good' : ''} onClick={() => { setFilter('teacher'); setPage(0) }}>
                    Teachers
                  </button>
                  <button role="radio" aria-checked={filter === 'all'} className={filter === 'all' ? 'is-on good' : ''} onClick={() => { setFilter('all'); setPage(0) }}>
                    Everyone
                  </button>
                </div>
                <button className="icon-btn" onClick={() => load()} aria-label="Refresh" disabled={busy}>
                  <RefreshCw size={18} className={busy ? 'spinner' : ''} />
                </button>
              </div>
            </div>
            {rows.length === 0 ? (
              <p className="empty">No visits to show.</p>
            ) : (
              <div className="log-table" role="table" aria-label="Visits">
                <div className="log-row log-row-head" role="row">
                  <span role="columnheader">Name</span>
                  <span role="columnheader">Signed in</span>
                  <span role="columnheader">Last activity</span>
                  <span role="columnheader">Time spent</span>
                  <span role="columnheader">Chapters</span>
                  <span role="columnheader">Quiz</span>
                </div>
                {rows.map((v) => (
                  <div className="log-row" role="row" key={v.started_at + v.visitor_name}>
                    <span role="cell" className="log-name">
                      <strong>{v.visitor_name}</strong>
                      <small>
                        {v.role} · {device(v.user_agent)}
                      </small>
                    </span>
                    <span role="cell">{when(v.started_at)}</span>
                    <span role="cell">{when(v.last_seen_at)}</span>
                    <span role="cell">{duration(v.seconds_active)}</span>
                    <span role="cell" className="log-chapters" title={v.scenes_viewed.map((n) => SCENES[n - 1]?.navLabel).join(', ')}>
                      <span className="mini-dots">
                        {SCENES.map((s) => (
                          <span key={s.id} className={v.scenes_viewed.includes(s.number) ? 'on' : ''} />
                        ))}
                      </span>
                      {v.scenes_viewed.length} / {SCENES.length}
                    </span>
                    <span role="cell">{v.quiz_total ? `${v.quiz_score} / ${v.quiz_total}` : '—'}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="log-pager">
              <button className="icon-btn" onClick={() => setPage(page - 1)} disabled={page === 0} aria-label="Previous page">
                <ChevronLeft size={18} />
              </button>
              <span>
                Page {page + 1} / {pages}
              </span>
              <button className="icon-btn" onClick={() => setPage(page + 1)} disabled={page >= pages - 1} aria-label="Next page">
                <ChevronRight size={18} />
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
