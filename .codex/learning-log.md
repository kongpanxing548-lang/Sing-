# Codex Learning Log


## 2026-04-21 11:26 +08:00 - Initialized Codex enhancement skills

Created local skills for self-improvement, Windows remote control workflows, and multi-agent coordination. Prefer project-local memory unless global behavior is requested.

## 2026-04-22 02:10 +08:00 - Continued Next.js Sing Walking development

Git clone from GitHub over the smart HTTP remote was unstable on this machine, but the branch archive from `codeload.github.com` worked. Treat the repository root Next.js app as the active development line; `sing-walking-v5/` is the earlier static prototype/reference. Unified track content in `content/tracks.ts`, migrated Journey scroll sync into the Next.js page, and verified with `npm run build`.

## 2026-04-22 23:16 +08:00 - Added static music detail routes

Added `/music/[slug]` pages with `generateStaticParams` because the app uses `output: export`. Avoid running `next dev` and `next build` against the same configured `distDir` at the same time; this project uses `dist`, so stop dev or clear `dist` between modes if module cache errors appear.

## 2026-04-23 01:20 +08:00 - Mobile and SEO pass

Root metadata now uses `content/site.ts`; music and Journey pages define canonical, Open Graph, and Twitter card metadata. On mobile, hide the waveform and volume controls in the fixed player to prevent horizontal overflow; keep bottom padding on content pages so the player does not cover the final content. Use headless Chrome screenshots in `artifacts/phase3/` for quick mobile checks.

## 2026-04-26 00:19 +08:00 - Replaced temporary media with real assets

Real song assets live in `/Users/sing/Desktop/行走 WALKING`. Convert source WAV files to web MP3s before shipping to the site, and copy provided cover art into `public/images/covers`. For tracks without dedicated cover images, use a real local fallback cover instead of external placeholder art. `content/tracks.ts` and `content/journey.ts` are now the source of truth for the real catalog.

## 2026-04-26 01:48 +08:00 - Refreshed cover art from new desktop assets

Added newly provided artwork for `时间里的故事`, `如果`, `回归`, `听见悲伤`, `You are beautiful`, and `黑暗中的挣扎` from `/Users/sing/Desktop/行走 WALKING`, resized them into `public/images/covers`, and updated `content/tracks.ts` to stop using the shared default cover for those tracks.
