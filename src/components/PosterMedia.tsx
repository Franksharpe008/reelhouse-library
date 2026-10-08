"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import styles from "./PosterMedia.module.css";

type PosterMediaProps = {
  alt: string;
  className: string;
  height: number;
  priority?: boolean;
  sizes?: string;
  src: string;
  style?: CSSProperties;
  width: number;
};

export function PosterMedia({
  alt,
  className,
  height,
  priority = false,
  sizes,
  src,
  style,
  width,
}: PosterMediaProps) {
  const [wide, setWide] = useState(false);
  const [failed, setFailed] = useState(false);
  const title = alt.replace(/ poster$/u, "");
  return (
    <span className={`${className} ${styles.frame}`} style={style}>
    {!failed && (
    <Image
      alt={alt}
      height={height}
      priority={priority}
      sizes={sizes}
      src={src}
      style={{ width: "100%", height: wide ? "76%" : "100%", position: "absolute", inset: 0, objectFit: wide ? "cover" : "contain", objectPosition: style?.objectPosition }}
      onLoad={event => setWide(event.currentTarget.naturalWidth > event.currentTarget.naturalHeight * 1.1)}
      onError={() => setFailed(true)}
      unoptimized
      width={width}
    />
    )}
    {(wide || failed) && <span className={styles.title}><small>REELHOUSE COLLECTION</small><strong>{title}</strong></span>}
    </span>
  );
}
