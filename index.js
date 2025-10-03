// index.js — No-blanks build: only IMDb-verified titles are shown.
const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');

const manifest = {
  id: 'org.abugan.shawbrothers',
  version: '2.1.0',
  name: 'Shaw Brothers Action — No Blanks',
  description: 'Only IMDb-verified Shaw Brothers titles. Posters via Metahub. Great Torrentio matching.',
  resources: ['catalog', 'meta'],
  types: ['movie'],
  catalogs: [{ type: 'movie', id: 'shawbrothers', name: 'Shaw Brothers Action', extra: [{ name: 'search' }, { name: 'skip' }] }],
  idPrefixes: ['tt']
};

const data = require('./catalog.json');
const poster = tt => `https://images.metahub.space/poster/medium/${tt}/img`;
const background = tt => `https://images.metahub.space/background/medium/${tt}/img`;

// Only keep entries that have an IMDb id to avoid blanks
const TITLES = (data.items || []).filter(x => !!x.imdb).map(({ name, year, imdb }) => ({
  id: imdb,
  type: 'movie',
  name,
  year,
  poster: poster(imdb),
  background: background(imdb),
  imdb_id: imdb
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
  const m = TITLES.find(x => x.id === args.id);
  if (!m) return Promise.resolve({ meta: null });
  return Promise.resolve({ meta: { id: m.id, type: 'movie', name: m.name, year: m.year, genres: ['Action','Martial Arts'], poster: m.poster, background: m.background, imdb_id: m.imdb_id } });
});

const addonInterface = builder.getInterface();
const PORT = process.env.PORT || 7000;
serveHTTP(addonInterface, { port: PORT });
console.log(`Shaw Brothers (no blanks) on http://localhost:${PORT}/manifest.json`);
