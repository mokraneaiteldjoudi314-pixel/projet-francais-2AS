interface Props {
  compact?: boolean
}

export function LogoMark({ size = 44 }: { size?: number }) {
  return (
    <svg className="logo-mark" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c4f36b" />
          <stop offset="1" stopColor="#1fc8b4" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="rgba(31,200,180,0.12)" stroke="rgba(160,240,220,0.25)" />
      <path d="M32 13a19 19 0 1 0 18.4 14.2" fill="none" stroke="url(#logo-g)" strokeWidth="4" strokeLinecap="round" />
      <path d="M45.5 19.5l5 8-9.4 1.2" fill="none" stroke="url(#logo-g)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22.5 41.5c0-11 8.2-17.6 19.6-17.6-.8 11.2-7.4 18.6-17.6 18.6" fill="url(#logo-g)" />
      <path d="M23 42.5l11-10" stroke="#06231f" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}

export function Logo({ compact }: Props) {
  return (
    <div className="logo">
      <LogoMark size={compact ? 36 : 44} />
      <div className="logo-text">
        <span className="logo-title">Waste Less</span>
        <span className="logo-sub">Live Better</span>
      </div>
    </div>
  )
}
