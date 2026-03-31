import { catalogSeed } from "./catalog-data";

type Format = "Feature" | "Serial";

type ArchiveSeed = (typeof catalogSeed)[number];

type BaseItem = {
  slug: string;
  title: string;
  year: number;
  format: Format;
  genres: readonly string[];
  ranking: number;
  posterUrl: string;
  posterPosition?: string;
  summary: string;
  watchUrl: string;
  embedUrl: string | null;
  trailerUrl: string;
  watchLabel: string;
  logline: string;
  programNote: string;
  playbackMode: "full-feature" | "profile";
};

export type CatalogItem = BaseItem;

export type EditorialLane = {
  id: string;
  eyebrow: string;
  title: string;
  blurb: string;
  slugs: string[];
};

function buildArchiveWatch(archiveId: string) {
  return `https://archive.org/details/${archiveId}`;
}

function buildArchiveEmbed(archiveId: string) {
  return `https://archive.org/embed/${archiveId}`;
}

function buildYouTubeSearch(query: string) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

function cleanDisplayTitle(title: string) {
  return title.replace(/\s*\([^)]*\)\s*$/u, "").trim();
}

function cleanSummary(summary: string) {
  const next = summary.replace(/\.\.\.\s*$/u, "").trim();
  if (!next) {
    return summary.trim();
  }

  return /[.!?]$/u.test(next) ? next : `${next}.`;
}

function buildLogline(summary: string) {
  const firstSentence = summary.split(". ")[0]?.trim();
  if (!firstSentence) {
    return summary;
  }

  return firstSentence.endsWith(".") ? firstSentence : `${firstSentence}.`;
}

function buildProgramNote(item: {
  format: Format;
  genres: readonly string[];
  title: string;
}) {
  if (item.format === "Serial") {
    return `${item.title} changes the rhythm of the room and gives the shelf that leave-it-on channel energy.`;
  }

  if (item.genres.includes("Horror") || item.genres.includes("Cult")) {
    return `${item.title} belongs in the late slot, when the room wants shadows, texture, and a little danger.`;
  }

  if (item.genres.includes("Noir") || item.genres.includes("Crime")) {
    return `${item.title} keeps the shelf sharp with double-crosses, cigarette-burn tension, and somebody making the wrong call.`;
  }

  if (item.genres.includes("Comedy") || item.genres.includes("Newsroom")) {
    return `${item.title} keeps things moving with quick mouths, bright timing, and the kind of pace that wakes the whole room up.`;
  }

  if (item.genres.includes("Silent") || item.genres.includes("Action")) {
    return `${item.title} still feels electric because the movement does the talking long before the edit has to.`;
  }

  if (item.genres.includes("Western") || item.genres.includes("Road")) {
    return `${item.title} gives the shelf more open road and harder edges so the whole lineup does not sit in one lane.`;
  }

  return `${item.title} keeps the lineup broad, human, and worth drifting through for another hour.`;
}

function normalizeArchive(seed: ArchiveSeed): CatalogItem {
  const title = cleanDisplayTitle(seed.title);
  const summary = cleanSummary(seed.summary);

  return {
    slug: seed.slug,
    title,
    year: seed.year,
    format: seed.format,
    genres: [...seed.genres],
    ranking: seed.ranking,
    posterUrl: seed.posterUrl,
    summary,
    watchUrl: buildArchiveWatch(seed.archiveId),
    embedUrl: buildArchiveEmbed(seed.archiveId),
    trailerUrl: buildYouTubeSearch(`${title} official trailer`),
    watchLabel: "Open source page",
    logline: buildLogline(summary),
    programNote: buildProgramNote({ format: seed.format, genres: seed.genres, title }),
    playbackMode: "full-feature",
  };
}

export const catalog: CatalogItem[] = [...catalogSeed]
  .map(normalizeArchive)
  .sort((left, right) => left.ranking - right.ranking);

export const catalogBySlug = Object.fromEntries(
  catalog.map((item) => [item.slug, item]),
) as Record<string, CatalogItem>;

export const featuredSlug = "night-of-the-living-dead";

export const heroStackSlugs = [
  "night-of-the-living-dead",
  "his-girl-friday",
  "scarlet-street",
];

export const editorialLanes: EditorialLane[] = [
  {
    id: "front-row",
    eyebrow: "Front Row",
    title: "The picks that set the room off fast",
    blurb:
      "Big silhouettes, quick recognition, and enough range to make the whole shelf feel alive before anybody starts searching.",
    slugs: [
      "night-of-the-living-dead",
      "his-girl-friday",
      "doa",
      "scarlet-street",
      "the-little-shop-of-horrors",
      "the-general",
      "carnival-of-souls",
      "the-stranger",
    ],
  },
  {
    id: "after-hours",
    eyebrow: "After Hours",
    title: "Graveyard shift, cult charge, and lights-low pull",
    blurb:
      "The late section leans eerie, strange, and beautifully haunted, built for when the room settles in instead of tapping out.",
    slugs: [
      "night-of-the-living-dead",
      "carnival-of-souls",
      "the-last-man-on-earth",
      "plan-9-from-outer-space",
      "the-brain-that-wouldnt-die",
      "manos-the-hands-of-fate",
      "house-on-haunted-hill",
      "the-phantom-of-the-opera",
    ],
  },
  {
    id: "hard-case",
    eyebrow: "Hard Case",
    title: "Noir pressure, bad decisions, and cold-blooded timing",
    blurb:
      "This shelf runs on hustle, paranoia, and people talking themselves deeper into trouble with every scene.",
    slugs: [
      "doa",
      "scarlet-street",
      "detour",
      "the-hitch-hiker",
      "kansas-city-confidential",
      "the-stranger",
      "bluebeard",
      "the-fast-and-the-furious",
    ],
  },
  {
    id: "signal-room",
    eyebrow: "Signal Room",
    title: "Old television comfort with real station-flip energy",
    blurb:
      "When the room needs a different pace, these serials and shows keep everything loose without breaking the mood.",
    slugs: [
      "the-abbott-and-costello-show",
      "one-step-beyond",
      "the-lucy-show",
      "the-phantom-creeps",
      "the-beverly-hillbillies",
      "dragnet",
    ],
  },
];

export const genreList = Array.from(
  new Set(catalog.flatMap((item) => item.genres)),
).sort();
