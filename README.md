# Waste Less, Live Better

An interactive, full-screen documentary about reducing waste and using **food, water and energy** responsibly.
School project (French class, 2AS). All site content is in English.

**Small Choices. Big Impact.**

## What is inside

- **8 full-screen scenes**, no page scrolling: Opening, The Cost of Waste, Food, Water, Energy, a decision game, a quiz, and Take Action.
- **Video-style control bar**: play/pause the guided presentation, previous/next, a clickable chapter timeline, elapsed time, replay, mute and full screen.
- **Voice-over** recorded with **Speko** (ElevenLabs voice through the Speko API), stored in `public/audio/scene-1.mp3` … `scene-8.mp3`. Captions follow the narration. If an audio file cannot play, the site falls back to the browser's speech synthesis, then to captions only.
- **Interactive parts**: Smart Kitchen before/after comparison, water and energy hotspots, Water Habit Challenge, wasteful vs. smarter energy routine, a 5-situation decision game, a 6-question quiz, and a commitment checklist.
- **Sign-in and access log**: visitors sign in with their name, role (teacher / student / visitor) and an access code. The site records when they signed in, which chapters they opened, how long they stayed and their quiz score. The project team opens the log at `#/log` with a separate log code.
- Keyboard: `←` `→` change scene, `Space` play/pause, `M` mute, `C` captions, `F` full screen, `Esc` closes panels. Touch: swipe left/right.
- Progress (current scene, commitments, best scores) is saved in the browser with `localStorage`, and can be reset in Settings.
- Respects `prefers-reduced-motion`, with a manual "Reduce motion" switch.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the build
npm run lint
```

## Deploy

The build is a static site (`base: './'`), so it works on any static host.

- **GitHub Pages**: `.github/workflows/deploy.yml` builds and publishes on every push to `main`. Enable it once in the repository: *Settings → Pages → Build and deployment → Source: GitHub Actions*.
- **Netlify / Vercel**: build command `npm run build`, publish directory `dist`.

## Visit log (Supabase)

The log uses a free Supabase project. The schema is in `supabase/schema.sql`:

- `visits` and `app_config` tables with row-level security and no public policies, so the browser cannot read or edit them directly.
- Three functions are exposed: `start_visit` (checks the access code), `touch_visit` (updates chapters, time and quiz score for that visit) and `get_visits` (checks the log code).
- The two codes are stored only as bcrypt hashes in the database. They are **not** in this repository. To change a code, run in the Supabase SQL editor:

```sql
insert into public.app_config values ('access_code', extensions.crypt('NEW-CODE', extensions.gen_salt('bf')))
  on conflict (key) do update set code_hash = excluded.code_hash;
```

(use `log_code` for the log code; codes are compared in upper case).

`src/lib/config.ts` holds the project URL and the **publishable** key, which is designed to be public. Use `VITE_SUPABASE_URL` / `VITE_SUPABASE_KEY` (see `.env.example`) to point at another project.

## Images

Scene backdrops are drawn in code (SVG) so the site works offline and has no licensing issues. To use photos instead, put them in `public/images/` and list them in `src/data/media.ts`, for example `food: 'images/food.jpg'`.

## Sources

Figures are shown with their source in the site's Sources panel:

- UNEP, *Food Waste Index Report 2024*: 1.05 billion tonnes of food wasted in 2022, about 60% from households, food loss and waste linked to 8–10% of global greenhouse gas emissions.
- USGS, *Where is Earth's water?*: about 2.5% of Earth's water is fresh.
- IEA, energy efficiency and electricity generation.
- FAO, food loss and waste platform.

The energy routine comparison is labelled as an illustrative example, not measured data.

## Project structure

```
src/
  components/   App shell: sidebar, top bar, control bar, modal, scene art, login, access log
  scenes/       The 8 scenes
  data/         Scene list and narration, educational content, quiz, game, sources
  hooks/        Guided playback (clock, Speko audio, speech fallback, captions)
  lib/          Visit-log client, storage helpers, config
  styles/       base, layout, scenes
public/audio/   Speko narration
supabase/       Database schema
```
