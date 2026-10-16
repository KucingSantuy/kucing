const C = {
  wall: '#F5E6D3', wallShadow: '#EBD8C4', floor: '#D9C4AA',
  floorLine: '#C4A888', baseboard: '#B09878',
  outline: '#3D2B1F', fur: '#C4956A', lightFur: '#D9B48C',
  innerEar: '#E0909A', eyeWhite: '#FFF8F0', pupil: '#3D2B1F',
  nose: '#D48070', blush: '#E8889A', tummy: '#F0DCC8',
  nightSky: '#192040', nightSkyLt: '#1E2850',
  star1: '#FFE8A0', star2: '#BBAA70', moon: '#F0E0B0',
  winFrame: '#8B6848', winFrameDk: '#6B4830',
  rug: '#C47282', rugLt: '#D48898', rugDk: '#A05868',
  plant: '#7B9C6A', plantDk: '#5A7B4A', pot: '#B08060', potDk: '#8B6040',
  heart: '#E86878', sparkle: '#FFE8C0',
  fish: '#E07850', fishEye: '#FFF8F0',
  yarn: '#E05868', yarnLt: '#F08898',
  blanket1: '#C47282', blanket2: '#E8B888', blanket3: '#78A898',
  wood: '#8B6848', woodDk: '#6B4830',
  lampGold: '#FFE078', lampWarm: '#FFF8E0',
  water: '#78A8D8', foodKibble: '#A86840',
  bookRed: '#D45868', bookBlue: '#6888B8', bookGreen: '#68A878'
};

const CAT_W = 24, CAT_H = 22;
const CAT_BODY = [
  '....oo..........oo......',
  '...oifo........ofio.....',
  '..oiffo........offio....',
  '..offffooooooooffffo....',
  '.offffffffffffffffffffo.',
  '.offffffffffffffffffffo.',
  '.offfwwwffffffwwwffffo..',
  '.offfwewffffffwewffffo..',
  '.offfffffffffffffffffo..',
  '.offffffffnnfffffffffo..',
  '.offbbffffffffffbbfffo..',
  '.offffffffffffffffffffo.',
  '.offffffffffffffffffffo.',
  '.offffffffffffffffffffo.',
  '.offfftttttttttttffffo..',
  '.offfftttttttttttffffo..',
  '.offfftttttttttttffffo..',
  '.offffffffffffffffffffo.',
  '..offfffffffffffffffo...',
  '..offfffffffffffffffo...',
  '...offo........offo.....',
  '...oooo........oooo.....'
];

const SP = {
  'o': C.outline, 'f': C.fur, 'i': C.innerEar, 'w': C.eyeWhite,
  'e': C.pupil, 'n': C.nose, 'b': C.blush, 't': C.tummy
};

const EYES = {
  normal: ['offfwwwffffffwwwffffo', 'offfwewffffffwewffffo'],
  blink: ['offffffffffffffffffffo', 'offfooofffffffooffffo'],
  happy: ['offffffffffffffffffffo', 'offffefffffffefeffffo'],
  sleepy: ['offfooofffffffooffffo', 'offfwwwffffffwwwffffo'],
  left: ['offfwwwffffffwwwffffo', 'offfewwffffffewwffffo'],
  right: ['offfwwwffffffwwwffffo', 'offfwweffffffwweffffo'],
  excited: ['offfoowffffffwooffffo', 'offfowwffffffwwofffo']
};

const TAIL_FRAMES = [
  ['..o', '.of', '.of', 'of.', 'of.', 'o..', '...'],
  ['.o.', '.of', '.of', '.of', '.of', '.o.', '...'],
  ['o..', 'fo.', 'fo.', '.fo', '.fo', '..o', '...'],
  ['.o.', '.of', '.of', '.of', '.of', '.o.', '...']
];

const FISH_SPR = [
  '..oooo....',
  '.offffoo..',
  'ooffwwffo.',
  '.offfffffo',
  'ooffffffo.',
  '.offffoo..',
  '..oooo....'
];
const FISH_PAL = { 'o': C.outline, 'f': C.fish, 'w': C.fishEye };

const YARN_SPR = [
  '..oooo..',
  '.oyyyyo.',
  'oyyxyyyo',
  'oyxyyyyo',
  'oyyyxyyo',
  'oyyyyxyo',
  '.oyyyyo.',
  '..oooo..'
];
const YARN_PAL = { 'o': C.outline, 'y': C.yarn, 'x': C.yarnLt };

const BRUSH_SPR = [
  '..oooo',
  '.owwwwo',
  'owwwwoo',
  '.oooo..',
  '..oo...',
  '...oo..',
  '....o..'
];
const BRUSH_PAL = { 'o': C.outline, 'w': C.blush };

const HEART_SPR = [
  '.o.o.',
  'ooooo',
  'ooooo',
  '.ooo.',
  '..o..'
];

const BLANKET_SPR = [
  '..oooooooooooooooooooooo..',
  '.o1122331122331122331122o.',
  'o112233112233112233112233o',
  'o223311223311223311223311o',
  'o223311223311223311223311o',
  'o331122331122331122331122o',
  'o331122331122331122331122o',
  'o112233112233112233112233o',
  'o112233112233112233112233o',
  'o223311223311223311223311o',
  '.oooooooooooooooooooooooo.'
];
const BLANKET_PAL = {
  'o': C.outline, '1': C.blanket1, '2': C.blanket2, '3': C.blanket3
};

const BOUQUET_SPR = [
  '....rr...ww....',
  '...rrrr.wwww...',
  '..yy.rrggww.pp.',
  '.yyyy.gggg.pppp',
  '..yy.ggggbb.pp.',
  '...ooggggggoo..',
  '..occcoggoocco.',
  '.occcccooccccco',
  '.occccckkccccco',
  '..occcckkcccc..',
  '...occkkkcco...',
  '....ockkcco....',
  '.....occo......',
  '......oo.......'
];
const BOUQUET_PAL = {
  'o': C.outline, 'r': '#E05868', 'w': '#FFF8F0',
  'y': '#FFE078', 'p': '#D488C0', 'g': '#7B9C6A',
  'b': '#5A7B4A', 'c': '#D9B48C', 'k': '#E05868'
};

const LAMP_SPR = [
  '....o....',
  '....o....',
  '....o....',
  '...ooo...',
  '..ogggo..',
  '.ogggggo.',
  'ogggggggo',
  '..owwwo..',
  '...owo...'
];
const LAMP_PAL = { 'o': C.outline, 'g': C.lampGold, 'w': C.lampWarm };

const CLOCK_SPR = [
  '..oooo..',
  '.owwwwo.',
  'owwhwwwo',
  'owwhhhwo',
  'owwwwwwo',
  '.owwwwo.',
  '..oooo..'
];
const CLOCK_PAL = { 'o': C.woodDk, 'w': C.eyeWhite, 'h': C.outline };

const SHELF_SPR = [
  '..rrr.bb.gg..pp..',
  '.orrr.bb.gg.oppo.',
  'orrrr.bb.gg.opppo',
  'ooooooooooooooooo',
  '..oo.........oo..'
];
const SHELF_PAL = {
  'o': C.woodDk, 'r': C.bookRed, 'b': C.bookBlue,
  'g': C.bookGreen, 'p': C.heart
};

const BOWL_SPR = [
  '...ooo.....ooo...',
  '..owwwo...offfo..',
  '.owwwwwb.offffffb',
  '.owwwwwb.offffffb',
  '..obbbb...obbbb..'
];
const BOWL_PAL = {
  'o': C.outline, 'b': '#8B7060',
  'w': C.water, 'f': C.foodKibble
};

const MENU_ICONS = {
  pet: {
    spr: [
      '..oo....oo..',
      '.offo..offo.',
      '.offo..offo.',
      '..oo....oo..',
      '...oooooo...',
      '..offffffo..',
      '.offffffffo.',
      '.offffffffo.',
      '..oooooooo..'
    ],
    pal: { 'o': '#3D2B1F', 'f': '#C4956A' },
    ox: 0, oy: 1
  },
  flowers: {
    spr: [
      '...rr..yy...',
      '..rrrr.yyyy.',
      '.rrrrr.yyyyy',
      '..rrrr.yyyy.',
      '...rrggyy...',
      '....gggg....',
      '.....gg.....',
      '....gggg....',
      '.....gg.....'
    ],
    pal: { 'r': '#E05868', 'y': '#FFE078', 'g': '#7B9C6A' },
    ox: 0, oy: 1
  },
  snack: {
    spr: [
      '....oooo....',
      '..ooffffoo..',
      '.ooffwwfffo.',
      'ooffffffffo.',
      '.oofffffffo.',
      '..ooffffoo..',
      '....oooo....'
    ],
    pal: { 'o': '#3D2B1F', 'f': '#E07850', 'w': '#FFF8F0' },
    ox: 0, oy: 2
  },
  yarn: {
    spr: [
      '....oooo....',
      '..ooyyyyoo..',
      '.oyyyxyyyyo.',
      'oyyxyyyyyyyo',
      'oyyyyxyyyyyo',
      '.oyyyyyxyyo.',
      '..ooyyyyoo..',
      '....oooo....'
    ],
    pal: { 'o': '#3D2B1F', 'y': '#E05868', 'x': '#F08898' },
    ox: 0, oy: 2
  },
  brush: {
    spr: [
      '....ooooo...',
      '...owwwwwo..',
      '..owwwwwwoo.',
      '...oooooo...',
      '....ooo.....',
      '.....ooo....',
      '......ooo...',
      '.......oo...'
    ],
    pal: { 'o': '#3D2B1F', 'w': '#E8889A' },
    ox: 0, oy: 2
  },
  blanket: {
    spr: [
      '....oooo....',
      '..oowwwwoo..',
      '.oowwwwww...',
      '.ooww.......',
      '.ooww.......',
      '.oowwwwww...',
      '..oowwwwoo..',
      '....oooo....'
    ],
    pal: { 'o': '#3D2B1F', 'w': '#FFE078' },
    ox: 0, oy: 2
  }
};

const SPEAKER_ON_SPR = [
  '..o.....',
  '.ofo..o.',
  'offo...o',
  'offo...o',
  'offo...o',
  '.ofo..o.',
  '..o.....'
];
const SPEAKER_OFF_SPR = [
  '..o...oo',
  '.ofo...o',
  'offo..o.',
  'offo.o..',
  'offo..o.',
  '.ofo...o',
  '..o...oo'
];
const SPEAKER_PAL = { 'o': '#3D2B1F', 'f': '#C4956A' };

const BANNER_HEART_SPR = [
  '.ooo.ooo.',
  'ooooooooo',
  'ooooooooo',
  '.ooooooo.',
  '..ooooo..',
  '...ooo...',
  '....o....'
];
const BANNER_HEART_PAL = { 'o': '#E05868' };

const NAME_PAW_SPR = [
  '..o..o..',
  '.ofo.ofo',
  '..o..o..',
  '..oooo..',
  '.offffo.',
  '..oooo..'
];
const NAME_PAW_PAL = { 'o': '#3D2B1F', 'f': '#C4956A' };
