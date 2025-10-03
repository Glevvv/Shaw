// index.js — Shaw Brothers only (clean whitelist, real posters, IMDb IDs)
const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");

const SB = [
  // VERIFIED SHAW BROTHERS TITLES + IMDb
  { n: "Come Drink with Me",                 y: 1966, tt: "tt0059079" },
  { n: "The One-Armed Swordsman",           y: 1967, tt: "tt0061597" },
  { n: "Golden Swallow",                     y: 1968, tt: "tt0063105" },
  { n: "Have Sword, Will Travel",            y: 1969, tt: "tt0064067" },
  { n: "The Chinese Boxer",                  y: 1970, tt: "tt0065999" }, // aka The Hammer of God
  { n: "King Boxer (Five Fingers of Death)", y: 1972, tt: "tt0070800" },
  { n: "The Boxer from Shantung",            y: 1972, tt: "tt0068310" },
  { n: "The Fate of Lee Khan",               y: 1973, tt: "tt0070942" },
  { n: "Heroes Two",                         y: 1974, tt: "tt0070051" },
  { n: "Five Shaolin Masters",               y: 1974, tt: "tt0072991" },
  { n: "Shaolin Martial Arts",               y: 1974, tt: "tt0071619" },
  { n: "The Magic Blade",                    y: 1976, tt: "tt0075329" },
  { n: "Killer Clans",                       y: 1976, tt: "tt0074745" },
  { n: "The Dragon Missile",                 y: 1976, tt: "tt0074521" },
  { n: "The Brave Archer",                   y: 1977, tt: "tt0075855" }, // optional but SB
  { n: "Five Deadly Venoms",                 y: 1978, tt: "tt0077559" },
  { n: "The 36th Chamber of Shaolin",        y: 1978, tt: "tt0078243" },
  { n: "Crippled Avengers",                  y: 1978, tt: "tt0077292" },
  { n: "The Avenging Eagle",                 y: 1978, tt: "tt0077868" },
  { n: "The Kid with the Golden Arm",        y: 1979, tt: "tt0079372" },
  { n: "Flag of Iron",                       y: 1980, tt: "tt0080721" }, // optional SB
  { n: "Masked Avengers",                    y: 1981, tt: "tt0082717" },
  { n: "Legendary Weapons of China",         y: 1982, tt: "tt0084203" },
  { n: "Five Element Ninjas",                y: 1982, tt: "tt0083950" },
  { n: "Eight Diagram Pole Fighter",         y: 1984, tt: "tt0086128" },
  { n: "Hong Kong Godfather",                y: 1985, tt: "tt0091171" }
];

// helpers
const poster = tt => `https://images.metahub.space/poster/medium/${tt}/img`;
const backdrop = tt => `https://images.metahub.space/background/medium/${tt}/img`;

// build strict catalog (IDs = IMDb for best Torrentio matching)
const TITLES = SB.map(x => ({
  id: x.tt,          // tt... helps Torrentio line up sources
  type: "movie",
  name: x.n,
  year: x.y,
  poster: poster(x.tt),
  background: backdrop(x.tt),
  imdb_id: x.tt
}));

const manifest = {
  id: "org.abugan.shawbrothers",
  version: "1.2.0",
  name: "Shaw Brothers Action — Clean",
  description: "Curated Shaw Brothers only. Posters via Metahub. IMDb IDs for Torrentio.",
  resources: ["catalog", "meta"],
  types: ["movie"],
  catalogs: [
    { type: "movie", id: "shawbrothers", name: "Shaw Brothers Action", extra: [{ name: "search" }, { name: "skip" }] }
  ],
  idPrefixes: ["tt"] // ONLY allow imdb ids to avoid stray titles
};

const builder = new addonBuilder(manifest);

builder.defineCatalogHandler((args = {}) => {
  const { type, id, extra = {} } = args;
  if (type !== "movie" || id !== "shawbrothers") return Promise.resolve({ metas: [] });

  let list = TITLES;
  if (extra.search) {
    const q = String(extra.search).toLowerCase();
    list = list.filter(m => m.name.toLowerCase().includes(q));
  }

  const skip = parseInt(extra.skip || "0", 10) || 0;
  const pageSize = 50;
  const page = list.slice(skip, skip + pageSize);

  return Promise.resolve({
    metas: page.map(m => ({ id: m.id, type: "movie", name: m.name, year: m.year, poster: m.poster, background: m.background }))
  });
});

builder.defineMetaHandler((args = {}) => {
  const m = TITLES.find(x => x.id === args.id);
  if (!m) return Promise.resolve({ meta: null });
  return Promise.resolve({
    meta: {
      id: m.id,
      type: "movie",
      name: m.name,
      year: m.year,
      genres: ["Action", "Martial Arts"],
      poster: m.poster,
      background: m.background,
      imdb_id: m.imdb_id
    }
  });
});

const addonInterface = builder.getInterface();
const PORT = process.env.PORT || 7000;
serveHTTP(addonInterface, { port: PORT });
console.log(`Shaw Brothers addon (clean) on http://localhost:${PORT}/manifest.json`);
