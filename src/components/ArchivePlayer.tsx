"use client";

import { useEffect, useState } from "react";
import styles from "./ArchivePlayer.module.css";

type Props = { title: string; src: string; poster: string; sourceUrl: string; duration: number };

export function ArchivePlayer({ title, src, poster, sourceUrl, duration }: Props) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<"loading" | "ready" | "slow" | "error">("loading");
  useEffect(() => {
    const timer = setTimeout(() => setState(current => current === "loading" ? "slow" : current), 15000);
    return () => clearTimeout(timer);
  }, [attempt]);
  return (
    <div className={styles.player}>
      <video
        key={`${src}-${attempt}`}
        aria-label={`Watch ${title}`}
        controls
        playsInline
        poster={poster}
        preload="metadata"
        onLoadedMetadata={() => setState("ready")}
        onError={() => setState("error")}
      >
        <source src={src} type="video/mp4" onError={() => setState("error")} />
        Your browser does not support this player. Open the source page below.
      </video>
      <div className={styles.status} role="status" aria-live="polite">
        {state === "ready" ? `${Math.round(duration / 60)} min · Ready to play` : state === "error" ? "The archive stream could not load. Retry or open the source below." : state === "slow" ? "The archive is responding slowly. You can retry or open the source below." : "Connecting to the archive…"}
        {(state === "error" || state === "slow") && <button type="button" onClick={() => { setState("loading"); setAttempt(value => value + 1); }}>Retry stream</button>}
        <a href={sourceUrl} rel="noreferrer" target="_blank">Open archive source ↗</a>
      </div>
    </div>
  );
}
