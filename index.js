const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');

const manifest = {
  id: 'org.abugan.shawbrothers',
  version: '1.0.1',
  name: 'Shaw Brothers Action Catalog',
  description: 'Catalog of Shaw Brothers / Celestial action & martial-arts titles.',
  resources: ['catalog', 'meta'],
  types: ['movie'],
  catalogs: [
    { type: 'movie', id: 'shawbrothers', name: 'Shaw Brothers Action', extra: [ { name: 'search' }, { name: 'skip' } ] }
  ],
  idPrefixes: ['sb:']
};

const builder = new addonBuilder(manifest);

function posterFor(name) {
  return 'https://placehold.co/300x450/png?text=' + encodeURIComponent(name);
}

const TITLES = [
  { id: 'sb:come-drink-with-me-1966', type: 'movie', name: 'Come Drink with Me', year: 1966 },
  { id: 'sb:the-one-armed-swordsman-1967', type: 'movie', name: 'The One-Armed Swordsman', year: 1967 },
  { id: 'sb:golden-swallow-1968', type: 'movie', name: 'Golden Swallow', year: 1968 },
  { id: 'sb:have-sword-will-travel-1969', type: 'movie', name: 'Have Sword, Will Travel', year: 1969 },
  { id: 'sb:the-chinese-boxer-1970', type: 'movie', name: 'The Chinese Boxer', year: 1970 },
  { id: 'sb:king-boxer-1972', type: 'movie', name: 'King Boxer', year: 1972 },
  { id: 'sb:boxer-from-shantung-1972', type: 'movie', name: 'Boxer from Shantung', year: 1972 },
  { id: 'sb:five-deadly-venoms-1978', type: 'movie', name: 'Five Deadly Venoms', year: 1978 },
  { id: 'sb:36th-chamber-of-shaolin-1978', type: 'movie', name: '36th Chamber of Shaolin', year: 1978 },
  { id: 'sb:crippled-avengers-1978', type: 'movie', name: 'Crippled Avengers', year: 1978 }
].map(m => ({ ...m, poster: posterFor(m.name) }));

builder.defineCatalogHandler(args => {
  const type = args.type;
  const id = args.id;
  const extra = args.extra || {};
  if (type !== 'movie' || id !== 'shawbrothers') return Promise.resolve({ metas: [] });
  let results = TITLES;
  if (extra.search) {
    const q = String(extra.search).toLowerCase();
    results = results.filter(m => m.name.toLowerCase().includes(q));
  }
  const skip = Number.parseInt(extra.skip || '0', 10) || 0;
  const pageSize = 50;
  const page = results.slice(skip, skip + pageSize);
  return Promise.resolve({ metas: page.map(m => ({ id: m.id, type: 'movie', name: m.name, poster: m.poster, year: m.year })) });
});

builder.defineMetaHandler(args => {
  const wantedId = args.id;
  const m = TITLES.find(x => x.id === wantedId);
  if (!m) return Promise.resolve({ meta: null });
  return Promise.resolve({ meta: { id: m.id, type: 'movie', name: m.name, poster: m.poster, year: m.year, genres: ['Action','Martial Arts'], description: 'Shaw Brothers action title (catalog-only).' } });
});

const addonInterface = builder.getInterface();
const PORT = process.env.PORT || 7000;
serveHTTP(addonInterface, { port: PORT });
console.log(`Shaw Brothers addon running on http://localhost:${PORT}/manifest.json`);
