# Waste Less, Live Better

An interactive, full-screen documentary about reducing waste and using **food, water and energy** responsibly.
School project (French class, 2AS). All site content is in English.

**Small Choices. Big Impact.**

## What is inside

- **One screen, no scrolling**: a dashboard with a sidebar, a search bar, a large cinematic hero, an "Our Planet Today" / "Key Facts" panel, seven topic cards and a video-style player bar. Choosing a topic changes the content inside the same screen.
- **A 10-minute guided tour** in 8 chapters: Introduction, Food, Water, Energy, Reduce & Recycle, Mini Game, Quiz and Take Action. The full narration lasts exactly 10:00.
- **Voice-over** recorded with **Speko** (ElevenLabs voice through the Speko API), stored in `public/audio/scene-1.mp3` … `scene-8.mp3`. Captions follow the narration, and the facts panel and the "Practical action" carousel light up when the voice reaches them. If an audio file cannot play, the site falls back to the browser's speech synthesis, then to captions only. Sound only starts after the visitor presses play.
- **Player bar**: play/pause, a draggable 10-minute timeline with chapter markers (also keyboard-controllable), elapsed time, sound, captions, settings, full screen, "Scene x/8" and previous/next chapter.
- **Interactive parts**: search (chapters, tips, facts, game and quiz), a practical-action carousel per topic, a 5-situation mini game, a 6-question quiz, a "Build My Plan" overlay that generates a personal plan, and a dismissible Quick Tip card.
- **Photos** generated with AI through the **Figma** connector (`public/images/`). The workflow `.github/workflows/fetch-images.yml` downloads the generated images listed in `scripts/image-sources.json` and commits them, because the generator's links expire after 7 days.
- **Sign-in and access log**: visitors sign in with their name, role (teacher / student / visitor) and an access code. The site records when they signed in, which chapters they opened, how long they stayed and their quiz score. The project team opens the log at `#/log` (also linked from About) with a separate log code.
- **Responsive**: designed for 1920×1080, 1536×960, 1366×768, 1280×720, 1024×768 (compact sidebar), 768×1024 (stacked panels), and phones (390×844, 320×568, 844×390), where Watch / Facts / Explore tabs show one section at a time.
- Keyboard: `←` `→` change chapter, `Space` play/pause, `/` search, `M` sound, `C` captions, `F` full screen, `Esc` closes panels.
- Progress (chapter, plan, best scores) is saved in the browser with `localStorage` and can be reset in Settings. Respects `prefers-reduced-motion`, with a manual "Reduce motion" switch.

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

The nine photos in `public/images/` were generated for this project with AI (Figma image generation). To replace one, keep the same file name (`hero`, `food`, `water`, `energy`, `recycle`, `game`, `quiz`, `mountain`, `problem`) or update `scripts/image-sources.json` with new image links: the "Fetch generated images" workflow downloads them and commits the JPEGs.

## Sources

Figures are shown with their source in the site's Sources panel:

- UNEP, *Food Waste Index Report 2024*: 1.05 billion tonnes of food wasted in 2022, about 60% from households, food loss and waste linked to 8–10% of global greenhouse gas emissions.
- USGS, *Where is Earth's water?*: about 2.5% of Earth's water is fresh.
- IEA, energy efficiency and electricity generation.
- FAO, food loss and waste platform.

The quick tips and practical actions are general advice and contain no invented statistics.

## Project structure

```
src/
  components/   Shell: sidebar, top bar + search, side panel, cards, player bar, plan overlay, login, access log
  scenes/       Hero content: home, topic (food/water/energy/reuse), game, quiz, take action
  data/         Chapters and narration, facts, tips, quiz, game, sources
  hooks/        Guided playback (clock, Speko audio, seeking, speech fallback, captions)
  lib/          Visit-log client, storage helpers, plan summary, config
  styles/       base, dashboard (layout + responsive), auth
public/audio/   Speko narration (10:00 in total)
public/images/  AI-generated photos
supabase/       Database schema
```
