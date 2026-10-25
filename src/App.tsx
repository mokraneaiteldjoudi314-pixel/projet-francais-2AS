import { useEffect, useState } from 'react'
import { AccessLog } from './components/AccessLog'
import { Experience } from './components/Experience'
import { LoginScreen, type Session } from './components/LoginScreen'
import { KEYS, load, remove, safeSession, save } from './lib/storage'

function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash)
  useEffect(() => {
    const onChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return hash
}

export default function App() {
  const hash = useHashRoute()
  const [session, setSession] = useState<Session | null>(() => load<Session | null>(KEYS.session, null, safeSession()))

  if (hash === '#/log') return <AccessLog onBack={() => (window.location.hash = '')} />

  if (!session) {
    return (
      <LoginScreen
        onSignedIn={(s) => {
          save(KEYS.session, s, safeSession())
          setSession(s)
        }}
        onOpenLog={() => (window.location.hash = '#/log')}
      />
    )
  }

  return (
    <Experience
      session={session}
      onSignOut={() => {
        remove(KEYS.session, safeSession())
        setSession(null)
      }}
    />
  )
}
