"use client";

import Link from "next/link";
import { startTransition, useDeferredValue, useState } from "react";
import type { CatalogItem, EditorialLane } from "@/lib/catalog";
import { PosterMedia } from "./PosterMedia";
import { WatchlistToggle } from "./WatchlistToggle";
import styles from "./CatalogExplorer.module.css";

type CatalogExplorerProps = {
  featuredSlug: string;
  genres: string[];
  heroStackSlugs: string[];
  items: CatalogItem[];
  lanes: EditorialLane[];
};

const FORMAT_TABS = ["All", "Feature", "Serial"] as const;
const MARQUEE_ITEMS = [
  "late-show energy",
  "hard-boiled favorites",
  "couch-movie comedies",
  "graveyard shift",
  "midnight weirdness",
  "old-TV detours",
  "silent-era stunts",
  "quick-talk classics",
];

function scrollToScreeningRoom() {
  document.getElementById("screening-room")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

export function CatalogExplorer({
  featuredSlug,
  genres,
  heroStackSlugs,
  items,
  lanes,
}: CatalogExplorerProps) {
  const [query, setQuery] = useState("");
  const [activeFormat, setActiveFormat] =
    useState<(typeof FORMAT_TABS)[number]>("All");
  const [activeGenre, setActiveGenre] = useState("All");
  const [screeningSlug, setScreeningSlug] = useState(featuredSlug);
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const filteredItems = items
    .filter((item) => {
      const haystack = [item.title, item.summary, item.logline, ...item.genres]
        .join(" ")
        .toLowerCase();

      const matchesQuery =
        deferredQuery.length === 0 || haystack.includes(deferredQuery);

      const matchesFormat =
        activeFormat === "All" ? true : item.format === activeFormat;

      const matchesGenre =
        activeGenre === "All" ? true : item.genres.includes(activeGenre);

      return matchesQuery && matchesFormat && matchesGenre;
    })
    .sort((left, right) => left.ranking - right.ranking);

  const screenableItems = filteredItems.filter((item) => Boolean(item.embedUrl));

  const screeningItem =
    screenableItems.find((item) => item.slug === screeningSlug) ??
    screenableItems[0] ??
    items.find((item) => item.slug === featuredSlug) ??
    items[0];

  const heroStackItems = heroStackSlugs
    .map((slug) => items.find((item) => item.slug === slug))
    .filter(Boolean) as CatalogItem[];

  const laneGroups = lanes
    .map((lane) => ({
      ...lane,
      items: lane.slugs
        .map((slug) => filteredItems.find((item) => item.slug === slug))
        .filter(Boolean) as CatalogItem[],
    }))
    .filter((lane) => lane.items.length > 0);

  const frontRow = laneGroups.find((lane) => lane.id === "front-row");
  const remainingLanes = laneGroups.filter((lane) => lane.id !== "front-row");

  const roomReadyCount = filteredItems.filter((item) => Boolean(item.embedUrl)).length;
  const featureCount = filteredItems.filter((item) => item.format === "Feature").length;
  const laneCount = laneGroups.length;
  const serialCount = filteredItems.filter((item) => item.format === "Serial").length;

  function selectForScreening(slug: string) {
    const nextItem = items.find((item) => item.slug === slug);
    if (!nextItem?.embedUrl) {
      return;
    }

    startTransition(() => setScreeningSlug(slug));
    scrollToScreeningRoom();
  }

  return (
    <main className={styles.shell} id="top">
      <header className={styles.header}>
        <div className={styles.brandBlock}>
          <span className={styles.brandKicker}>Late Show</span>
          <Link className={styles.brand} href="/">
            Reelhouse Library
          </Link>
          <p className={styles.brandNote}>
            A room for neighborhood favorites, midnight pulls, old-TV detours,
            and the kind of movies people still quote by heart.
          </p>
        </div>
        <nav className={styles.nav} aria-label="Primary">
          <a href="#screening-room">Room</a>
          <a href="#front-row">Front Row</a>
          <a href="#after-hours">After Hours</a>
          <a href="#all-titles">Full Shelf</a>
        </nav>
      </header>

      <section className={styles.marqueeBand} aria-label="Lineup">
        <div className={styles.marqueeTrack}>
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, index) => (
            <span className={styles.marqueeItem} key={`${item}-${index}`}>
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.sectionEyebrow}>Tonight&apos;s Pull</span>
          <h1 className={styles.heroTitle}>Leave this room running.</h1>
          <p className={styles.heroCopyText}>
            Quick-talk classics, all-night horror, hard-case noir, and old-TV
            comfort built to keep the next pick easy.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primaryLink} href="#screening-room">
              Start the room
            </a>
            <a className={styles.secondaryLink} href="#all-titles">
              Browse the shelf
            </a>
          </div>
          <div className={styles.statRow}>
            <div className={styles.statCard}>
              <strong>{filteredItems.length}</strong>
              <span>on the shelf</span>
            </div>
            <div className={styles.statCard}>
              <strong>{roomReadyCount}</strong>
              <span>ready in room</span>
            </div>
            <div className={styles.statCard}>
              <strong>{featureCount}</strong>
              <span>feature runs</span>
            </div>
            <div className={styles.statCard}>
              <strong>{laneCount}</strong>
              <span>curated lanes</span>
            </div>
            <div className={styles.statCard}>
              <strong>{serialCount}</strong>
              <span>episode runs</span>
            </div>
          </div>
        </div>

        <div className={styles.posterStack}>
          {heroStackItems.map((item, index) => (
            <div className={styles.posterCard} data-index={index} key={item.slug}>
              <PosterMedia
                alt={`${item.title} poster`}
                className={styles.posterImage}
                height={960}
                priority={index === 0}
                sizes="(max-width: 900px) 70vw, 28vw"
                src={item.posterUrl}
                style={
                  item.posterPosition
                    ? { objectPosition: item.posterPosition }
                    : undefined
                }
                width={640}
              />
              <div className={styles.posterCaption}>
                <span>{item.year}</span>
                <strong>{item.title}</strong>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.controls}>
        <div className={styles.searchBlock}>
          <label className={styles.filterLabel} htmlFor="catalog-search">
            Search by title, vibe, or genre
          </label>
          <input
            className={styles.searchInput}
            id="catalog-search"
            onChange={(event) => {
              const nextValue = event.target.value;
              startTransition(() => setQuery(nextValue));
            }}
            placeholder="Search love stories, chaos, horror, comedy, serial..."
            type="search"
            value={query}
          />
        </div>

        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Format</span>
          <div className={styles.chips}>
            {FORMAT_TABS.map((format) => (
              <button
                className={styles.chip}
                data-active={activeFormat === format}
                key={format}
                onClick={() => setActiveFormat(format)}
                type="button"
              >
                {format}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Genre</span>
          <div className={styles.chips}>
            <button
              className={styles.chip}
              data-active={activeGenre === "All"}
              onClick={() => setActiveGenre("All")}
              type="button"
            >
              All
            </button>
            {genres.map((genre) => (
              <button
                className={styles.chip}
                data-active={activeGenre === genre}
                key={genre}
                onClick={() => setActiveGenre(genre)}
                type="button"
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.screeningRoom} id="screening-room">
        <div className={styles.playerStage} key={screeningItem.slug}>
          <div className={styles.playerFrame}>
            {screeningItem.embedUrl ? (
              <iframe
                allow="autoplay; fullscreen"
                allowFullScreen
                src={screeningItem.embedUrl}
                title={`${screeningItem.title} player`}
              />
            ) : (
              <div className={styles.playerFallback}>
                <span className={styles.sectionEyebrow}>Queued up</span>
                <strong>{screeningItem.title}</strong>
                <p>
                  This one opens outside the room, but it still keeps its spot
                  on the shelf.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className={styles.screeningMeta} key={`${screeningItem.slug}-meta`}>
          <span className={styles.sectionEyebrow}>Now Up</span>
          <h2 className={styles.screeningTitle}>{screeningItem.title}</h2>
          <div className={styles.metaRow}>
            <span>{screeningItem.year}</span>
            <span>{screeningItem.format}</span>
            <span>{screeningItem.genres.join(" / ")}</span>
          </div>
          <p className={styles.screeningLogline}>{screeningItem.logline}</p>
          <p className={styles.screeningSummary}>{screeningItem.summary}</p>
          <p className={styles.programNote}>{screeningItem.programNote}</p>
          <div className={styles.screeningActions}>
            <Link
              className={styles.primaryLink}
              href={`/title/${screeningItem.slug}`}
            >
              Open details
            </Link>
            {screeningItem.watchUrl !== screeningItem.trailerUrl ? (
              <a
                className={styles.secondaryLink}
                href={screeningItem.watchUrl}
                rel="noreferrer"
                target="_blank"
              >
                {screeningItem.watchLabel}
              </a>
            ) : null}
            <a
              className={styles.secondaryLink}
              href={screeningItem.trailerUrl}
              rel="noreferrer"
              target="_blank"
            >
              YouTube trailer
            </a>
            <WatchlistToggle slug={screeningItem.slug} />
          </div>
        </div>
      </section>

      {frontRow ? (
        <section className={styles.railSection} id="front-row">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>{frontRow.eyebrow}</span>
            <div>
              <h2 className={styles.sectionTitle}>{frontRow.title}</h2>
              <p className={styles.sectionCopy}>{frontRow.blurb}</p>
            </div>
          </div>
          <div className={styles.horizontalRail}>
            {frontRow.items.map((item, index) => (
              <article
                className={styles.railCard}
                data-active={screeningItem.slug === item.slug}
                key={item.slug}
              >
                <div className={styles.rankBadge}>
                  {String(index + 1).padStart(2, "0")}
                </div>
                <Link className={styles.cardPosterLink} href={`/title/${item.slug}`}>
                  <PosterMedia
                    alt={`${item.title} poster`}
                    className={styles.cardPoster}
                    height={920}
                    sizes="(max-width: 900px) 70vw, 18vw"
                    src={item.posterUrl}
                    style={
                      item.posterPosition
                        ? { objectPosition: item.posterPosition }
                        : undefined
                    }
                    width={620}
                  />
                </Link>
                <div className={styles.cardBody}>
                  <span className={styles.cardMeta}>
                    {item.year} · {item.genres.slice(0, 2).join(" / ")}
                  </span>
                  <Link className={styles.cardTitle} href={`/title/${item.slug}`}>
                    {item.title}
                  </Link>
                  <p className={styles.cardSummary}>{item.summary}</p>
                  <div className={styles.cardActions}>
                    {item.embedUrl ? (
                      <button
                        className={styles.playButton}
                        onClick={() => selectForScreening(item.slug)}
                        type="button"
                      >
                        Play in room
                      </button>
                    ) : (
                      <Link className={styles.playButton} href={`/title/${item.slug}`}>
                        Open detail
                      </Link>
                    )}
                    <a
                      className={styles.detailLink}
                      href={item.trailerUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      YouTube trailer
                    </a>
                    <WatchlistToggle compact slug={item.slug} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {remainingLanes.map((lane) => (
        <section className={styles.railSection} id={lane.id} key={lane.id}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>{lane.eyebrow}</span>
            <div>
              <h2 className={styles.sectionTitle}>{lane.title}</h2>
              <p className={styles.sectionCopy}>{lane.blurb}</p>
            </div>
          </div>
          <div className={styles.horizontalRail}>
            {lane.items.map((item) => (
              <article
                className={styles.railCard}
                data-active={screeningItem.slug === item.slug}
                key={item.slug}
              >
                <Link className={styles.cardPosterLink} href={`/title/${item.slug}`}>
                  <PosterMedia
                    alt={`${item.title} poster`}
                    className={styles.cardPoster}
                    height={920}
                    sizes="(max-width: 900px) 70vw, 18vw"
                    src={item.posterUrl}
                    style={
                      item.posterPosition
                        ? { objectPosition: item.posterPosition }
                        : undefined
                    }
                    width={620}
                  />
                </Link>
                <div className={styles.cardBody}>
                  <span className={styles.cardMeta}>
                    {item.year} · {item.genres.slice(0, 2).join(" / ")}
                  </span>
                  <Link className={styles.cardTitle} href={`/title/${item.slug}`}>
                    {item.title}
                  </Link>
                  <p className={styles.cardSummary}>{item.summary}</p>
                  <div className={styles.cardActions}>
                    {item.embedUrl ? (
                      <button
                        className={styles.playButton}
                        onClick={() => selectForScreening(item.slug)}
                        type="button"
                      >
                        Play in room
                      </button>
                    ) : (
                      <Link className={styles.playButton} href={`/title/${item.slug}`}>
                        Open detail
                      </Link>
                    )}
                    <a
                      className={styles.detailLink}
                      href={item.trailerUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      YouTube trailer
                    </a>
                    <WatchlistToggle compact slug={item.slug} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

      <section className={styles.catalogSection} id="all-titles">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>Full Shelf</span>
          <div>
            <h2 className={styles.sectionTitle}>Everything stays within reach</h2>
            <p className={styles.sectionCopy}>
              Deep cuts, crowd-pleasers, old-TV breaks, and the kind of lineup
              that still feels good when the room has been on for hours.
            </p>
          </div>
        </div>

        {filteredItems.length > 0 ? (
          <div className={styles.allGrid}>
            {filteredItems.map((item) => (
              <article
                className={styles.gridCard}
                data-active={screeningItem.slug === item.slug}
                key={item.slug}
              >
                <Link className={styles.gridPosterLink} href={`/title/${item.slug}`}>
                  <PosterMedia
                    alt={`${item.title} poster`}
                    className={styles.gridPoster}
                    height={760}
                    sizes="(max-width: 900px) 45vw, 16vw"
                    src={item.posterUrl}
                    style={
                      item.posterPosition
                        ? { objectPosition: item.posterPosition }
                        : undefined
                    }
                    width={520}
                  />
                </Link>
                <div className={styles.gridBody}>
                  <span className={styles.cardMeta}>
                    {item.year} · {item.genres.join(" / ")}
                  </span>
                  <Link className={styles.cardTitle} href={`/title/${item.slug}`}>
                    {item.title}
                  </Link>
                  <p className={styles.cardSummary}>{item.summary}</p>
                  <div className={styles.cardActions}>
                    {item.embedUrl ? (
                      <button
                        className={styles.playButton}
                        onClick={() => selectForScreening(item.slug)}
                        type="button"
                      >
                        Play in room
                      </button>
                    ) : (
                      <Link className={styles.playButton} href={`/title/${item.slug}`}>
                        Open detail
                      </Link>
                    )}
                    <a
                      className={styles.detailLink}
                      href={item.trailerUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      YouTube trailer
                    </a>
                    <Link className={styles.detailLink} href={`/title/${item.slug}`}>
                      Details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            Nothing matches that pull right now. Clear the filters and the whole
            shelf comes back.
          </div>
        )}
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div>
            <span className={styles.sectionEyebrow}>Last Call</span>
            <h2 className={styles.footerTitle}>Keep something good queued.</h2>
          </div>
          <a className={styles.footerBack} href="#top">
            Back to top
          </a>
        </div>
        <div className={styles.footerGrid}>
          <div className={styles.footerColumn}>
            <strong className={styles.footerLabel}>Start here</strong>
            <a href="#screening-room">Jump into the room</a>
            <a href="#front-row">See the front row</a>
            <a href="#all-titles">Open the full shelf</a>
          </div>
          <div className={styles.footerColumn}>
            <strong className={styles.footerLabel}>Move around</strong>
            <a href="#after-hours">After hours</a>
            <a href="#hard-case">Hard case</a>
            <a href="#signal-room">Signal room</a>
          </div>
          <div className={styles.footerColumn}>
            <strong className={styles.footerLabel}>Always ready</strong>
            <p className={styles.footerCopy}>
              Every title keeps a detail page, a trailer button, and a spot on
              the local watchlist.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
