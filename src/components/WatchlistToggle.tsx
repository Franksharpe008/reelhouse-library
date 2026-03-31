"use client";

import { useEffect, useState } from "react";
import styles from "./WatchlistToggle.module.css";

const STORAGE_KEY = "reelhouse-watchlist-v1";

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

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const next = raw ? (JSON.parse(raw) as string[]) : [];
      setActive(next.includes(slug));
    } catch {
      setActive(false);
    } finally {
      setReady(true);
    }
  }, [slug]);

  function toggle() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const current = raw ? (JSON.parse(raw) as string[]) : [];
      const next = current.includes(slug)
        ? current.filter((entry) => entry !== slug)
        : [...current, slug];

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setActive(next.includes(slug));
    } catch {
      setActive((previous) => !previous);
    }
  }

  return (
    <button
      aria-pressed={active}
      className={`${styles.button} ${compact ? styles.compact : ""}`}
      data-active={ready && active}
      onClick={toggle}
      type="button"
    >
      <span className={styles.mark}>{active ? "Saved" : "Watchlist"}</span>
      <span className={styles.hint}>{active ? "Stored on this device" : "Save locally"}</span>
    </button>
  );
}
