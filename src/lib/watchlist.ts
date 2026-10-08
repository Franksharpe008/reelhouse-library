export const WATCHLIST_KEY = "reelhouse-watchlist-v1";
export const WATCHLIST_CHANGED = "reelhouse-watchlist-changed";

type WatchlistStorage = Pick<Storage, "getItem" | "setItem">;

export function readWatchlist(storage: WatchlistStorage): string[] {
  const raw = storage.getItem(WATCHLIST_KEY);
  if (raw === null) return [];
  const value: unknown = JSON.parse(raw);
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== "string")) {
    throw new Error("Invalid watchlist data");
  }
  return [...new Set(value)];
}

export function toggleWatchlist(storage: WatchlistStorage, slug: string): string[] {
  const current = readWatchlist(storage);
  const next = current.includes(slug)
    ? current.filter((entry) => entry !== slug)
    : [...current, slug];
  // A write must succeed before any control reports the title as saved.
  storage.setItem(WATCHLIST_KEY, JSON.stringify(next));
  return next;
}
