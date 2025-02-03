import Constants from '../lib/constants.js';
import Util from '../lib/util.js';

const AA = Constants.AFFIX_ACTION;
const AP = Constants.AFFIX_POSITION;
const DMG = Constants.DAMAGE_TYPE;
const RES = Constants.RESOURCE;

const ALL_AFFIXES = [
  {
    position: AP.PREFIX,
    titles: ['Warrior\'s', 'Blow'],
    spec: { action: AA.ATTACK, magnitude: 10, data: { damage: DMG.PHYSICAL } },
    weight: 100,
    group: 'offense'
  },
  {
    position: AP.PREFIX,
    titles: ['Thief\'s', 'Shock'],
    spec: { action: AA.ATTACK, magnitude: 10, data: { damage: DMG.ELEMENTAL } },
    weight: 100,
    group: 'offense'
  },
  {
    position: AP.PREFIX,
    titles: ['Adept\'s', 'Mistake'],
    spec: { action: AA.ATTACK, magnitude: 10, data: { damage: DMG.DARK } },
    weight: 100,
    group: 'offense'
  },

  {
    position: AP.PREFIX,
    titles: ['Shaman\'s', 'Heal'],
    spec: { action: AA.RESTORE, magnitude: 10, data: { resource: RES.LIFE } },
    weight: 50,
    group: 'restore'
  },


  {
    position: AP.SUFFIX,
    titles: ['of Calm', 'Calming'],
    spec: { action: AA.RESTORE, magnitude: 5, data: { resource: RES.MANA } },
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