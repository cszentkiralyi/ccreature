import Constants from '../lib/constants.js';
import Util from '../lib/util.js';

const AA = Constants.AFFIX_ACTION;
const AP = Constants.AFFIX_POSITION;
const DMG = Constants.DAMAGE_TYPE;
const RES = Constants.RESOURCE;

const GEN_AFFIX_FAMILY = ({ base, scaling, titles }) => {
  let scale = (dest, src, pct) =>  {
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
      if ('spec' in scaling) {
        attrs.spec = attrs.spec || {};
        attrs.titles = titles[i];
        scale(attrs.spec, scaling.spec, Util.square(pct));
        delete scaling['spec'];
      }
      scale(attrs, scaling, pct, Util.square(pct));
    }
    affixes.push(attrs)
  }
  return affixes;
};


let __ALL_AFFIXES = [
  ...GEN_AFFIX_FAMILY({
    base: {
      position: AP.PREFIX,
      action: AA.ATTACK,
      spec: { type: DMG.PHYSICAL },
      tags: ['physical', 'attack'],
      // TODO: exclude affix groups when generating
      groups: 'physical attack'
    },
    scaling: {
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
      group: 'elemental attack'
    },
    scaling: {
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
      group: 'elemental spell'
    },
    scaling: {
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
      group: 'dark spell'
    },
    scaling: {
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
      group: 'restore life'
    },
    scaling: {
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
      group: 'restore mana'
    },
    scaling: {
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
      group: 'draw'
    },
    scaling: {
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
      group: 'discard'
    },
    scaling: {
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

const ALL_AFFIXES = [
  {
    position: AP.PREFIX,
    titles: ['Warrior\'s', 'Blow'],
    spec: { action: AA.ATTACK, magnitude: 10, spec: { damage: DMG.PHYSICAL } },
    weight: 100,
    group: 'offense'
  },
  {
    position: AP.PREFIX,
    titles: ['Thief\'s', 'Shock'],
    spec: { action: AA.ATTACK, magnitude: 10, spec: { damage: DMG.ELEMENTAL } },
    weight: 100,
    group: 'offense'
  },
  {
    position: AP.PREFIX,
    titles: ['Adept\'s', 'Incision'],
    spec: { action: AA.ATTACK, magnitude: 10, spec: { damage: DMG.DARK } },
    weight: 100,
    group: 'offense'
  },

  {
    position: AP.PREFIX,
    titles: ['Shaman\'s', 'Heal'],
    spec: { action: AA.RESTORE, magnitude: 10, spec: { resource: RES.LIFE } },
    weight: 50,
    group: 'restore'
  },


  {
    position: AP.SUFFIX,
    titles: ['of Calm', 'Calming'],
    spec: { action: AA.RESTORE, magnitude: 5, spec: { resource: RES.MANA } },
    weight: 50,
    group: 'restore'
  },

  {
    position: AP.SUFFIX,
    titles: ['of Flashing', 'Flash'],
    spec: { action: AA.AUTOPLAY },
    weight: 25,
    group: 'buff'
  },

  {
    position: AP.SUFFIX,
    titles: ['of Skill', 'Skill'],
    spec: { action: AA.DRAW, magnitude: 1 },
    weight: 25,
    group: 'buff'
  },
  {
    position: AP.SUFFIX,
    titles: ['of Fumbling', 'Fumble'],
    spec: { action: AA.DISCARD, magnitude: 1 },
    weight: 25,
    group: 'buff'
  }
];

const AFFIXES_BY_GROUP = Util.groupBy(ALL_AFFIXES, a => a.group);
const AFFIXES_BY_POSITION = Util.groupBy(ALL_AFFIXES, a => a.position);

export default {
  generateAffix: () => Util.wrng(ALL_AFFIXES),
  generateAffixExcluding: (filt) => {
    /* filt: { key: [...values], ... }
     * Weighted generation excluding certain values. Valid keys are:
     * - Any value on a record (group, weight, etc)
     * - inst for exact object equality (to exclude specific records by ref)
     */
    // TODO: optimize for filt having just one key
    let preds = [], pred, k;
    for (k in filt) {
      let vs = filt[k], pred;
      if (vs.length > 0) {
        switch (k) {
          case 'inst':
            pred = (e) => vs.indexOf(e) == -1;
            break;
          default:
            pred = (e, i) => vs.indexOf(e[k]) == -1;
        }
        preds.push(pred);
      }
    }
    if (preds.length == 0) {
      return Util.wrng(ALL_AFFIXES);
    } else if (preds.length == 1) {
      pred = preds[0];
    } else {
      pred = preds.reduce((f, p) => (e) => f(e) && p(e), preds[0], preds.slice(1));
    }
    return Util.wrng(ALL_AFFIXES.filter(pred));
  }
};