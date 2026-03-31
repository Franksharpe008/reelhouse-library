import type { CSSProperties } from "react";
import Image from "next/image";

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
  if (src.startsWith("data:")) {
    // The generated SVG posters are data URLs, so `next/image` does not add value here.
    return (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={alt}
          className={className}
          height={height}
          loading={priority ? "eager" : "lazy"}
          src={src}
          style={style}
          width={width}
        />
      </>
    );
  }

  return (
    <Image
      alt={alt}
      className={className}
      height={height}
      priority={priority}
      sizes={sizes}
      src={src}
      style={style}
      unoptimized
      width={width}
    />
  );
}
