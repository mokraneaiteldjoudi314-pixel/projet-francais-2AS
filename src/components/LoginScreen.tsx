import { ArrowRight, KeyRound, ListChecks, Loader2, ShieldCheck } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { InvalidCodeError, startVisit, type Role } from '../lib/visitLog'
import { Logo } from './Logo'

export interface Session {
  visitId: string | null
  name: string
  role: Role
}

interface Props {
  onSignedIn: (s: Session) => void
  onOpenLog: () => void
}

const ROLES: { id: Role; label: string }[] = [
  { id: 'teacher', label: 'Teacher' },
  { id: 'student', label: 'Student' },
  { id: 'visitor', label: 'Visitor' },
]

export function LoginScreen({ onSignedIn, onOpenLog }: Props) {
  const [name, setName] = useState('')
  const [role, setRole] = useState<Role>('teacher')
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [offline, setOffline] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !code.trim()) {
      setError('Please enter your name and the access code.')
      return
    }
    setBusy(true)
    setError(null)
    setOffline(false)
    try {
      const visitId = await startVisit(name.trim(), role, code.trim())
      onSignedIn({ visitId, name: name.trim(), role })
    } catch (err) {
      if (err instanceof InvalidCodeError) setError('This access code is not valid. Check it with the project team.')
      else {
        setError('The visit log could not be reached. Check your internet connection and try again.')
        setOffline(true)
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="login">
      <div className="login-art photo-bg" style={{ backgroundImage: 'url(images/hero.jpg)' }} aria-hidden="true" />
      <div className="login-grid">
        <section className="login-intro">
          <Logo />
          <p className="eyebrow spaced">An interactive documentary</p>
          <h1 className="display">
            Small Choices. <span className="grad">Big Impact.</span>
          </h1>
          <p className="lead">Eight short chapters about food, water and energy, with a game, a quiz and a narrated guided tour.</p>
        </section>
        <form className="login-card glass" onSubmit={submit} noValidate>
          <h2 className="panel-title">
            <ShieldCheck size={22} aria-hidden="true" /> Sign in to start
          </h2>
          <label className="field">
            <span>Your name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} autoComplete="name" placeholder="e.g. Mrs. Benali" required />
          </label>
          <fieldset className="field">
            <legend>I am a</legend>
            <div className="segmented" role="radiogroup">
              {ROLES.map((r) => (
                <button type="button" key={r.id} role="radio" aria-checked={role === r.id} className={role === r.id ? 'is-on good' : ''} onClick={() => setRole(r.id)}>
                  {r.label}
                </button>
              ))}
            </div>
          </fieldset>
          <label className="field">
            <span>Access code</span>
            <span className="input-icon">
              <KeyRound size={18} aria-hidden="true" />
              <input value={code} onChange={(e) => setCode(e.target.value)} autoComplete="off" autoCapitalize="characters" placeholder="Given by the project team" required />
            </span>
          </label>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <button className="btn btn-primary btn-block" type="submit" disabled={busy}>
            {busy ? <Loader2 size={18} className="spinner" aria-hidden="true" /> : null}
            {busy ? 'Signing in…' : 'Enter the Experience'} {!busy && <ArrowRight size={18} aria-hidden="true" />}
          </button>
          {offline && (
            <button type="button" className="link-btn center" onClick={() => onSignedIn({ visitId: null, name: name.trim() || 'Guest', role })}>
              Continue without recording this visit
            </button>
          )}
          <p className="privacy">
            Your name, role, sign-in time, the chapters you open and your quiz score are saved so the project team can see that the presentation was viewed. Nothing else is collected.
          </p>
          <button type="button" className="link-btn" onClick={onOpenLog}>
            <ListChecks size={16} aria-hidden="true" /> Project team: view the access log
          </button>
        </form>
      </div>
    </div>
  )
}
