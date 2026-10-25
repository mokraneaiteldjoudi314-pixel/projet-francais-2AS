import { Brain, Droplets, Flag, Home, Recycle, Route, UtensilsCrossed, Zap, type LucideIcon } from 'lucide-react'
import type { SceneId } from '../data/scenes'

export const SCENE_ICONS: Record<SceneId, LucideIcon> = {
  home: Home,
  problem: Recycle,
  food: UtensilsCrossed,
  water: Droplets,
  energy: Zap,
  choices: Route,
  quiz: Brain,
  action: Flag,
}
