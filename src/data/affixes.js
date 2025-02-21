import Constants from '../lib/constants.js';
import Util from '../lib/util.js';

const AA = Constants.AFFIX_ACTION;
const AP = Constants.AFFIX_POSITION;
const DMG = Constants.DAMAGE_TYPE;
const RES = Constants.RESOURCE;

const GEN_AFFIX_FAMILY = ({ base, scaling, titles }) => {
  let scale = (dest, src, pct) =>  {
    let prop;
    for (prop in src) {
      let spec = src[prop];
      let v = Util.interp(spec.min, spec.max, pct);
      dest[prop] = Math.floor(v);
    }
    return dest;
  };
  let affixes = [];
  let tiers = titles.length;
  let i, attrs;
  for (i = 0; i < tiers; i++) {
    let pct = i / (tiers - 1);
    let attrs = { tier: i+1, ...base };
    if (tiers > 1 && scaling) {
      attrs.titles = titles[i];
      if ('spec' in scaling) {
        attrs.spec = attrs.spec || {};
        scale(attrs.spec, scaling.spec, Util.cube(pct));
        delete scaling['spec'];
      }
      scale(attrs, scaling, pct, Util.cube(pct));
    }
    affixes.push(attrs)
  }
  return affixes;
};


let ALL_AFFIXES = [
  ...GEN_AFFIX_FAMILY({
    base: {
      position: AP.PREFIX,
      action: AA.ATTACK,
      spec: { type: DMG.PHYSICAL },
      tags: ['physical', 'attack'],
      // TODO: exclude affix groups when generating
      groups: 'physical attack',
      sortOrder: 1
    },
    scaling: {
      level: { min: 1, max: 30 },
      mana: { min: 1, max: 20 },
      magnitude: { min: 3, max: 30 },
      weight: { min: 200, max: 10 }
    },
    titles: [
      ['Squire\'s', 'Swing'],
      ['Hunter\'s', 'Swing'],
      ['Warrior\'s', 'Swing'],
      ['Soldier\'s', 'Swing'],
      ['Mercenary\'s', 'Swing'],
      ['Hero\'s', 'Swing'],
    ]
  }),
  ...GEN_AFFIX_FAMILY({
    base: {
      position: AP.PREFIX,
      action: AA.ATTACK,
      spec: { type: DMG.ELEMENTAL },
      tags: ['elemental', 'attack'],
      group: 'elemental attack',
      sortOrder: 2
    },
    scaling: {
      level: { min: 1, max: 30 },
      mana: { min: 1, max: 20 },
      magnitude: { min: 3, max: 30 },
      weight: { min: 200, max: 10 }
    },
    titles: [
      ['Pickpocket\'s', 'Slice'],
      ['Sneak\'s', 'Slice'],
      ['Thief\'s', 'Slice'],
      ['Thug\'s', 'Slice'],
      ['Poacher\'s', 'Slice'],
      ['Assassin\'s', 'Slice'],
    ]
  }),
  ...GEN_AFFIX_FAMILY({
    base: {
      position: AP.PREFIX,
      action: AA.SPELL,
      spec: { type: DMG.ELEMENTAL },
      tags: ['elemental', 'spell'],
      group: 'elemental spell',
      sortOrder: 3
    },
    scaling: {
      level: { min: 1, max: 30 },
      mana: { min: 1, max: 20 },
      magnitude: { min: 3, max: 30 },
      weight: { min: 200, max: 10 }
    },
    titles: [
      ['Pickpocket\'s', 'Cast'],
      ['Sneak\'s', 'Cast'],
      ['Thief\'s', 'Cast'],
      ['Thug\'s', 'Cast'],
      ['Poacher\'s', 'Cast'],
      ['Assassin\'s', 'Cast'],
    ]
  }),
  ...GEN_AFFIX_FAMILY({
    base: {
      position: AP.PREFIX,
      action: AA.SPELL,
      spec: { type: DMG.DARK },
      tags: ['dark', 'spell'],
      group: 'dark spell',
      sortOrder: 4
    },
    scaling: {
      level: { min: 1, max: 30 },
      mana: { min: 1, max: 20 },
      magnitude: { min: 3, max: 30 },
      weight: { min: 200, max: 10 }
    },
    titles: [
      ['Student\'s', 'Spell'],
      ['Apprentice\'s', 'Spell'],
      ['Scholar\'s', 'Spell'],
      ['Magician\'s', 'Spell'],
      ['Master\'s', 'Spell'],
      ['Wizard\'s', 'Spell'],
    ]
  }),

  ...GEN_AFFIX_FAMILY({
    base: {
      position: AP.SUFFIX,
      action: AA.AUTOPLAY,
      tags: [],
      group: 'autoplay',
      sortOrder: 999,
      weight: 50
    },
    titles: [ ['of Flashing', 'Flash']]
  }),

  ...GEN_AFFIX_FAMILY({
    base: {
      position: AP.SUFFIX,
      action: AA.RESTORE,
      spec: { resource: RES.LIFE },
      tags: [ 'life' ],
      group: 'restore life',
      sortOrder: 700
    },
    scaling: {
      level: { min: 1, max: 30 },
      magnitude: { min: 3, max: 200 },
      weight: { min: 50, max: 10 }
    },
    titles: [
      [ 'Novice\'s', 'Heal' ],
      [ 'Shaman\'s', 'Heal' ],
      [ 'Nurse\'s', 'Heal' ],
      [ 'Doctor\'s', 'Heal' ],
      [ 'Surgeon\'s', 'Heal' ],
    ]
  }),
  ...GEN_AFFIX_FAMILY({
    base: {
      position: AP.SUFFIX,
      action: AA.RESTORE,
      spec: { resource: RES.MANA },
      tags: [ 'mana' ],
      group: 'restore mana',
      sortOrder: 701
    },
    scaling: {
      level: { min: 1, max: 30 },
      magnitude: { min: 3, max: 200 },
      weight: { min: 50, max: 10 }
    },
    titles: [
      [ 'Initiate\'s', 'Meditate' ],
      [ 'Graduate\'s', 'Meditate' ],
      [ 'Professor\'s', 'Meditate' ],
      [ 'Philosopher\'s', 'Meditate' ],
      [ 'Monk\'s', 'Meditate' ],
    ]
  }),
  ...GEN_AFFIX_FAMILY({
    base: {
      position: AP.SUFFIX,
      action: AA.DRAW,
      tags: [ ],
      group: 'draw',
      sortOrder: 998
    },
    scaling: {
      level: { min: 1, max: 30 },
      magnitude: { min: 1, max: 3 },
      weight: { min: 100, max: 50 }
    },
    titles: [
      [ 'Juggler\'s', 'Finesse' ],
      [ 'Gymnast\'s', 'Finesse' ],
      [ 'Acrobat\'s', 'Finesse' ],
    ]
  }),
  ...GEN_AFFIX_FAMILY({
    base: {
      position: AP.SUFFIX,
      action: AA.DISCARD,
      tags: [ ],
      group: 'discard',
      sortOrder: 997
    },
    scaling: {
      level: { min: 1, max: 30 },
      magnitude: { min: 1, max: 3 },
      weight: { min: 100, max: 50 }
    },
    titles: [
      [ 'Uncouth\'s', 'Fumble' ],
      [ 'Fool\'s', 'Fumble' ],
      [ 'Jester\'s', 'Fumble' ],
    ]
  })

];

export default {
  /** Generates an affix, respecting weights */
  generateAffix: () => Util.wrng(ALL_AFFIXES),
  /** Generates an affix, respecting weights and a given filter of
   * the shape { key: [...vals ], ... } where 'key' is a property of
   * affixes and vals are the values to exclude or 'inst' for object
   * equality.
   */
  generateAffixExcluding: (filt) => {
    let preds = [], pred, k;
    for (k in filt) {
      pred = null;
      let vs = filt[k];
      // `for` will update k in-place, making all preds wrong except
      // the last & 'inst'
      let kk = k; 
      if (vs instanceof Function) {
        pred = (e) => vs(e[kk]);
      } else if (vs instanceof Array && vs.length > 0) {
        switch (k) {
          case 'inst':
            pred = (e) => vs.indexOf(e) == -1;
            break;
          default:
            pred = (e) => vs.indexOf(e[k]) == -1;
        }
      }
      if (pred != null) preds.push(pred);
    }
    if (preds.length == 0) {
      return Util.wrng(ALL_AFFIXES);
    } else if (preds.length == 1) {
      pred = preds[0];
    } else {
      pred = preds.reduce((a, b) => (x) => a(x) && b(x));
    }
    let filtered = ALL_AFFIXES.filter(pred);
    return (filtered.length > 0)
      ? Util.wrng(ALL_AFFIXES.filter(pred))
      : null;
  }
};