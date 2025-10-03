const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");

const manifest = {
  id: "org.abugan.shawbrothers",
  version: "1.0.0",
  name: "Shaw Brothers Action Catalog",
  description: "Catalog of Shaw Brothers / Celestial Pictures action & martial-arts titles.",
  resources: ["catalog", "meta"],
  types: ["movie"],
  catalogs: [
    {
      type: "movie",
      id: "shawbrothers",
      name: "Shaw Brothers Action",
      extra: [
        { name: "search", isRequired: false },
        { name: "skip", isRequired: false }
      ]
    }
  ],
  idPrefixes: ["sb:"]
};

const { addonBuilder: Builder } = require("stremio-addon-sdk");
const builder = new Builder(manifest);

function posterFor(name) {
  const txt = encodeURIComponent(name);
  return `https://placehold.co/300x450/png?text=${txt}`;
}

const TITLES = [
  {
    "id": "sb:temple-of-the-red-lotus-1965",
    "type": "movie",
    "name": "Temple of the Red Lotus",
    "year": 1965
  },
  {
    "id": "sb:the-twin-swords-1965",
    "type": "movie",
    "name": "The Twin Swords",
    "year": 1965
  },
  {
    "id": "sb:come-drink-with-me-1966",
    "type": "movie",
    "name": "Come Drink with Me",
    "year": 1966
  },
  {
    "id": "sb:the-one-armed-swordsman-1967",
    "type": "movie",
    "name": "The One-Armed Swordsman",
    "year": 1967
  },
  {
    "id": "sb:golden-swallow-1968",
    "type": "movie",
    "name": "Golden Swallow",
    "year": 1968
  },
  {
    "id": "sb:have-sword-will-travel-1969",
    "type": "movie",
    "name": "Have Sword, Will Travel",
    "year": 1969
  },
  {
    "id": "sb:the-invincible-fist-1969",
    "type": "movie",
    "name": "The Invincible Fist",
    "year": 1969
  },
  {
    "id": "sb:the-return-of-the-one-armed-swordsman-1969",
    "type": "movie",
    "name": "The Return of the One-Armed Swordsman",
    "year": 1969
  },
  {
    "id": "sb:the-flying-dagger-1969",
    "type": "movie",
    "name": "The Flying Dagger",
    "year": 1969
  },
  {
    "id": "sb:the-chinese-boxer-1970",
    "type": "movie",
    "name": "The Chinese Boxer",
    "year": 1970
  },
  {
    "id": "sb:the-heroic-ones-1970",
    "type": "movie",
    "name": "The Heroic Ones",
    "year": 1970
  },
  {
    "id": "sb:the-duel-1971",
    "type": "movie",
    "name": "The Duel",
    "year": 1971
  },
  {
    "id": "sb:the-new-one-armed-swordsman-1971",
    "type": "movie",
    "name": "The New One-Armed Swordsman",
    "year": 1971
  },
  {
    "id": "sb:king-boxer-1972",
    "type": "movie",
    "name": "King Boxer",
    "year": 1972
  },
  {
    "id": "sb:boxer-from-shantung-1972",
    "type": "movie",
    "name": "Boxer from Shantung",
    "year": 1972
  },
  {
    "id": "sb:man-of-iron-1972",
    "type": "movie",
    "name": "Man of Iron",
    "year": 1972
  },
  {
    "id": "sb:angry-guest-1972",
    "type": "movie",
    "name": "Angry Guest",
    "year": 1972
  },
  {
    "id": "sb:the-black-enforcer-1972",
    "type": "movie",
    "name": "The Black Enforcer",
    "year": 1972
  },
  {
    "id": "sb:the-devils-mirror-1972",
    "type": "movie",
    "name": "The Devil's Mirror",
    "year": 1972
  },
  {
    "id": "sb:the-four-riders-1972",
    "type": "movie",
    "name": "The Four Riders",
    "year": 1972
  },
  {
    "id": "sb:thunderbolt-fist-1972",
    "type": "movie",
    "name": "Thunderbolt Fist",
    "year": 1972
  },
  {
    "id": "sb:finger-of-doom-1972",
    "type": "movie",
    "name": "Finger of Doom",
    "year": 1972
  },
  {
    "id": "sb:the-14-amazons-1972",
    "type": "movie",
    "name": "The 14 Amazons",
    "year": 1972
  },
  {
    "id": "sb:the-imperial-swordsman-1972",
    "type": "movie",
    "name": "The Imperial Swordsman",
    "year": 1972
  },
  {
    "id": "sb:intimate-confessions-of-a-chinese-courtesan-1972",
    "type": "movie",
    "name": "Intimate Confessions of a Chinese Courtesan",
    "year": 1972
  },
  {
    "id": "sb:the-lizard-1972",
    "type": "movie",
    "name": "The Lizard",
    "year": 1972
  },
  {
    "id": "sb:the-deadly-knives-1972",
    "type": "movie",
    "name": "The Deadly Knives",
    "year": 1972
  },
  {
    "id": "sb:the-fate-of-lee-khan-1973",
    "type": "movie",
    "name": "The Fate of Lee Khan",
    "year": 1973
  },
  {
    "id": "sb:the-lady-professional-1973",
    "type": "movie",
    "name": "The Lady Professional",
    "year": 1973
  },
  {
    "id": "sb:the-iron-bodyguard-1973",
    "type": "movie",
    "name": "The Iron Bodyguard",
    "year": 1973
  },
  {
    "id": "sb:the-blood-brothers-1973",
    "type": "movie",
    "name": "The Blood Brothers",
    "year": 1973
  },
  {
    "id": "sb:heroes-two-1974",
    "type": "movie",
    "name": "Heroes Two",
    "year": 1974
  },
  {
    "id": "sb:men-from-the-monastery-1974",
    "type": "movie",
    "name": "Men from the Monastery",
    "year": 1974
  },
  {
    "id": "sb:five-shaolin-masters-1974",
    "type": "movie",
    "name": "Five Shaolin Masters",
    "year": 1974
  },
  {
    "id": "sb:shaolin-martial-arts-1974",
    "type": "movie",
    "name": "Shaolin Martial Arts",
    "year": 1974
  },
  {
    "id": "sb:the-savage-five-1974",
    "type": "movie",
    "name": "The Savage Five",
    "year": 1974
  },
  {
    "id": "sb:the-tea-house-1974",
    "type": "movie",
    "name": "The Tea House",
    "year": 1974
  },
  {
    "id": "sb:big-brother-cheng-1975",
    "type": "movie",
    "name": "Big Brother Cheng",
    "year": 1975
  },
  {
    "id": "sb:the-criminals-1976",
    "type": "movie",
    "name": "The Criminals",
    "year": 1976
  },
  {
    "id": "sb:the-shaolin-avengers-1976",
    "type": "movie",
    "name": "The Shaolin Avengers",
    "year": 1976
  },
  {
    "id": "sb:challenge-of-the-masters-1976",
    "type": "movie",
    "name": "Challenge of the Masters",
    "year": 1976
  },
  {
    "id": "sb:the-magic-blade-1976",
    "type": "movie",
    "name": "The Magic Blade",
    "year": 1976
  },
  {
    "id": "sb:killer-clans-1976",
    "type": "movie",
    "name": "Killer Clans",
    "year": 1976
  },
  {
    "id": "sb:web-of-death-1976",
    "type": "movie",
    "name": "Web of Death",
    "year": 1976
  },
  {
    "id": "sb:the-dragon-missile-1976",
    "type": "movie",
    "name": "The Dragon Missile",
    "year": 1976
  },
  {
    "id": "sb:7-man-army-1976",
    "type": "movie",
    "name": "7-Man Army",
    "year": 1976
  },
  {
    "id": "sb:shaolin-temple-1976",
    "type": "movie",
    "name": "Shaolin Temple",
    "year": 1976
  },
  {
    "id": "sb:the-last-tempest-1976",
    "type": "movie",
    "name": "The Last Tempest",
    "year": 1976
  },
  {
    "id": "sb:the-sentimental-swordsman-1977",
    "type": "movie",
    "name": "The Sentimental Swordsman",
    "year": 1977
  },
  {
    "id": "sb:the-battle-wizard-1977",
    "type": "movie",
    "name": "The Battle Wizard",
    "year": 1977
  },
  {
    "id": "sb:the-brave-archer-1977",
    "type": "movie",
    "name": "The Brave Archer",
    "year": 1977
  },
  {
    "id": "sb:death-duel-1977",
    "type": "movie",
    "name": "Death Duel",
    "year": 1977
  },
  {
    "id": "sb:the-chinatown-kid-1977",
    "type": "movie",
    "name": "The Chinatown Kid",
    "year": 1977
  },
  {
    "id": "sb:the-brave-archer-2-1978",
    "type": "movie",
    "name": "The Brave Archer 2",
    "year": 1978
  },
  {
    "id": "sb:legend-of-the-bat-1978",
    "type": "movie",
    "name": "Legend of the Bat",
    "year": 1978
  },
  {
    "id": "sb:heaven-sword-and-dragon-sabre-1978",
    "type": "movie",
    "name": "Heaven Sword and Dragon Sabre",
    "year": 1978
  },
  {
    "id": "sb:heaven-sword-and-dragon-sabre-part-ii-1978",
    "type": "movie",
    "name": "Heaven Sword and Dragon Sabre Part II",
    "year": 1978
  },
  {
    "id": "sb:the-proud-youth-1978",
    "type": "movie",
    "name": "The Proud Youth",
    "year": 1978
  },
  {
    "id": "sb:soul-of-the-sword-1978",
    "type": "movie",
    "name": "Soul of the Sword",
    "year": 1978
  },
  {
    "id": "sb:the-avenging-eagle-1978",
    "type": "movie",
    "name": "The Avenging Eagle",
    "year": 1978
  },
  {
    "id": "sb:five-deadly-venoms-1978",
    "type": "movie",
    "name": "Five Deadly Venoms",
    "year": 1978
  },
  {
    "id": "sb:invincible-shaolin-1978",
    "type": "movie",
    "name": "Invincible Shaolin",
    "year": 1978
  },
  {
    "id": "sb:crippled-avengers-1978",
    "type": "movie",
    "name": "Crippled Avengers",
    "year": 1978
  },
  {
    "id": "sb:heroes-of-the-east-1978",
    "type": "movie",
    "name": "Heroes of the East",
    "year": 1978
  },
  {
    "id": "sb:36th-chamber-of-shaolin-1978",
    "type": "movie",
    "name": "36th Chamber of Shaolin",
    "year": 1978
  },
  {
    "id": "sb:shaolin-mantis-1978",
    "type": "movie",
    "name": "Shaolin Mantis",
    "year": 1978
  },
  {
    "id": "sb:shaolin-handlock-1978",
    "type": "movie",
    "name": "Shaolin Handlock",
    "year": 1978
  },
  {
    "id": "sb:swordsman-and-the-enchantress-1978",
    "type": "movie",
    "name": "Swordsman and the Enchantress",
    "year": 1978
  },
  {
    "id": "sb:the-kid-with-the-golden-arm-1979",
    "type": "movie",
    "name": "The Kid with the Golden Arm",
    "year": 1979
  },
  {
    "id": "sb:magnificent-ruffians-1979",
    "type": "movie",
    "name": "Magnificent Ruffians",
    "year": 1979
  },
  {
    "id": "sb:shaolin-rescuers-1979",
    "type": "movie",
    "name": "Shaolin Rescuers",
    "year": 1979
  },
  {
    "id": "sb:the-daredevils-1979",
    "type": "movie",
    "name": "The Daredevils",
    "year": 1979
  },
  {
    "id": "sb:the-deadly-breaking-sword-1979",
    "type": "movie",
    "name": "The Deadly Breaking Sword",
    "year": 1979
  },
  {
    "id": "sb:flag-of-iron-1980",
    "type": "movie",
    "name": "Flag of Iron",
    "year": 1980
  },
  {
    "id": "sb:the-rebel-intruders-1980",
    "type": "movie",
    "name": "The Rebel Intruders",
    "year": 1980
  },
  {
    "id": "sb:two-champions-of-shaolin-1980",
    "type": "movie",
    "name": "Two Champions of Shaolin",
    "year": 1980
  },
  {
    "id": "sb:ten-tigers-of-kwangtung-1980",
    "type": "movie",
    "name": "Ten Tigers of Kwangtung",
    "year": 1980
  },
  {
    "id": "sb:heroes-shed-no-tears-1980",
    "type": "movie",
    "name": "Heroes Shed No Tears",
    "year": 1980
  },
  {
    "id": "sb:masked-avengers-1981",
    "type": "movie",
    "name": "Masked Avengers",
    "year": 1981
  },
  {
    "id": "sb:martial-club-1981",
    "type": "movie",
    "name": "Martial Club",
    "year": 1981
  },
  {
    "id": "sb:my-young-auntie-1981",
    "type": "movie",
    "name": "My Young Auntie",
    "year": 1981
  },
  {
    "id": "sb:the-emperor-and-his-brother-1981",
    "type": "movie",
    "name": "The Emperor and His Brother",
    "year": 1981
  },
  {
    "id": "sb:the-sword-stained-with-royal-blood-1981",
    "type": "movie",
    "name": "The Sword Stained with Royal Blood",
    "year": 1981
  },
  {
    "id": "sb:return-of-the-sentimental-swordsman-1981",
    "type": "movie",
    "name": "Return of the Sentimental Swordsman",
    "year": 1981
  },
  {
    "id": "sb:the-duel-of-the-century-1981",
    "type": "movie",
    "name": "The Duel of the Century",
    "year": 1981
  },
  {
    "id": "sb:mercenaries-from-hong-kong-1982",
    "type": "movie",
    "name": "Mercenaries from Hong Kong",
    "year": 1982
  },
  {
    "id": "sb:legendary-weapons-of-china-1982",
    "type": "movie",
    "name": "Legendary Weapons of China",
    "year": 1982
  },
  {
    "id": "sb:cat-vs-rat-1982",
    "type": "movie",
    "name": "Cat vs. Rat",
    "year": 1982
  },
  {
    "id": "sb:perils-of-the-sentimental-swordsman-1982",
    "type": "movie",
    "name": "Perils of the Sentimental Swordsman",
    "year": 1982
  },
  {
    "id": "sb:five-element-ninjas-1982",
    "type": "movie",
    "name": "Five Element Ninjas",
    "year": 1982
  },
  {
    "id": "sb:shaolin-prince-1982",
    "type": "movie",
    "name": "Shaolin Prince",
    "year": 1982
  },
  {
    "id": "sb:shaolin-abbot-1982",
    "type": "movie",
    "name": "Shaolin Abbot",
    "year": 1982
  },
  {
    "id": "sb:house-of-traps-1982",
    "type": "movie",
    "name": "House of Traps",
    "year": 1982
  },
  {
    "id": "sb:ode-to-gallantry-1982",
    "type": "movie",
    "name": "Ode to Gallantry",
    "year": 1982
  },
  {
    "id": "sb:demon-of-the-lute-1983",
    "type": "movie",
    "name": "Demon of the Lute",
    "year": 1983
  },
  {
    "id": "sb:holy-flame-of-the-martial-world-1983",
    "type": "movie",
    "name": "Holy Flame of the Martial World",
    "year": 1983
  },
  {
    "id": "sb:bastard-swordsman-1983",
    "type": "movie",
    "name": "Bastard Swordsman",
    "year": 1983
  },
  {
    "id": "sb:the-lady-is-the-boss-1983",
    "type": "movie",
    "name": "The Lady Is the Boss",
    "year": 1983
  },
  {
    "id": "sb:shaolin-intruders-1983",
    "type": "movie",
    "name": "Shaolin Intruders",
    "year": 1983
  },
  {
    "id": "sb:return-of-the-bastard-swordsman-1984",
    "type": "movie",
    "name": "Return of the Bastard Swordsman",
    "year": 1984
  },
  {
    "id": "sb:secret-service-of-the-imperial-court-1984",
    "type": "movie",
    "name": "Secret Service of the Imperial Court",
    "year": 1984
  },
  {
    "id": "sb:eight-diagram-pole-fighter-1984",
    "type": "movie",
    "name": "Eight Diagram Pole Fighter",
    "year": 1984
  },
  {
    "id": "sb:hong-kong-godfather-1985",
    "type": "movie",
    "name": "Hong Kong Godfather",
    "year": 1985
  },
  {
    "id": "sb:disciples-of-the-36th-chamber-1985",
    "type": "movie",
    "name": "Disciples of the 36th Chamber",
    "year": 1985
  },
  {
    "id": "sb:return-to-the-36th-chamber-1980",
    "type": "movie",
    "name": "Return to the 36th Chamber",
    "year": 1980
  }
].map(m => ({ ...m, poster: posterFor(m.name) }));

builder.defineCatalogHandler(({
  type, id, extra
}) => {
  if (type !== "movie" || id !== "shawbrothers") return Promise.resolve({ metas: [] });
  let results = TITLES;
  if (extra && extra.search) {
    const q = String(extra.search).toLowerCase();
    results = results.filter(m => m.name.toLowerCase().includes(q));
  }
  const skip = parseInt((extra && extra.skip) || 0, 10) || 0;
  const pageSize = 50;
  const slice = results.slice(skip, skip + pageSize);
  return Promise.resolve({ metas: slice.map(m => ({ id: m.id, type: "movie", name: m.name, poster: m.poster, year: m.year })) });
});

builder.defineMetaHandler((<built-in function id>) => {
  const m = TITLES.find(x => x.id === id);
  if (!m) return Promise.resolve({ meta: null });
  return Promise.resolve({
    meta: {
      id: m.id,
      type: "movie",
      name: m.name,
      poster: m.poster,
      year: m.year,
      genres: ["Action", "Martial Arts"],
      description: "Shaw Brothers / Celestial action title (catalog-only)."
    }
  });
});

const addonInterface = builder.getInterface();
const PORT = process.env.PORT || 7000;
serveHTTP(addonInterface, { port: PORT });
console.log(`Shaw Brothers addon running on http://localhost:${PORT}/manifest.json`);
