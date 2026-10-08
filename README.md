# Reelhouse Library

A searchable film and television catalog with a screening room and a watchlist stored on the viewer's device.

**[Open the working site](https://reelhouse-library.vercel.app/)** · [More work by Frank D. Sharpe](https://github.com/Franksharpe008/frank-sharpe-portfolio)

## Problem → implementation

A catalog is useful when people can find a title, inspect it, and return to a saved choice. Reelhouse connects those steps through search, format and genre filters, title pages, an in-page screening room, and local watchlist controls.

## Try it in one minute

1. Search for **His Girl Friday**. The catalog narrows to that title and updates the screening room.
2. Open the title details to see its description and source links.
3. Save the title to the watchlist, then reload. The saved state remains on this browser/device.
4. Clear search and try the **Serial** or **Noir** filters.

Search and watchlist persistence were checked on the deployed site on October 4, 2026. Movies and episodes stream from external archive sources; playback needs an internet connection.

## Technical decisions

- **Next.js, React, and TypeScript:** route-based title pages with interactive catalog controls.
- **Deferred search:** applies a title, summary, logline, and genre query without treating input as a server search request.
- **Local storage:** saves watchlist selections on this device; no account or cross-device synchronization is claimed.
- **CSS modules:** keeps component styling scoped.

Relevant files: `src/components/CatalogExplorer.tsx`, `src/components/WatchlistToggle.tsx`, `src/app/title/[slug]/page.tsx`, and `src/lib/catalog.ts`.

## Run locally

Use Node.js 22.18 or newer (the small test suite uses native TypeScript stripping), then:

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`. Available checks: `npm test`, `npm run lint` and `npm run build`; serve a completed build with `npm run start`.

## Scope

This is a portfolio application, not a streaming subscription service. It does not supply user accounts, licensed commercial distribution, or a hosted watchlist database. External media rights and availability belong to their respective sources.

Created through AI-assisted development directed by Frank D. Sharpe, with emphasis on understandable interaction, saved state, and a working deployed experience.

## October 8 watchlist correction

All save buttons for a title now synchronize in the same tab and respond to storage changes. A failed write shows feedback without claiming the title was saved; invalid stored data is preserved rather than silently overwritten. Three focused tests, lint and the production build passed. Browser checks confirmed three controls updating together, persistence after reload and successful removal.

## October 8 cover and playback repair

All 30 titles now have cover images bundled in `public/posters/`, with source credits. Archived film stills use a consistent title treatment; image failures retain a readable cover instead of a broken image icon. Browsing covers no longer requires Wikimedia or Archive image requests.

Six catalog sources were short promotional clips rather than full films/episodes. They were replaced with full-length sources. All 30 selected MP4 files passed byte-range checks, and the catalog records their runtime. An accessible native player replaces fragile embedded frames and provides loading, slow-source, failure and retry feedback plus a source link. Trailer search links are labeled as searches.

Tests verify that every cover exists, every source is an Archive MP4, runtimes exclude the old short clips, and watchlist saves preserve existing choices. Lint and the production build passed. Browser checks confirmed playback for the repaired Little Shop of Horrors source; file reachability checks do not guarantee future availability or establish redistribution rights for every external source.
