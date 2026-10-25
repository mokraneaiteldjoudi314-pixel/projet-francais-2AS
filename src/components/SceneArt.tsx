import type { ReactNode } from 'react'
import type { SceneId } from '../data/scenes'
import { PHOTOS } from '../data/media'

/** Deterministic pseudo-random numbers so the art is identical on every render. */
function rand(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function Stars({ count, seed, maxY = 420 }: { count: number; seed: number; maxY?: number }) {
  const r = rand(seed)
  return (
    <g className="ambient twinkle">
      {Array.from({ length: count }, (_, i) => (
        <circle
          key={i}
          cx={r() * 1600}
          cy={r() * maxY}
          r={r() * 1.4 + 0.4}
          fill="#e8fbff"
          opacity={r() * 0.6 + 0.2}
          style={{ animationDelay: `${(r() * 6).toFixed(2)}s` }}
        />
      ))}
    </g>
  )
}

function Pines({ seed, from, to, baseY, minH, maxH, color }: { seed: number; from: number; to: number; baseY: number; minH: number; maxH: number; color: string }) {
  const r = rand(seed)
  const trees: ReactNode[] = []
  let x = from
  let i = 0
  while (x < to) {
    const h = minH + r() * (maxH - minH)
    const w = h * 0.36
    trees.push(
      <path
        key={i++}
        d={`M${x} ${baseY} L${x + w / 2} ${baseY - h} L${x + w} ${baseY} Z M${x + w * 0.1} ${baseY - h * 0.35} L${x + w / 2} ${baseY - h * 0.9} L${x + w * 0.9} ${baseY - h * 0.35} Z`}
        fill={color}
      />,
    )
    x += w * (0.55 + r() * 0.5)
  }
  return <g>{trees}</g>
}

function Turbine({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-3 0 L-1.4 -120 L1.4 -120 L3 0 Z" fill="#cfe9ea" opacity="0.85" />
      <g transform="translate(0 -120)">
        <g className="ambient spin">
          <path d="M0 0 L-3 -6 L0 -62 L3 -6 Z" fill="#e9f7f6" />
          <path d="M0 0 L-3 -6 L0 -62 L3 -6 Z" fill="#e9f7f6" transform="rotate(120)" />
          <path d="M0 0 L-3 -6 L0 -62 L3 -6 Z" fill="#e9f7f6" transform="rotate(240)" />
        </g>
        <circle r="4" fill="#ffffff" />
      </g>
    </g>
  )
}

function Fireflies({ seed, count, area }: { seed: number; count: number; area: [number, number, number, number] }) {
  const r = rand(seed)
  const [x0, y0, w, h] = area
  return (
    <g className="ambient float">
      {Array.from({ length: count }, (_, i) => (
        <circle
          key={i}
          cx={x0 + r() * w}
          cy={y0 + r() * h}
          r={r() * 2.2 + 1}
          fill="#d8ff8a"
          opacity={0.7}
          style={{ animationDelay: `${(r() * 8).toFixed(2)}s`, animationDuration: `${(6 + r() * 6).toFixed(1)}s` }}
        />
      ))}
    </g>
  )
}

function SkyGradient({ id, stops }: { id: string; stops: [number, string][] }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      {stops.map(([o, c]) => (
        <stop key={o} offset={o} stopColor={c} />
      ))}
    </linearGradient>
  )
}

function HomeArt() {
  return (
    <>
      <defs>
        <SkyGradient id="home-sky" stops={[[0, '#030c15'], [0.38, '#0a2636'], [0.62, '#1b5559'], [0.8, '#c99a5e'], [1, '#f2c27a']]} />
        <radialGradient id="home-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff4cf" />
          <stop offset="0.25" stopColor="#ffd98e" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffb860" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="home-river" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6d39a" />
          <stop offset="0.35" stopColor="#5fc7c0" />
          <stop offset="1" stopColor="#0d4c58" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#home-sky)" />
      <Stars count={90} seed={7} maxY={330} />
      <circle className="ambient pulse" cx="1060" cy="560" r="260" fill="url(#home-sun)" />
      <circle cx="1060" cy="560" r="46" fill="#fff1c6" />
      <path d="M0 560 C180 470 330 520 470 470 C620 420 760 500 900 470 C1060 430 1220 500 1380 450 C1480 420 1550 440 1600 430 L1600 900 L0 900 Z" fill="#20464a" opacity="0.85" />
      <Turbine x={1180} y={520} s={0.9} />
      <Turbine x={1300} y={505} s={1.05} />
      <Turbine x={1420} y={525} s={0.8} />
      <path d="M0 610 C200 560 360 600 540 570 C720 540 880 610 1060 590 C1240 570 1420 610 1600 580 L1600 900 L0 900 Z" fill="#123532" />
      <path d="M700 900 C760 800 860 720 960 660 C1000 636 1040 612 1060 600 C1080 612 1110 640 1100 660 C1060 720 960 790 980 900 Z" fill="url(#home-river)" opacity="0.92" />
      <path className="ambient shimmer" d="M900 760 C950 720 1000 690 1040 650" stroke="#fff6dc" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6" />
      <path d="M0 680 C160 640 320 700 520 680 C620 670 680 700 760 720 L760 900 L0 900 Z" fill="#0b2622" />
      <path d="M1100 700 C1250 660 1420 690 1600 660 L1600 900 L1050 900 Z" fill="#0b2622" />
      <Pines seed={3} from={-20} to={620} baseY={760} minH={80} maxH={170} color="#071a17" />
      <Pines seed={9} from={1150} to={1640} baseY={760} minH={90} maxH={190} color="#071a17" />
      <rect y="740" width="1600" height="160" fill="#04110f" />
      <Fireflies seed={5} count={26} area={[60, 560, 1480, 260]} />
    </>
  )
}

function ProblemArt() {
  return (
    <>
      <defs>
        <linearGradient id="prob-left" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#14181c" />
          <stop offset="0.7" stopColor="#3b3a35" />
          <stop offset="1" stopColor="#1a1a18" />
        </linearGradient>
        <linearGradient id="prob-right" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#06202a" />
          <stop offset="0.65" stopColor="#1d6a62" />
          <stop offset="1" stopColor="#0a2a22" />
        </linearGradient>
        <linearGradient id="prob-fade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0.42" stopColor="#000" stopOpacity="0" />
          <stop offset="0.5" stopColor="#c6ff7a" stopOpacity="0.35" />
          <stop offset="0.58" stopColor="#000" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="800" height="900" fill="url(#prob-left)" />
      <rect x="800" width="800" height="900" fill="url(#prob-right)" />
      <g opacity="0.9">
        <rect x="180" y="380" width="46" height="260" fill="#26282a" />
        <rect x="270" y="430" width="38" height="210" fill="#232527" />
        <path d="M80 640 L80 520 L170 470 L170 640 Z M320 640 L320 500 L420 540 L420 640 Z" fill="#1d1f21" />
        <g className="ambient rise">
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={i} cx={203 + i * 10} cy={360 - i * 50} r={30 + i * 14} fill="#6b6a64" opacity={0.35 - i * 0.05} style={{ animationDelay: `${i * 0.8}s` }} />
          ))}
        </g>
      </g>
      <path d="M0 700 C140 640 300 690 460 660 C580 640 700 680 800 690 L800 900 L0 900 Z" fill="#1f1e1b" />
      <path d="M430 690 C470 640 560 620 640 650 C700 670 720 700 700 720 Z" fill="#4a4237" opacity="0.8" />
      <path d="M800 690 C960 620 1120 670 1260 630 C1400 600 1500 640 1600 620 L1600 900 L800 900 Z" fill="#0e3a30" />
      <Pines seed={21} from={820} to={1620} baseY={720} minH={70} maxH={170} color="#0a2a22" />
      <Turbine x={1350} y={600} s={0.75} />
      <Turbine x={1470} y={612} s={0.6} />
      <rect y="720" width="1600" height="180" fill="#05110e" />
      <rect width="1600" height="900" fill="url(#prob-fade)" />
      <Fireflies seed={11} count={14} area={[860, 520, 700, 220]} />
    </>
  )
}

function FoodArt() {
  return (
    <>
      <defs>
        <radialGradient id="food-light" cx="0.25" cy="0.15" r="0.8">
          <stop offset="0" stopColor="#f6e2a8" stopOpacity="0.55" />
          <stop offset="0.45" stopColor="#1f5a48" stopOpacity="0.4" />
          <stop offset="1" stopColor="#04130f" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="food-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0a241d" />
          <stop offset="1" stopColor="#03100c" />
        </linearGradient>
        <linearGradient id="fridge" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#d9efe9" />
          <stop offset="1" stopColor="#9fc3bb" />
        </linearGradient>
        <linearGradient id="fridge-in" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fffbe8" />
          <stop offset="1" stopColor="#cfe7de" />
        </linearGradient>
        <radialGradient id="apple" cx="0.35" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#ff8a6b" />
          <stop offset="1" stopColor="#b8262d" />
        </radialGradient>
        <radialGradient id="orange" cx="0.35" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#ffd27a" />
          <stop offset="1" stopColor="#e58a1c" />
        </radialGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#food-bg)" />
      <rect width="1600" height="900" fill="url(#food-light)" />
      {/* window */}
      <g opacity="0.35">
        <rect x="140" y="80" width="380" height="300" rx="8" fill="none" stroke="#f3e3b5" strokeWidth="6" />
        <line x1="330" y1="80" x2="330" y2="380" stroke="#f3e3b5" strokeWidth="5" />
        <line x1="140" y1="230" x2="520" y2="230" stroke="#f3e3b5" strokeWidth="5" />
      </g>
      {/* fridge */}
      <g transform="translate(1080 140)">
        <rect width="360" height="620" rx="26" fill="url(#fridge)" />
        <rect x="24" y="24" width="312" height="572" rx="14" fill="url(#fridge-in)" />
        <g className="ambient pulse-soft">
          <rect x="24" y="24" width="312" height="572" rx="14" fill="#fffde6" opacity="0.25" />
        </g>
        {[170, 320, 460].map((y) => (
          <rect key={y} x="30" y={y} width="300" height="6" rx="3" fill="#a9cbc2" />
        ))}
        <rect x="56" y="100" width="90" height="70" rx="10" fill="#8fd3c4" opacity="0.8" />
        <rect x="160" y="112" width="70" height="58" rx="10" fill="#b8e986" opacity="0.85" />
        <rect x="244" y="92" width="64" height="78" rx="10" fill="#f6c76a" opacity="0.85" />
        <circle cx="90" cy="290" r="26" fill="url(#apple)" />
        <circle cx="140" cy="296" r="22" fill="url(#orange)" />
        <rect x="190" y="252" width="110" height="68" rx="12" fill="#e6f5ef" stroke="#7fbdb0" strokeWidth="3" />
        <rect x="70" y="390" width="220" height="70" rx="14" fill="#3f9d7a" opacity="0.75" />
        <rect x="-320" y="0" width="300" height="620" rx="26" fill="#cde4de" opacity="0.18" transform="skewY(-4)" />
      </g>
      {/* counter */}
      <rect x="0" y="720" width="1600" height="180" fill="#0d2a22" />
      <rect x="0" y="712" width="1600" height="14" fill="#2e6b58" />
      {/* bowl of fruit */}
      <g transform="translate(560 640)">
        <circle cx="-40" cy="10" r="38" fill="url(#apple)" />
        <circle cx="30" cy="0" r="40" fill="url(#orange)" />
        <circle cx="-5" cy="-34" r="32" fill="url(#apple)" />
        <path d="M-5 -66 C0 -80 12 -84 24 -82 C16 -72 8 -68 -5 -66" fill="#8be06a" />
        <path d="M-110 30 L110 30 C100 80 60 96 0 96 C-60 96 -100 80 -110 30 Z" fill="#e9f3ee" />
        <path d="M-110 30 L110 30" stroke="#ffffff" strokeWidth="4" />
      </g>
      {/* carrots and bread */}
      <g transform="translate(800 690)">
        <path d="M0 0 L120 -14 C130 -14 132 2 120 6 Z" fill="#f08a2c" />
        <path d="M-2 -2 C-24 -22 -30 -6 -18 2 C-30 10 -18 18 -2 4" fill="#6fd06a" />
        <path d="M10 22 L126 12 C136 12 136 28 124 30 Z" fill="#f59a3a" />
      </g>
      <g transform="translate(300 690)">
        <path d="M-90 20 C-90 -30 -40 -50 0 -50 C40 -50 90 -30 90 20 Z" fill="#d79a52" />
        <path d="M-50 -20 L-38 0 M-10 -30 L2 -8 M30 -26 L42 -4" stroke="#b8763a" strokeWidth="6" strokeLinecap="round" />
      </g>
      <Fireflies seed={13} count={10} area={[100, 100, 900, 500]} />
    </>
  )
}

function WaterArt() {
  return (
    <>
      <defs>
        <SkyGradient id="water-bg" stops={[[0, '#02121f'], [0.5, '#06344a'], [1, '#0a5a66']]} />
        <linearGradient id="wave1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3fd0c9" stopOpacity="0.9" />
          <stop offset="1" stopColor="#063c4c" />
        </linearGradient>
        <linearGradient id="wave2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1aa3b0" stopOpacity="0.85" />
          <stop offset="1" stopColor="#03222e" />
        </linearGradient>
        <linearGradient id="chrome" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2fbff" />
          <stop offset="0.5" stopColor="#8fb3c2" />
          <stop offset="1" stopColor="#d8eef5" />
        </linearGradient>
        <radialGradient id="drop" cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#3fd0e0" />
        </radialGradient>
        <radialGradient id="water-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#7ff0ff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#7ff0ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#water-bg)" />
      <g className="ambient rays" opacity="0.18">
        <path d="M900 0 L1000 0 L760 900 L560 900 Z" fill="#bff6ff" />
        <path d="M1150 0 L1210 0 L1080 900 L960 900 Z" fill="#bff6ff" />
        <path d="M1350 0 L1420 0 L1400 900 L1250 900 Z" fill="#bff6ff" />
      </g>
      <path d="M0 520 C200 470 400 500 600 470 C800 440 1000 490 1200 460 C1400 430 1500 450 1600 440 L1600 600 L0 600 Z" fill="#0b3a3a" />
      <Pines seed={31} from={-20} to={1640} baseY={560} minH={50} maxH={120} color="#082a2a" />
      {/* tap */}
      <g transform="translate(330 120)">
        <rect x="-140" y="-10" width="120" height="44" rx="10" fill="url(#chrome)" />
        <path d="M-20 0 L60 0 C100 0 120 24 120 60 L120 110 L84 110 L84 64 C84 46 74 36 56 36 L-20 36 Z" fill="url(#chrome)" />
        <rect x="20" y="-46" width="40" height="46" rx="6" fill="url(#chrome)" />
        <rect x="-6" y="-60" width="92" height="18" rx="9" fill="url(#chrome)" />
        <g className="ambient drip">
          <path d="M102 132 C112 150 118 160 118 170 C118 182 110 190 102 190 C94 190 86 182 86 170 C86 160 92 150 102 132 Z" fill="url(#drop)" />
        </g>
      </g>
      <circle cx="432" cy="640" r="160" fill="url(#water-glow)" />
      <g className="ambient ripple" transform="translate(432 650)">
        <ellipse rx="60" ry="14" fill="none" stroke="#bff8ff" strokeWidth="2.5" />
        <ellipse rx="60" ry="14" fill="none" stroke="#bff8ff" strokeWidth="2" style={{ animationDelay: '1.2s' }} />
        <ellipse rx="60" ry="14" fill="none" stroke="#bff8ff" strokeWidth="1.5" style={{ animationDelay: '2.4s' }} />
      </g>
      <g className="ambient wave-a">
        <path d="M-400 640 C-200 600 0 680 200 640 C400 600 600 680 800 640 C1000 600 1200 680 1400 640 C1600 600 1800 680 2000 640 L2000 900 L-400 900 Z" fill="url(#wave2)" />
      </g>
      <g className="ambient wave-b">
        <path d="M-400 720 C-200 690 0 750 200 720 C400 690 600 750 800 720 C1000 690 1200 750 1400 720 C1600 690 1800 750 2000 720 L2000 900 L-400 900 Z" fill="url(#wave1)" opacity="0.85" />
      </g>
      <rect y="820" width="1600" height="80" fill="#021a22" opacity="0.8" />
    </>
  )
}

function EnergyArt() {
  const r = rand(17)
  return (
    <>
      <defs>
        <SkyGradient id="energy-sky" stops={[[0, '#040a1c'], [0.45, '#0f2343'], [0.75, '#2f4b6b'], [0.92, '#d98b52'], [1, '#f0a35e']]} />
        <radialGradient id="window-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffd88a" stopOpacity="0.8" />
          <stop offset="1" stopColor="#ffd88a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="solar" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3b7bd6" />
          <stop offset="1" stopColor="#0e2b66" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#energy-sky)" />
      <Stars count={110} seed={17} maxY={420} />
      <circle cx="260" cy="150" r="44" fill="#f4f1de" />
      <circle cx="280" cy="140" r="40" fill="#0b1c38" opacity="0.92" />
      <path d="M0 640 C220 580 420 620 640 590 C860 560 1080 620 1300 580 C1440 556 1540 570 1600 566 L1600 900 L0 900 Z" fill="#14243a" />
      <Turbine x={1240} y={600} s={0.85} />
      <Turbine x={1360} y={588} s={1} />
      <Turbine x={1480} y={604} s={0.75} />
      {/* power line */}
      <path d="M0 520 C200 560 400 560 560 528" stroke="#5f7a94" strokeWidth="2" fill="none" />
      <path d="M0 540 C200 580 400 580 560 548" stroke="#5f7a94" strokeWidth="2" fill="none" />
      {/* house */}
      <g transform="translate(560 400)">
        <path d="M0 160 L240 0 L480 160 Z" fill="#1d2c45" />
        <g transform="translate(250 30) skewY(33.7)">
          {[0, 1, 2].map((c) =>
            [0, 1].map((rr) => <rect key={`${c}-${rr}`} x={c * 62} y={rr * 46} width="58" height="42" fill="url(#solar)" stroke="#9cc5ff" strokeWidth="1.2" />),
          )}
        </g>
        <rect x="40" y="160" width="400" height="260" fill="#16233a" />
        <rect x="380" y="40" width="34" height="90" fill="#16233a" />
        {[
          [80, 200],
          [200, 200],
          [320, 200],
          [80, 300],
          [320, 300],
        ].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x + 30} cy={y + 34} r="70" fill="url(#window-glow)" className={i % 2 ? 'ambient flicker' : undefined} />
            <rect x={x} y={y} width="60" height="68" rx="3" fill={i === 3 ? '#2a3a55' : '#ffd88a'} />
            <path d={`M${x + 30} ${y} V${y + 68} M${x} ${y + 34} H${x + 60}`} stroke="#16233a" strokeWidth="4" />
          </g>
        ))}
        <rect x="200" y="300" width="70" height="120" rx="4" fill="#0c1526" />
      </g>
      <path d="M0 820 C300 780 600 800 900 790 C1200 780 1400 800 1600 790 L1600 900 L0 900 Z" fill="#081120" />
      <Pines seed={41} from={-20} to={500} baseY={830} minH={90} maxH={200} color="#050c18" />
      <Pines seed={43} from={1100} to={1640} baseY={830} minH={80} maxH={170} color="#050c18" />
      <g className="ambient float">
        {Array.from({ length: 6 }, (_, i) => (
          <circle key={i} cx={600 + r() * 500} cy={300 + r() * 120} r="2" fill="#ffe7a8" opacity="0.6" style={{ animationDelay: `${i}s` }} />
        ))}
      </g>
    </>
  )
}

function ChoicesArt() {
  const branches = [
    'M800 900 C800 760 700 680 560 620',
    'M800 900 C800 760 900 680 1040 620',
    'M560 620 C470 560 420 480 330 430',
    'M560 620 C600 540 620 470 640 400',
    'M1040 620 C1000 540 980 470 960 400',
    'M1040 620 C1130 560 1180 480 1270 430',
    'M330 430 C270 380 240 320 200 260',
    'M1270 430 C1330 380 1360 320 1400 260',
  ]
  const nodes: [number, number][] = [
    [560, 620],
    [1040, 620],
    [330, 430],
    [640, 400],
    [960, 400],
    [1270, 430],
    [200, 260],
    [1400, 260],
  ]
  return (
    <>
      <defs>
        <radialGradient id="choices-bg" cx="0.5" cy="1" r="1">
          <stop offset="0" stopColor="#0f4a43" />
          <stop offset="0.6" stopColor="#061b22" />
          <stop offset="1" stopColor="#030a10" />
        </radialGradient>
        <linearGradient id="branch" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#c6ff7a" />
          <stop offset="1" stopColor="#1fc8b4" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#choices-bg)" />
      <Stars count={60} seed={51} maxY={900} />
      <g fill="none" stroke="url(#branch)" strokeWidth="3" strokeLinecap="round">
        {branches.map((d, i) => (
          <path key={i} d={d} className="ambient draw" style={{ animationDelay: `${i * 0.35}s` }} />
        ))}
      </g>
      {nodes.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="22" fill="#1fc8b4" opacity="0.15" className="ambient pulse" style={{ animationDelay: `${i * 0.4}s` }} />
          <circle cx={x} cy={y} r="7" fill="#d8ff9a" />
        </g>
      ))}
    </>
  )
}

function QuizArt() {
  return (
    <>
      <defs>
        <radialGradient id="quiz-bg" cx="0.75" cy="0.35" r="0.9">
          <stop offset="0" stopColor="#164a5a" />
          <stop offset="0.5" stopColor="#081d2a" />
          <stop offset="1" stopColor="#030912" />
        </radialGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#quiz-bg)" />
      <Stars count={80} seed={61} maxY={900} />
      <g transform="translate(1180 320)" fill="none" strokeLinecap="round">
        <circle r="260" stroke="#1fc8b4" strokeOpacity="0.18" strokeWidth="1.5" />
        <circle r="190" stroke="#1fc8b4" strokeOpacity="0.25" strokeWidth="1.5" strokeDasharray="4 10" />
        <circle r="120" stroke="#c6ff7a" strokeOpacity="0.3" strokeWidth="2" />
        <g className="ambient spin-slow">
          <circle cx="260" cy="0" r="8" fill="#c6ff7a" />
          <circle cx="-190" cy="0" r="6" fill="#1fc8b4" />
          <circle cx="0" cy="120" r="5" fill="#e9fffb" />
        </g>
        <path d="M-60 40 C-60 -40 0 -80 70 -80 C70 -10 30 50 -40 56" fill="#1fc8b4" fillOpacity="0.25" stroke="#c6ff7a" strokeWidth="3" />
      </g>
    </>
  )
}

function ActionArt() {
  return (
    <>
      <defs>
        <SkyGradient id="action-sky" stops={[[0, '#061a24'], [0.45, '#14505a'], [0.72, '#7fb48a'], [0.88, '#f2cf86'], [1, '#ffe0a0']]} />
        <radialGradient id="action-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff8dc" />
          <stop offset="0.3" stopColor="#ffe3a0" stopOpacity="0.8" />
          <stop offset="1" stopColor="#ffd27a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sprout" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#3fae5a" />
          <stop offset="1" stopColor="#c6ff7a" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#action-sky)" />
      <circle className="ambient pulse" cx="800" cy="640" r="320" fill="url(#action-sun)" />
      <circle cx="800" cy="640" r="60" fill="#fff6d6" />
      <path d="M0 640 C200 590 420 630 640 610 C860 590 1080 640 1300 610 C1440 590 1540 600 1600 596 L1600 900 L0 900 Z" fill="#2b6150" />
      {/* village and school */}
      <g fill="#183f36">
        <path d="M200 640 L240 600 L280 640 Z M210 640 H270 V680 H210 Z" />
        <path d="M300 650 L350 600 L400 650 Z M310 650 H390 V690 H310 Z" />
        <path d="M1120 640 H1320 V700 H1120 Z M1100 640 L1220 590 L1340 640 Z" />
        <rect x="1210" y="560" width="20" height="40" />
      </g>
      <g className="ambient float" fill="#183f36">
        <path d="M520 300 q14 -12 28 0 q14 -12 28 0" stroke="#183f36" strokeWidth="3" fill="none" />
        <path d="M600 260 q10 -9 20 0 q10 -9 20 0" stroke="#183f36" strokeWidth="3" fill="none" style={{ animationDelay: '1.5s' }} />
      </g>
      <path d="M0 720 C300 680 560 720 800 700 C1040 680 1300 720 1600 690 L1600 900 L0 900 Z" fill="#163a2f" />
      <Pines seed={71} from={-20} to={420} baseY={760} minH={80} maxH={170} color="#0d2a22" />
      <Pines seed={73} from={1240} to={1640} baseY={760} minH={80} maxH={170} color="#0d2a22" />
      <rect y="760" width="1600" height="140" fill="#0a211b" />
      <g transform="translate(800 790)" className="ambient sway">
        <path d="M0 0 C0 -40 2 -80 0 -120" stroke="url(#sprout)" strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d="M0 -80 C-60 -90 -90 -130 -90 -160 C-40 -160 -6 -130 0 -84" fill="#6fd06a" />
        <path d="M0 -110 C50 -130 90 -170 96 -200 C40 -200 6 -160 0 -114" fill="#9be86a" />
      </g>
      <ellipse cx="800" cy="796" rx="120" ry="16" fill="#3a2a1a" />
    </>
  )
}

const ART: Record<SceneId, () => ReactNode> = {
  home: HomeArt,
  problem: ProblemArt,
  food: FoodArt,
  water: WaterArt,
  energy: EnergyArt,
  choices: ChoicesArt,
  quiz: QuizArt,
  action: ActionArt,
}

interface Props {
  scene: SceneId
  className?: string
}

/** Full-bleed scene backdrop: a photo when one is listed in data/media.ts, otherwise code-drawn art. */
export function SceneArt({ scene, className = '' }: Props) {
  const Art = ART[scene]
  const photo = PHOTOS[scene]
  return (
    <div className={`scene-art ${className}`} aria-hidden="true">
      {photo ? (
        <img src={photo} alt="" className="scene-photo" />
      ) : (
        <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="scene-svg">
          <Art />
        </svg>
      )}
      <div className="scene-shade" />
    </div>
  )
}
