// Small wrappers so private browsing or blocked storage never breaks the experience.
export function load<T>(key: string, fallback: T, store: Storage | undefined = safeLocal()): T {
  try {
    const raw = store?.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function save(key: string, value: unknown, store: Storage | undefined = safeLocal()): void {
  try {
    store?.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable */
  }
}

export function remove(key: string, store: Storage | undefined = safeLocal()): void {
  try {
    store?.removeItem(key)
  } catch {
    /* storage unavailable */
  }
}

export function safeLocal(): Storage | undefined {
  try {
    return window.localStorage
  } catch {
    return undefined
  }
}

export function safeSession(): Storage | undefined {
  try {
    return window.sessionStorage
  } catch {
    return undefined
  }
}

export const KEYS = {
  progress: 'wllb.progress.v1',
  prefs: 'wllb.prefs.v1',
  session: 'wllb.session.v1',
}
