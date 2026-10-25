import type { SceneId } from './scenes'

/**
 * Optional photos for scene backdrops. Put an image in public/images/ and list it
 * here, for example `food: 'images/food.jpg'`. Scenes without a photo use the
 * code-drawn illustration from components/SceneArt.tsx.
 */
export const PHOTOS: Partial<Record<SceneId, string>> = {}
