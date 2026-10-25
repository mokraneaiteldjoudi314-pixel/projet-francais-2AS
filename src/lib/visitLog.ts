import { SUPABASE_KEY, SUPABASE_URL } from './config'

export type Role = 'teacher' | 'student' | 'visitor'

export interface Visit {
  visitor_name: string
  role: Role
  started_at: string
  last_seen_at: string
  scenes_viewed: number[]
  seconds_active: number
  quiz_score: number | null
  quiz_total: number | null
  user_agent: string | null
}

export class InvalidCodeError extends Error {}
export class NetworkError extends Error {}

async function rpc<T>(name: string, body: Record<string, unknown>, keepalive = false): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
      method: 'POST',
      keepalive,
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify(body),
    })
  } catch {
    throw new NetworkError('The visit log could not be reached.')
  }
  if (!res.ok) {
    const text = await res.text()
    if (text.includes('invalid_code')) throw new InvalidCodeError('This code is not valid.')
    throw new NetworkError(`The visit log answered with an error (${res.status}).`)
  }
  const text = await res.text()
  return (text ? JSON.parse(text) : null) as T
}

export function startVisit(name: string, role: Role, code: string): Promise<string> {
  return rpc<string>('start_visit', {
    p_name: name,
    p_role: role,
    p_code: code,
    p_user_agent: navigator.userAgent,
  })
}

export interface TouchPayload {
  scene?: number
  seconds?: number
  quizScore?: number
  quizTotal?: number
}

export function touchVisit(id: string, p: TouchPayload): Promise<void> {
  return rpc<void>(
    'touch_visit',
    {
      p_id: id,
      p_scene: p.scene ?? null,
      p_seconds: p.seconds ?? 0,
      p_quiz_score: p.quizScore ?? null,
      p_quiz_total: p.quizTotal ?? null,
    },
    true,
  ).catch(() => undefined)
}

export function getVisits(code: string): Promise<Visit[]> {
  return rpc<Visit[]>('get_visits', { p_code: code })
}
