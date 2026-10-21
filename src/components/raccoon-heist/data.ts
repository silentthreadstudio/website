// Raccoon Heist game page: sprite sheets and copy.
// Art: the website sprite set + the teaser layers, one pixel density.
// coin_m (teaser coin at 1/3, alpha snapped) and cards_s (teaser cards halved, nearest) are the particle
// sheets: small enough to read as coins and cards next to the cast, with hard pixel edges. Copy and numbers follow the game's current design.

export interface Sheet {
  src: string;
  frames: number;
  cell: [number, number];
  fps: number;
}

const hd = (id: string, frames: number, cell: [number, number], fps = 1): Sheet => ({
  src: `/raccoon-heist/hd/${id}.webp`, frames, cell, fps,
});

export const SHEETS = {
  // Key-art Rocco only. Never rocco_cast / rocco_shrug.
  rocco_hero: hd('rocco_hero', 1, [239, 302]),
  rocco_fight: hd('rocco_fight', 1, [289, 302]),
  rocco_coins: hd('rocco_coins', 1, [213, 302]),
  rocco_payup: hd('rocco_payup', 1, [233, 302]),
  rat_dealer: hd('rat_dealer', 1, [202, 317]),
  rat_thug: hd('rat_thug', 1, [177, 303]),
  rats_right_pair: hd('rats_right_pair', 1, [316, 361]),
  vermino: hd('vermino', 2, [255, 300]),
  vermino_bust: hd('vermino_bust', 6, [116, 190], 4),
  slot_machine: hd('slot_machine', 7, [114, 220], 8),
  lockbox: hd('lockbox', 5, [95, 110], 10),
  charm_icons: hd('charm_icons', 5, [90, 96]),
  deal_icons: hd('deal_icons', 5, [90, 96]),
  power_icons: hd('power_icons', 3, [103, 96]),
  coin: hd('coin_m', 6, [27, 26], 10),
  cards: hd('cards_s', 4, [53, 61]),
} satisfies Record<string, Sheet>;

export type SheetId = keyof typeof SHEETS;

export const LOGLINE = 'A raccoon wins the worst casino in town. The Rat Mob wants their cut.';
export const STATUS = 'The core loop is done. Now building upgrades, powers and juice.';

/** Don Vermino, the night Rocco wins the deed. */
export const CATCH_LINES = [
  'Winner takes the casino. Congratulations, kid.',
  'Nice place. Shame if something happened to it.',
  "Protection's due at dawn. Every dawn.",
];

export const POWERS = [
  { name: 'All In', key: '1', rarity: 'rare', line: 'Bet the whole sack on a kill streak.' },
  { name: 'Double Down', key: '2', rarity: 'common', line: 'Hit twice as hard. Bleed twice as fast.' },
  { name: 'Jackpot Bomb', key: '3', rarity: 'common', line: 'Clear the room. Rain coins.' },
];

export const CHARMS = [
  { name: 'Four Leaf Clover', rarity: 'common', line: 'Luck, everywhere.' },
  { name: 'Marked Card', rarity: 'uncommon', line: 'Your cards go through.' },
  { name: 'Seventh Seal', rarity: 'uncommon', line: 'Lucky sevens pay.' },
  { name: 'Last Chip', rarity: 'uncommon', line: "Strongest when you're almost out." },
  { name: 'House Key', rarity: 'rare', line: 'Every wave hides a box.' },
];

/** deal_icons frames 0-2: each card's upside and its catch. */
export const DEALS = [
  { name: 'Fat Envelope', rarity: 'uncommon', up: 'Gold per coin +50%', down: 'Rat thugs move 20% faster' },
  { name: "The Boss's Loan", rarity: 'uncommon', up: 'A pile of gold, right now', down: "Next night's demand +25%" },
  { name: 'Glass Jaw', rarity: 'rare', up: 'Weapon damage +40%', down: 'Max HP -3' },
];

export const CAST = [
  { sheet: 'rocco_hero' as const, name: 'Rocco', tag: '"The Bandit"', line: 'Small-time thief. Too lucky to be honest.' },
  { sheet: 'rat_dealer' as const, name: 'The Card Shark', line: 'Keeps his distance. Flicks cards. Tuts.' },
  { sheet: 'rat_thug' as const, name: 'The Thug', line: 'Hired muscle in a tux. Paid in advance.' },
  { sheet: 'rats_right_pair' as const, name: 'Loan Shark & Bouncer', line: '"Interest!" / "Name\'s not on the list."' },
  { sheet: 'vermino' as const, frame: 1, name: 'Don Vermino', line: 'A reasonable rat. Wants his envelope.', boss: true },
];

/** Casino rooms (planned). Background crops are positions in the 688x384 room. */
export const ROOMS = [
  { name: 'The Lobby', adds: 'Where every run starts. One slot machine, three doors.', crop: [0.5, 0.75], start: true },
  { name: 'Slot Room', adds: 'A second slot machine.', crop: [0.02, 0.6] },
  { name: 'Bar', adds: 'A free drink every wave.', crop: [0.18, 0.12] },
  { name: 'Back Room', adds: 'The Card Altar: a mini Deal on the floor.', crop: [0.08, 0.95] },
  { name: 'Roulette Room', adds: 'A roulette table. Red or black.', crop: [0.98, 0.95] },
  { name: 'VIP Lounge', adds: 'A second Crew slot.', crop: [0.5, 0.35] },
  { name: 'Vault', adds: 'Start every run with gold.', vault: true },
];

/** Slot machine: cost and outcome weights from the current build. Gold amounts are the demo's. */
export type Reel = 'cherry' | 'bell' | 'bar' | 'lemon' | 'seven';
export const REELS: Reel[] = ['cherry', 'bell', 'bar', 'lemon', 'seven'];
export const SLOT = {
  cost: 60,
  start: 300,
  outcomes: [
    { id: 'bust', weight: 40, gold: 0, text: 'Bust. The house wins.' },
    { id: 'cherry', weight: 25, gold: 90, text: 'Cherries. Coins spray out: +90.' },
    { id: 'bell', weight: 12, gold: 0, text: 'Bell. +50% damage for 10 seconds.' },
    { id: 'bar', weight: 10, gold: 0, text: 'Bar. +1 power charge.' },
    { id: 'lemon', weight: 10, gold: 0, text: 'Lemon. Three walking dice burst out.' },
    { id: 'seven', weight: 3, gold: 600, text: '777. JACKPOT: ten times the bet.' },
  ],
};

/** Lockbox outcomes (plain box). */
export const LOCKBOX = [
  { weight: 45, gold: true, text: 'Gold burst. Go collect.' },
  { weight: 25, gold: false, text: '+1 power charge.' },
  { weight: 10, gold: false, text: 'A charm.' },
  { weight: 20, gold: false, text: 'A moth flies out. Rocco shrugs.' },
];

// Reel symbols as pixel grids (one char = one art pixel), drawn as crisp SVG in the game palette.
export const PALETTE: Record<string, string> = {
  k: '#14101F', r: '#E5484D', R: '#FF9A8A', d: '#9B2335', g: '#3BB273', G: '#1F6F4A',
  y: '#FFC93C', Y: '#FFE9A0', o: '#C7861E', w: '#F4EEDC',
};
export const SYMBOLS: Record<Reel, string[]> = {
  cherry: [
    '.......kk..',
    '......kGgk.',
    '.....kgk...',
    '....kgk....',
    '...kg.gk...',
    '..kkk..kkk.',
    '.krRrk.kRrk',
    '.krrrk.krrk',
    '.kdrrk.kdrk',
    '..kkk..kkk.',
  ],
  bell: [
    '.....k.....',
    '....kyk....',
    '...kyYyk...',
    '..kyYyyyk..',
    '..kyYyyyk..',
    '..kyyyyyk..',
    '.kyyyyyyyk.',
    'koooooooook',
    '.kkkkokkkk.',
    '....kkk....',
  ],
  bar: [
    '.............',
    'kkkkkkkkkkkkk',
    'kwwkkkwkkwwkk',
    'kwkwkwkwkwkwk',
    'kwwkkwwwkwwkk',
    'kwkwkwkwkwkwk',
    'kwwkkwkwkwkwk',
    'kkkkkkkkkkkkk',
    '.............',
  ],
  lemon: [
    '...........',
    '......kG...',
    '...kkkkgk..',
    '..kYYyyykk.',
    '.kYyyyyyyk.',
    'kYyyyyyyyyk',
    'kyyyyyyyyok',
    '.kyyyyyyok.',
    '..kkooookk.',
    '....kkkk...',
  ],
  seven: [
    'kkkkkkkkkk.',
    'kRRrrrrrrk.',
    'kddddddrrk.',
    'kkkkkkrrk..',
    '....krrk...',
    '...krrk....',
    '...krrk....',
    '..krrk.....',
    '..krrk.....',
    '..kkkk.....',
  ],
};

/** HUD icons (same pixel-grid format as the reel symbols). */
export const ICONS: Record<'coin' | 'moon' | 'sun', string[]> = {
  coin: [
    '..kkkkk..',
    '.kyYYyyk.',
    'kyYyooyyk',
    'kYyoyyoyk',
    'kyyoyyoyk',
    'kyyoyyoyk',
    'kyyyooyok',
    '.kyyyyok.',
    '..kkkkk..',
  ],
  moon: [
    '...kkkk..',
    '..kYYk...',
    '.kYYk....',
    'kYYYk....',
    'kYYYk....',
    'kYYYYk...',
    '.kYYYYkkk',
    '..kYYYYYk',
    '...kkkkk.',
  ],
  sun: [
    '....y....',
    '.y.....y.',
    '...kkk...',
    '..kYYyk..',
    'y.kYyyk.y',
    '..kyyok..',
    '...kkk...',
    '.y.....y.',
    '....y....',
  ],
};
