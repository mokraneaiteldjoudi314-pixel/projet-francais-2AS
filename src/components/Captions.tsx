interface Props {
  text: string
  visible: boolean
}

export function CaptionsLine({ text, visible }: Props) {
  if (!visible || !text) return null
  return (
    <div className="captions" aria-live="polite">
      <span>{text}</span>
    </div>
  )
}
