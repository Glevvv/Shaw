// index.js — Large catalog (Render-ready). IMDb where available for posters/Torrentio.
const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');

const manifest = {
  id: 'org.abugan.shawbrothers',
  version: '2.0.0',
  name: 'Shaw Brothers Action — Expanded',
  description: 'Large Shaw Brothers / Celestial action catalog. IMDb IDs used when available for posters and Torrentio.',
  resources: ['catalog', 'meta'],
  types: ['movie'],
  catalogs: [{ type: 'movie', id: 'shawbrothers', name: 'Shaw Brothers Action', extra: [{ name: 'search' }, { name: 'skip' }] }],
  idPrefixes: ['tt', 'sb:']
};

// Load big catalog JSON (bundled in the repo)
const data = require('./catalog.json');
function slug(t, y) {
  return 'sb:' + t.toLowerCase()
    .replace(/[':,!.]/g, '')
    .replace(/&/g, 'and')
    .replace(/\s+/g, '-') + '-' + y;
}
const poster = tt => `https://images.metahub.space/poster/medium/${tt}/img`;
const bg = tt => `https://images.metahub.space/background/medium/${tt}/img`;
const ph = (name, year) => `https://placehold.co/300x450/png?text=${encodeURIComponent(name + ' (' + year + ')')}`;

const TITLES = (data.items || []).map(({ name, year, imdb }) => ({
  id: imdb || slug(name, year),
  type: 'movie',
  name,
  year,
  imdb_id: imdb,
  poster: imdb ? poster(imdb) : ph(name, year),
  background: imdb ? bg(imdb) : undefined
}));

const builder = new addonBuilder(manifest);

builder.defineCatalogHandler((args = {}) => {
  const { type, id, extra = {} } = args;
  if (type !== 'movie' || id !== 'shawbrothers') return Promise.resolve({ metas: [] });
  let list = TITLES;
  if (extra.search) {
    const q = String(extra.search).toLowerCase();
    list = list.filter(m => m.name.toLowerCase().includes(q));
  }
  const skip = parseInt(extra.skip || '0', 10) || 0;
  const pageSize = 50;
  const page = list.slice(skip, skip + pageSize);
  return Promise.resolve({ metas: page.map(m => ({ id: m.id, type: 'movie', name: m.name, year: m.year, poster: m.poster, background: m.background })) });
});

builder.defineMetaHandler((args = {}) => {
  const wanted = args.id;
  const m = TITLES.find(x => x.id === wanted);
  if (!m) return Promise.resolve({ meta: null });
  return Promise.resolve({ meta: { id: m.id, type: 'movie', name: m.name, year: m.year, genres: ['Action','Martial Arts'], poster: m.poster, background: m.background, imdb_id: m.imdb_id } });
});

const addonInterface = builder.getInterface();
const PORT = process.env.PORT || 7000;
serveHTTP(addonInterface, { port: PORT });
console.log(`Shaw Brothers Expanded on http://localhost:${PORT}/manifest.json`);
