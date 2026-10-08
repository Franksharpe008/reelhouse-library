"use client";

import { useEffect, useId, useState } from "react";
import styles from "./WatchlistToggle.module.css";
import { readWatchlist, toggleWatchlist, WATCHLIST_CHANGED, WATCHLIST_KEY } from "../lib/watchlist";

type WatchlistToggleProps = {
  slug: string;
  compact?: boolean;
};

export function WatchlistToggle({
  slug,
  compact = false,
}: WatchlistToggleProps) {
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const errorId = useId();

  useEffect(() => {
    function refresh() {
      try {
        setActive(readWatchlist(window.localStorage).includes(slug));
        setError("");
      } catch {
        setError("Device storage is unavailable or unreadable. Your watchlist has not changed.");
      } finally {
        setReady(true);
      }
    }
    function onStorage(event: StorageEvent) {
      if (event.key === WATCHLIST_KEY || event.key === null) refresh();
    }
    refresh();
    window.addEventListener(WATCHLIST_CHANGED, refresh);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(WATCHLIST_CHANGED, refresh);
      window.removeEventListener("storage", onStorage);
    };
  }, [slug]);

  function toggle() {
    try {
      const next = toggleWatchlist(window.localStorage, slug);
      setActive(next.includes(slug));
      setError("");
      window.dispatchEvent(new Event(WATCHLIST_CHANGED));
    } catch {
      setError("Could not save on this device. Your watchlist has not changed.");
    }
  }

  return (
    <><button
      aria-pressed={active}
      aria-label={`${active ? "Remove" : "Save"} ${slug.replaceAll("-", " ")} ${active ? "from" : "to"} watchlist`}
      aria-describedby={error ? errorId : undefined}
      disabled={!ready}
      className={`${styles.button} ${compact ? styles.compact : ""}`}
      data-active={ready && active}
      onClick={toggle}
      type="button"
    >
      <span className={styles.mark}>{active ? "Saved" : "Watchlist"}</span>
      <span className={styles.hint}>{active ? "Stored on this device" : "Save locally"}</span>
    </button>
    {error && <span id={errorId} role="status" className={styles.error}>{error}</span>}
    </>
  );
}
