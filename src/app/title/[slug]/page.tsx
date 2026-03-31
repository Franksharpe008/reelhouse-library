import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PosterMedia } from "@/components/PosterMedia";
import { WatchlistToggle } from "@/components/WatchlistToggle";
import { catalog, catalogBySlug } from "@/lib/catalog";
import styles from "./page.module.css";

type DetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return catalog.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: DetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = catalogBySlug[slug];

  if (!item) {
    return { title: "Title not found | Reelhouse Library" };
  }

  return {
    title: `${item.title} | Reelhouse Library`,
    description: item.summary,
  };
}

export default async function TitleDetailPage({ params }: DetailPageProps) {
  const { slug } = await params;
  const item = catalogBySlug[slug];

  if (!item) {
    notFound();
  }

  const related = catalog
    .filter(
      (entry) =>
        entry.slug !== item.slug &&
        entry.genres.some((genre) => item.genres.includes(genre)),
    )
    .slice(0, 4);

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <Link className={styles.back} href="/">
          Back to Reelhouse
        </Link>
        <span className={styles.headerTag}>{item.genres.slice(0, 2).join(" / ")}</span>
      </header>

      <section className={styles.hero}>
        <div className={styles.posterBlock}>
          <PosterMedia
            alt={`${item.title} poster`}
            className={styles.poster}
            height={980}
            priority
            sizes="(max-width: 900px) 80vw, 24vw"
            src={item.posterUrl}
            style={
              item.posterPosition ? { objectPosition: item.posterPosition } : undefined
            }
            width={680}
          />
        </div>

        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>On the wall</span>
          <h1 className={styles.title}>{item.title}</h1>
          <div className={styles.meta}>
            <span>{item.year}</span>
            <span>{item.format}</span>
            <span>{item.genres.join(" / ")}</span>
          </div>
          <p className={styles.logline}>{item.logline}</p>
          <p className={styles.summary}>{item.summary}</p>
          <p className={styles.note}>{item.programNote}</p>
          <div className={styles.actions}>
            {item.watchUrl !== item.trailerUrl ? (
              <a
                className={styles.primary}
                href={item.watchUrl}
                rel="noreferrer"
                target="_blank"
              >
                {item.watchLabel}
              </a>
            ) : null}
            <a
              className={styles.secondary}
              href={item.trailerUrl}
              rel="noreferrer"
              target="_blank"
            >
              YouTube trailer
            </a>
            <WatchlistToggle slug={item.slug} />
          </div>
        </div>
      </section>

      <section className={styles.playerSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>In the room</span>
          <h2 className={styles.sectionTitle}>Watch in place</h2>
        </div>
        {item.embedUrl ? (
          <div className={styles.playerFrame}>
            <iframe
              allow="autoplay; fullscreen"
              allowFullScreen
              src={item.embedUrl}
              title={`${item.title} player`}
            />
          </div>
        ) : (
          <div className={styles.playerFallback}>
            <strong>{item.title}</strong>
            <p>
              This title opens outside the room, but it still keeps its place
              on the wall.
            </p>
            <a
              className={styles.secondary}
              href={item.trailerUrl}
              rel="noreferrer"
              target="_blank"
            >
              Watch the trailer
            </a>
          </div>
        )}
      </section>

      <section className={styles.relatedSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>Keep browsing</span>
          <h2 className={styles.sectionTitle}>More in the same band</h2>
        </div>
        <div className={styles.relatedGrid}>
          {related.map((entry) => (
            <article className={styles.relatedCard} key={entry.slug}>
              <Link href={`/title/${entry.slug}`}>
                <PosterMedia
                  alt={`${entry.title} poster`}
                  className={styles.relatedPoster}
                  height={820}
                  sizes="(max-width: 900px) 45vw, 18vw"
                  src={entry.posterUrl}
                  style={
                    entry.posterPosition
                      ? { objectPosition: entry.posterPosition }
                      : undefined
                  }
                  width={560}
                />
              </Link>
              <div className={styles.relatedBody}>
                <span className={styles.relatedMeta}>
                  {entry.year} · {entry.genres.slice(0, 2).join(" / ")}
                </span>
                <Link className={styles.relatedTitle} href={`/title/${entry.slug}`}>
                  {entry.title}
                </Link>
                <p className={styles.relatedCopy}>{entry.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
