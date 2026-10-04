# Reelhouse Library

A searchable film and television catalog with a screening room and a watchlist stored on the viewer's device.

**[Open the working site](https://reelhouse-library.vercel.app/)** · [More work by Frank D. Sharpe](https://github.com/Franksharpe008/frank-sharpe-portfolio)

## Problem → implementation

A catalog is useful when people can find a title, inspect it, and return to a saved choice. Reelhouse connects those steps through search, format and genre filters, title pages, an embedded screening room, and local watchlist controls.

## Try it in one minute

1. Search for **His Girl Friday**. The catalog narrows to that title and updates the screening room.
2. Open the title details to see its description and source links.
3. Save the title to the watchlist, then reload. The saved state remains on this browser/device.
4. Clear search and try the **Serial** or **Noir** filters.

Search and watchlist persistence were checked on the deployed site on October 4, 2026. Embedded media is supplied by external sources; playback availability is separate from the catalog's functionality.

## Technical decisions

- **Next.js, React, and TypeScript:** route-based title pages with interactive catalog controls.
- **Deferred search:** applies a title, summary, logline, and genre query without treating input as a server search request.
- **Local storage:** saves watchlist selections on this device; no account or cross-device synchronization is claimed.
- **CSS modules:** keeps component styling scoped.

Relevant files: `src/components/CatalogExplorer.tsx`, `src/components/WatchlistToggle.tsx`, `src/app/title/[slug]/page.tsx`, and `src/lib/catalog.ts`.

## Run locally

Use a Node.js version supported by the checked-in Next.js release, then:

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`. Available checks: `npm run lint` and `npm run build`; serve a completed build with `npm run start`.

## Scope

This is a portfolio application, not a streaming subscription service. It does not supply user accounts, licensed commercial distribution, or a hosted watchlist database. External media rights and availability belong to their respective sources.

Created through AI-assisted development directed by Frank D. Sharpe, with emphasis on understandable interaction, saved state, and a working deployed experience.
