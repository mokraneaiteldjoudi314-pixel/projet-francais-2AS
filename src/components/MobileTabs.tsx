interface Props {
  pane: 'main' | 'side'
  onChange: (pane: 'main' | 'side') => void
  mainLabel: string
  sideLabel: string
}

/** On small screens, split scenes show one pane at a time instead of scrolling. */
export function MobileTabs({ pane, onChange, mainLabel, sideLabel }: Props) {
  return (
    <div className="mobile-tabs segmented" role="tablist" aria-label="Scene sections">
      <button role="tab" aria-selected={pane === 'main'} className={pane === 'main' ? 'is-on good' : ''} onClick={() => onChange('main')}>
        {mainLabel}
      </button>
      <button role="tab" aria-selected={pane === 'side'} className={pane === 'side' ? 'is-on good' : ''} onClick={() => onChange('side')}>
        {sideLabel}
      </button>
    </div>
  )
}
