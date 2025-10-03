// index.js – catalog-only addon with real posters & Torrentio-friendly IDs
const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");

// 1) Minimal IMDb map (add more as you like)
//   Tip: once an IMDb id is set, Torrentio will usually show sources.
//   You can add ids over time—no need to finish all at once.
const IMDB = {
  // title -> imdb id
  "Come Drink with Me (1966)": "tt0061598",
  "The One-Armed Swordsman (1967)": "tt0061590",
  "Golden Swallow (1968)": "tt0064391",
  "Have Sword, Will Travel (1969)": "tt0064377",
  "The Chinese Boxer (1970)": "tt0065573",
  "King Boxer (1972)": "tt0068767", // aka Five Fingers of Death
  "Boxer from Shantung (1972)": "tt0068299",
  "The Fate of Lee Khan (1973)": "tt0070013",
  "Heroes Two (1974)": "tt0071639",
  "Five Shaolin Masters (1974)": "tt0071470",
  "The Magic Blade (1976)": "tt0074858",
  "Killer Clans (1976)": "tt0074764",
  "The Brave Archer (1977)": "tt0075855",
  "Five Deadly Venoms (1978)": "tt0077559",
  "36th Chamber of Shaolin (1978)": "tt0078243",
  "Crippled Avengers (1978)": "tt0079091",
  "The Avenging Eagle (1978)": "tt0077184",
  "The Kid with the Golden Arm (1979)": "tt0081766",
  "Flag of Iron (1980)": "tt0080721",
  "Masked Avengers (1981)": "tt0082717",
  "Legendary Weapons of China (1982)": "tt0084203",
  "Five Element Ninjas (1982)": "tt0083950",
  "Eight Diagram Pole Fighter (1984)": "tt0086128",
  "Hong Kong Godfather (1985)": "tt0091171"
};

// 2) Your catalog (keep growing this; titles without IMDb id still work,
//    but will use placeholder art and Torrentio may show fewer matches)
const RAW = [
  { name: "Come Drink with Me", year: 1966 },
  { name: "The One-Armed Swordsman", year: 1967 },
  { name: "Golden Swallow", year: 1968 },
  { name: "Have Sword, Will Travel", year: 1969 },
  { name: "The Chinese Boxer", year: 1970 },
  { name: "King Boxer", year: 1972 },
  { name: "Boxer from Shantung", year: 1972 },
  { name: "The Fate of Lee Khan", year: 1973 },
  { name: "Heroes Two", year: 1974 },
  { name: "Five Shaolin Masters", year: 1974 },
  { name: "The Magic Blade", year: 1976 },
  { name: "Killer Clans", year: 1976 },
  { name: "The Brave Archer", year: 1977 },
  { name: "Five Deadly Venoms", year: 1978 },
  { name: "36th Chamber of Shaolin", year: 1978 },
  { name: "Crippled Avengers", year: 1978 },
  { name: "The Avenging Eagle", year: 1978 },
  { name: "The Kid with the Golden Arm", year: 1979 },
  { name: "Flag of Iron", year: 1980 },
  { name: "Masked Avengers", year: 1981 },
  { name: "Legendary Weapons of China", year: 1982 },
  { name: "Five Element Ninjas", year: 1982 },
  { name: "Eight Diagram Pole Fighter", year: 1984 },
  { name: "Hong Kong Godfather", year: 1985 }
];

// Helpers
const slug = (t, y) =>
  "sb:" +
  t.toLowerCase()
    .replace(/[':,!.]/g, "")
    .replace(/&/g, "and")
    .replace(/\s+/g, "-") +
  "-" + y;

const posterFromMetahub = (imdb) =>
  `https://images.metahub.space/poster/medium/${imdb}/img`;
const backgroundFromMetahub = (imdb) =>
  `https://images.metahub.space/background/medium/${imdb}/img`;
const placeholderPoster = (name) =>
  `https://placehold.co/300x450/png?text=${encodeURIComponent(name)}`;

// Build items with best IDs for Torrentio
const TITLES = RAW.map(({ name, year }) => {
  const key = `${name} (${year})`;
  const imdb = IMDB[key];
  return {
    // Prefer IMDb as the meta id if available (best for Torrentio)
    id: imdb || slug(name, year),
    type: "movie",
    name,
    year,
    imdb_id: imdb || undefined,
    poster: imdb ? posterFromMetahub(imdb) : placeholderPoster(`${name} (${year})`),
    background: imdb ? backgroundFromMetahub(imdb) : undefined
  };
});

const manifest = {
  id: "org.abugan.shawbrothers",
  version: "1.1.0",
  name: "Shaw Brothers Action Catalog",
  description:
    "Catalog of Shaw Brothers / Celestial action & martial-arts titles with Metahub posters and IMDb IDs for Torrentio.",
  resources: ["catalog", "meta"],
  types: ["movie"],
  catalogs: [
    {
      type: "movie",
      id: "shawbrothers",
      name: "Shaw Brothers Action",
      extra: [{ name: "search" }, { name: "skip" }]
    }
  ],
  idPrefixes: ["tt", "sb:"] // allow imdb tt... and our sb: slugs
};

const builder = new addonBuilder(manifest);

builder.defineCatalogHandler(args => {
  const { type, id, extra = {} } = args || {};
  if (type !== "movie" || id !== "shawbrothers") return Promise.resolve({ metas: [] });

  let results = TITLES;
  if (extra.search) {
    const q = String(extra.search).toLowerCase();
    results = results.filter(m => m.name.toLowerCase().includes(q));
  }

  const skip = Number.parseInt(extra.skip || "0", 10) || 0;
  const pageSize = 50;
  const page = results.slice(skip, skip + pageSize);

  return Promise.resolve({
    metas: page.map(m => ({
      id: m.id,
      type: "movie",
      name: m.name,
      year: m.year,
      poster: m.poster,
      background: m.background
    }))
  });
});

builder.defineMetaHandler(args => {
  const wantedId = (args && args.id) || "";
  const m =
    TITLES.find(x => x.id === wantedId) ||
    TITLES.find(x => x.imdb_id && x.imdb_id === wantedId);

  if (!m) return Promise.resolve({ meta: null });

  return Promise.resolve({
    meta: {
      id: m.id,                // can be tt... or sb:...
      type: "movie",
      name: m.name,
      year: m.year,
      genres: ["Action", "Martial Arts"],
      poster: m.poster,
      background: m.background,
      imdb_id: m.imdb_id       // helps Torrentio resolve matches
    }
  });
});

const addonInterface = builder.getInterface();
const PORT = process.env.PORT || 7000;
serveHTTP(addonInterface, { port: PORT });
console.log(`Shaw addon live on http://localhost:${PORT}/manifest.json`);
