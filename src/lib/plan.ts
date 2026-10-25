import { COMMITMENTS } from '../data/content'

function joinList(items: string[]) {
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}

/** One-sentence plan built from the chosen commitments. */
export function planSummary(ids: string[]) {
  const chosen = COMMITMENTS.filter((c) => ids.includes(c.id)).map((c) => c.short)
  if (!chosen.length) return ''
  const pace = chosen.length >= 4 ? 'Start with one, then add the others week by week.' : 'Repeat it every day until it becomes automatic.'
  return `This week, I will ${joinList(chosen)}. ${pace}`
}
