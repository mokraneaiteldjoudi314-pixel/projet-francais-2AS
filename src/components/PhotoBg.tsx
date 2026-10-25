interface PhotoProps {
  src: string
  /** Where the photo is anchored when cropped, e.g. "70% 50%". */
  position?: string
}

/** Full-bleed cinematic photo with a slow camera drift and a readable shade. */
export function PhotoBg({ src, position = 'center' }: PhotoProps) {
  return (
    <div className="photo" aria-hidden="true">
      <div className="photo-img ambient" style={{ backgroundImage: `url(${src})`, backgroundPosition: position }} />
      <div className="photo-shade" />
    </div>
  )
}

// Fixed positions so every render (and every screenshot) looks the same.
const SPARKS = [
  [8, 72, 0, 7],
  [18, 40, 1.2, 9],
  [27, 84, 2.6, 8],
  [36, 58, 0.6, 10],
  [48, 78, 3.4, 7.5],
  [57, 30, 1.8, 9.5],
  [66, 66, 4.2, 8.5],
  [74, 44, 2.2, 11],
  [83, 80, 0.9, 7],
  [91, 52, 3.1, 9],
  [12, 20, 4.8, 10],
  [62, 14, 5.4, 8],
]

export function Ambient({ kind }: { kind: 'sparks' | 'bubbles' | 'leaves' }) {
  return (
    <div className={`ambient-layer ${kind}`} aria-hidden="true">
      {SPARKS.map(([x, y, delay, dur], i) => (
        <span key={i} className="ambient" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${delay}s`, animationDuration: `${dur}s` }} />
      ))}
    </div>
  )
}
